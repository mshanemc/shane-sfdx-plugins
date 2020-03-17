import { flags, SfdxCommand } from '@salesforce/command';
import { Connection, SfdxError } from '@salesforce/core';
import chalk from 'chalk';
import { Field } from 'jsforce/describe-result';

import { getExisting } from '../../../shared/getExisting';
import { setupArray } from '../../../shared/setupArray';
import { getParsed } from '../../../shared/xml2jsAsync';

import { ToolingAPIDescribeQueryResult } from '../../../shared/typeDefs';
import { writeJSONasXML } from '../../../shared/JSONXMLtools';

import fs = require('fs-extra');

let conn: Connection;
// tslint:disable-next-line: no-any
let objectDescribe: Map<string, Map<string, any>>;
let resolvedDescribePromises = 0;

export default class PermSetCreate extends SfdxCommand {
    public static description = 'create or add stuff to a permset with maximum access';

    public static examples = [
        `sfdx shane:permset:create -n MyPermSet1 -o Something__c -f Some_Field__c
    // create a permset in force-app/main/default for the object/field.  If MyPermSet1 doesn't exist, it will be created.
    `,
        `sfdx shane:permset:create -n MyPermSet1 -o Something__c
    // create a permset in force-app/main/default for every field on Something__c.
    `,
        `sfdx shane:permset:create -n MyPermSet1
    // create a permset in force-app/main/default for every field on every object!
    `,
        `sfdx shane:permset:create -n MyPermSet1 -t
    // create a permset in force-app/main/default for every field on every object.  If there's a tab for any of those objects, add that tab to the permset, too
    `,
        `sfdx shane:permset:create -n MyPermSet1 -c
    // create a permset in force-app/main/default for every field on every object, checking on org that all fields are permissionable
    `
    ];

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            required: true,
            description: "path to existing permset.  If it exists, new perms will be added to it.  If not, then it'll be created for you"
        }),
        object: flags.string({
            char: 'o',
            description: 'API name of an object to add perms for.  If blank, then you mean ALL the objects and ALL their fields and ALL their tabs'
        }),
        field: flags.string({
            char: 'f',
            description: 'API name of an field to add perms for.  Required --object If blank, then you mean all the fields',
            dependsOn: ['object']
        }),
        recordtype: flags.string({
            char: 'r',
            description: 'API name of a record type to add perms for.  Required --object If blank, then you mean all the record types',
            dependsOn: ['object']
        }),
        application: flags.string({
            char: 'a',
            description: 'API name of an application to add perms for.  If blank, then you mean all the applications'
        }),
        directory: flags.directory({
            char: 'd',
            default: 'force-app/main/default',
            description: 'Where is all this metadata? defaults to force-app/main/default'
        }),
        tab: flags.boolean({ char: 't', description: 'also add the tab for the specified object (or all objects if there is no specified objects)' }),
        checkpermissionable: flags.boolean({
            char: 'c',
            description: "some fields' permissions can't be deducted from metadata, use describe on org to check if field is permissionable"
        }),
        verbose: flags.builtin()
    };

    protected static requiresProject = true;

    protected static supportsUsername = true;

    public async run(): Promise<any> {
        // fail early on lack of username
        if (this.flags.checkpermissionable && !this.org) {
            throw new SfdxError(`username is required when using --checkpermissionable`);
        }

        // tslint:disable-next-line: no-any
        objectDescribe = new Map<string, Map<string, any>>();

        const targetFilename = `${this.flags.directory}/permissionsets/${this.flags.name}.permissionset-meta.xml`;
        const targetLocationObjects = `${this.flags.directory}/objects`;

        // Validating passed field exists
        if (this.flags.field && !fs.existsSync(`${targetLocationObjects}/${this.flags.object}/fields/${this.flags.field}.field-meta.xml`)) {
            throw new Error(`Field does not exist: ${this.flags.fields}`);
        }

        // Validating passed record type exists
        if (
            this.flags.recordtype &&
            !fs.existsSync(`${targetLocationObjects}/${this.flags.object}/recordTypes/${this.flags.recordtype}.recordType-meta.xml`)
        ) {
            throw new Error(`Record type does not exist: ${this.flags.recordtype}`);
        }

        let existing = await getExisting(targetFilename, 'PermissionSet', {
            '@': {
                xmlns: 'http://soap.sforce.com/2006/04/metadata'
            },
            hasActivationRequired: 'false',
            label: this.flags.name
        });

        // Adding applications access
        if (this.flags.application) {
            // Flag was passed, check that application exists
            if (!fs.existsSync(`${this.flags.directory}/applications/${this.flags.application}.app-meta.xml`)) {
                throw new Error(`Application does not exist: ${this.flags.application}`);
            } else {
                existing = await this.addApplicationPerms(existing, this.flags.application);
            }
        } else {
            existing = await this.addAllApplicationPermissions(existing);
        }

        // let objectList: Array<string> = new Array<string>();
        const objectList: Set<string> = new Set<string>();

        if (!this.flags.object) {
            const files = fs.readdirSync(targetLocationObjects);
            files.forEach(file => objectList.add(file));
        } else {
            objectList.add(this.flags.object);
        }

        this.ux.log(`Object list is ${[...objectList]}`);

        if (this.flags.checkpermissionable) {
            conn = this.org.getConnection();

            this.ux.startSpinner('Getting objects describe from org');

            if (objectList.has('Activity')) {
                // Describe call doesn't work with Activity, but works with Event & Task
                // Both of them can be used for fieldPermissions
                objectList.delete('Activity');
                objectList.add('Event');
                objectList.add('Task');
            }

            // Calling describe on all sObjects - don't think you can do this in only 1 call
            const describePromises = [];

            for (const objectName of objectList) {
                describePromises.push(
                    this.getFieldsPermissions(objectName)
                        .then(result => {
                            objectDescribe.set(objectName, result);
                            resolvedDescribePromises += 1;
                            this.ux.setSpinnerStatus(`${resolvedDescribePromises}/${objectList.size}`);
                        })
                        .catch(error => {
                            error.objectName = objectName;
                            throw error;
                        })
                );
            }

            await Promise.all(describePromises).catch(error => {
                // Looks like the process is still waiting for other promises to resolve before exiting, how to avoid that ?
                this.ux.stopSpinner(error);
                throw new SfdxError(`Unable to get describe for object ${error.objectName}`);
            });
            this.ux.stopSpinner('Done.');
        }

        // do the objects
        for (const obj of objectList) {
            if (fs.existsSync(`${targetLocationObjects}/${obj}`)) {
                existing = this.addObjectPerms(existing, obj);

                if (this.flags.field) {
                    existing = await this.addFieldPerms(existing, this.flags.object, this.flags.field);
                } else {
                    // all the fields
                    existing = await this.addAllFieldPermissions(existing, obj);
                }

                if (this.flags.tab && fs.existsSync(`${this.flags.directory}/tabs/${obj}.tab-meta.xml`)) {
                    // we're doing tabs, and there is one, so add it to the permset
                    existing = this.addTab(existing, obj);
                }

                if (this.flags.recordtype) {
                    existing = await this.addRecordTypePerms(existing, this.flags.object, this.flags.recordtype);
                } else {
                    // all the fields
                    existing = await this.addAllRecordTypePermissions(existing, obj);
                }
            } else {
                this.ux.error(chalk.red(`Couldn't find that object in ${targetLocationObjects}/${this.flags.object}`));
            }
        }

        await fs.ensureDir(`${this.flags.directory}/permissionsets`);

        await writeJSONasXML({
            path: targetFilename,
            json: existing,
            type: 'PermissionSet'
        });
        this.ux.log(chalk.green(`Permissions added in ${targetFilename}`));
        return existing; // for someone who wants the JSON?
    }

    public addObjectPerms(existing, objectName: string) {
        // make sure it the parent level objectPermissions[] exists

        const existingClone = setupArray(setupArray(existing, 'objectPermissions'), 'customMetadataTypeAccesses');

        if (
            existingClone.objectPermissions.find(e => e.object === objectName) ||
            existingClone.customMetadataTypeAccesses.find(e => e.name === objectName)
        ) {
            this.ux.log(`Object Permission already exists: ${objectName}.  Nothing to add.`);
            return existingClone;
        }
        if (objectName.endsWith('__c')) {
            this.ux.log(`Added regular object perms for ${objectName}`);
            existingClone.objectPermissions.push({
                allowCreate: 'true',
                allowDelete: 'true',
                allowEdit: 'true',
                allowRead: 'true',
                modifyAllRecords: 'true',
                object: objectName,
                viewAllRecords: 'true'
            });
        } else if (objectName.endsWith('__e')) {
            this.ux.log(`Added object perms for platform event ${objectName}`);
            existingClone.objectPermissions.push({
                allowCreate: 'true',
                allowRead: 'true',
                object: objectName
            });
        } else if (objectName.endsWith('__b')) {
            this.ux.log(`Added object perms for big object ${objectName}`);
            existingClone.objectPermissions.push({
                allowCreate: 'true',
                allowRead: 'true',
                object: objectName
            });
        } else if (objectName.endsWith('__mdt')) {
            this.ux.log(`Added cmdt perms for ${objectName}`);
            existingClone.customMetadataTypeAccesses.push({
                enabled: 'true',
                name: objectName
            });
        }
        return existingClone;
    }

    public async addFieldPerms(existing, objectName: string, fieldName: string) {
        // make sure it the parent level objectPermissions[] exists
        const targetLocationObjects = `${this.flags.directory}/objects`;

        const existingClone = setupArray(existing, 'fieldPermissions');

        if (
            existingClone.fieldPermissions.find(e => {
                return e.field === `${objectName}.${fieldName}`;
            })
        ) {
            this.ux.log(`Field Permission already exists: ${objectName}.${fieldName}.  Nothing to add.`);
            return existingClone;
        }
        // get the field
        if (this.flags.checkpermissionable) {
            // Use org instead to know if field is creatable/updatable/permissionable
            if (objectDescribe.has(objectName) && objectDescribe.get(objectName).has(fieldName)) {
                const fieldDescribe = objectDescribe.get(objectName).get(fieldName);

                // Check we can add permission, for instance mandatory fields are readable and editable anyway
                // Adding access rights to them will throw an error
                if (fieldDescribe.IsPermissionable) {
                    const editable = fieldDescribe.IsCreatable && fieldDescribe.IsUpdatable;
                    existingClone.fieldPermissions.push({
                        readable: 'true',
                        editable: `${editable}`,
                        field: `${objectName}.${fieldName}`
                    });
                    this.ux.log(`Read${editable ? '/Edit' : ''} permission added for field ${objectName}/${fieldName} `);
                }
            } else {
                this.ux.warn(chalk.yellow(`field not found on org: ${objectName}/${fieldName}`));
            }
        } else if (fs.existsSync(`${targetLocationObjects}/${objectName}/fields/${fieldName}.field-meta.xml`)) {
            // tslint:disable-next-line: no-any
            const fieldJSON = (await getParsed(
                await fs.readFile(`${targetLocationObjects}/${objectName}/fields/${fieldName}.field-meta.xml`)
            )) as any;

            if (this.flags.verbose) {
                this.ux.logJson(fieldJSON);
            }

            // Is it required at the DB level?
            if (
                fieldJSON.CustomField.required === 'true' ||
                fieldJSON.CustomField.type === 'MasterDetail' ||
                !fieldJSON.CustomField.type ||
                fieldJSON.CustomField.fullName === 'OwnerId'
            ) {
                this.ux.log(`required field ${objectName}/${fieldName} needs no permissions `);
            } else if (fieldJSON.CustomField.type === 'Summary' || fieldJSON.CustomField.type === 'AutoNumber' || fieldJSON.CustomField.formula) {
                // these are read-only types
                existingClone.fieldPermissions.push({
                    readable: 'true',
                    field: `${objectName}.${fieldName}`
                });
                this.ux.log(`Read-only permission added for field ${objectName}/${fieldName} `);
            } else {
                existingClone.fieldPermissions.push({
                    readable: 'true',
                    editable: 'true',
                    field: `${objectName}.${fieldName}`
                });
                this.ux.log(`Read/Edit permission added for field ${objectName}/${fieldName} `);
            }
        } else {
            throw new Error(`field not found: ${objectName}/${fieldName}`);
        }

        return existingClone;
    }

    // add field permissions
    public async addAllFieldPermissions(existing, objectName: string) {
        // get all the fields for that object
        this.ux.log(`------ going to add all fields for ${objectName}`);
        const fieldsLocation = `${this.flags.directory}/objects/${objectName}/fields`;

        if (!fs.existsSync(fieldsLocation)) {
            this.ux.warn(chalk.yellow(`there is no fields folder at ${fieldsLocation}`));
            return existing;
        }

        const fields = fs.readdirSync(fieldsLocation);

        // iterate through the field builder thing
        for (const fieldFileName of fields) {
            existing = await this.addFieldPerms(existing, objectName, fieldFileName.split('.')[0]);
        }

        return existing;
    }

    public async addRecordTypePerms(existing, objectName: string, recordTypeName: string) {
        const existingClone = setupArray(existing, 'recordTypeVisibilities');

        if (
            existingClone.recordTypeVisibilities.find(e => {
                return e.recordType === `${objectName}.${recordTypeName}`;
            })
        ) {
            this.ux.log(`Record type Permission already exists: ${objectName}.${recordTypeName}.  Nothing to add.`);
            return existingClone;
        }

        existingClone.recordTypeVisibilities.push({
            recordType: `${objectName}.${recordTypeName}`,
            visible: true
        });

        this.ux.log(`added record type permission for ${objectName}`);

        return existingClone;
    }

    public async addAllRecordTypePermissions(existing, objectName: string) {
        // get all the record types for that object
        this.ux.log(`------ going to add all record types for ${objectName}`);
        const recordTypesLocation = `${this.flags.directory}/objects/${objectName}/recordTypes`;

        if (!fs.existsSync(recordTypesLocation)) {
            this.ux.warn(chalk.yellow(`there is no recordTypes folder at ${recordTypesLocation}`));
            return existing;
        }

        const recordTypes = await fs.readdir(recordTypesLocation);

        let existingClone = { ...existing };
        // iterate through the record types
        for (const recordTypeFileName of recordTypes) {
            existingClone = await this.addRecordTypePerms(existingClone, objectName, recordTypeFileName.replace('.recordType-meta.xml', ''));
        }

        return existingClone;
    }

    public async addApplicationPerms(existing, applicationName: string) {
        existing = setupArray(existing, 'applicationVisibilities');

        if (
            existing.applicationVisibilities.find(e => {
                return e.application === `${applicationName}`;
            })
        ) {
            this.ux.log(`Application Permission already exists: ${applicationName}.  Nothing to add.`);
            return existing;
        }
        existing = setupArray(existing, 'applicationVisibilities');

        existing.applicationVisibilities.push({
            application: `${applicationName}`,
            visible: true
        });

        this.ux.log(`added application permission for ${applicationName}`);

        return existing;
    }

    public async addAllApplicationPermissions(existing) {
        // get all the applications
        this.ux.log(`------ going to add all applications`);
        const applicationsLocation = `${this.flags.directory}/applications`;

        if (!fs.existsSync(applicationsLocation)) {
            this.ux.warn(chalk.yellow(`there is no applications folder at ${applicationsLocation}`));
            return existing;
        }

        const applications = fs.readdirSync(applicationsLocation);

        // iterate through the applications
        for (const application of applications) {
            existing = await this.addApplicationPerms(existing, application.replace('.app-meta.xml', ''));
        }

        return existing;
    }

    public addTab(existing, objectName: string) {
        // only __c and __x

        // this.ux.log(`doing tab for ${objectName}`);

        if (!(objectName.includes('__c') || objectName.includes('__x'))) {
            this.ux.warn(chalk.yellow(`Tab for this object type is not supported: ${objectName}`));
            return existing;
        }

        existing = setupArray(existing, 'tabSettings');

        existing.tabSettings.push({
            tab: objectName,
            visibility: 'Visible'
        });

        this.ux.log(`added tab permission for ${objectName}`);

        // this.ux.log('existing, after all modification is');
        // this.ux.logJson(existing);
        return existing;
    }

    public async getFieldsPermissions(objectName: string) {
        const fieldsPermissions: Map<string, Field> = new Map<string, Field>();
        const describeQuery = `Select Name,IsPermissionable,IsCreatable,IsUpdatable from EntityParticle where EntityDefinition.QualifiedApiName = '${objectName}'`;
        const describeResult: ToolingAPIDescribeQueryResult = await conn.tooling.query(describeQuery);

        for (const field of describeResult.records) {
            fieldsPermissions.set(field.name, field);
        }

        return fieldsPermissions;
    }
}
