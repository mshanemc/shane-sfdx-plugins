import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');

import { fixExistingDollarSign, getExisting } from '../../../../shared/getExisting';
import { metadataTypes } from '../../../../shared/permsetProfileMetadata';
import { setupArray } from '../../../../shared/setupArray';

import * as options from '../../../../shared/js2xmlStandardOptions';

export default class PermAlign extends SfdxCommand {
    public static description = 'align profiles with ';

    public static examples = [
        `sfdx shane:object:perms:align
// go through all the profiles/permsets in force-app/main/default and remove references to stuff that isn't in local source
`
    ];

    protected static flagsConfig = {
        directory: flags.directory({ char: 'd', default: 'force-app/main/default', description: 'Where is all this metadata?' })
    };

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const profileDirectory = `${this.flags.directory}/profiles`;
        const permsetDirectory = `${this.flags.directory}/permissionsets`;

        if (!this.flags.specific) {
            // just do all of them

            if (fs.existsSync(profileDirectory)) {
                const profiles = fs.readdirSync(profileDirectory);
                for (const p of profiles) {
                    const targetFilename = `${profileDirectory}/${p}`;
                    await this.removePerms(targetFilename, 'Profile');
                }
            } else {
                this.ux.warn('no profiles found');
            }

            if (fs.existsSync(permsetDirectory)) {
                const permsets = fs.readdirSync(permsetDirectory);
                for (const p of permsets) {
                    const targetFilename = `${permsetDirectory}/${p}`;
                    await this.removePerms(targetFilename, 'PermissionSet');
                }
            } else {
                this.ux.warn('no perm sets found');
            }
            // } else if (this.flags.specific) {
            //     // ok, what kind is it and does it exist?
            //     if (fs.existsSync(`${profileDirectory}/${this.flags.specific}`)) {
            //         await this.removePerms(this.flags.specific, 'Profile');
            //     } else if (fs.existsSync(`${permsetDirectory}/${this.flags.specific}`)) {
            //         await this.removePerms(this.flags.specific, 'PermissionSet');
            //     } else {
            //         throw new Error(`not found: ${this.flags.specific}`);
            //     }
        }
        this.ux.log(chalk.green('Done!'));
    }

    public checkTab(tabName: string, tabs: string[], objects: string[]): boolean {
        const tabFileName = tabName + '.tab-meta.xml';
        if (tabs.includes(tabFileName)) {
            return true; // the tab is there locally, so include it in the profile
        } else if (objects.includes(tabName.replace('standard-', ''))) {
            return true; // the object is there locally, so include the tab
        } else {
            return false;
        }
    }

    // tslint:disable-next-line:no-any
    public async removePerms(targetFilename: string, profileOrPermset: 'Profile' | 'PermissionSet'): Promise<any> {
        let existing = await getExisting(targetFilename, profileOrPermset);

        const objDir = `${this.flags.directory}/objects`;
        const objects = fs.existsSync(objDir) ? fs.readdirSync(objDir) : [];
        const layouts = fs.existsSync(`${this.flags.directory}/layouts`) ? fs.readdirSync(`${this.flags.directory}/layouts`) : [];
        const tabs = fs.existsSync(`${this.flags.directory}/tabs`) ? fs.readdirSync(`${this.flags.directory}/tabs`) : [];
        const dataSources = fs.existsSync(`${this.flags.directory}/dataSources`) ? fs.readdirSync(`${this.flags.directory}/dataSources`) : [];
        const applications = fs.existsSync(`${this.flags.directory}/applications`) ? fs.readdirSync(`${this.flags.directory}/applications`) : [];

        const typeKey = profileOrPermset === 'Profile' ? 'profileType' : 'permSetType';

        // only use types with matching typekeys
        for (const mdType of metadataTypes.filter(item => item[typeKey])) {
            existing = setupArray(existing, mdType[typeKey]);

            if (mdType.key === 'object') {
                // objects exist as folders, so they don't have file extensions, just the object name
                existing.objectPermissions = existing.objectPermissions.filter(item => {
                    if (objects.includes(item.object)) {
                        return true;
                    } else {
                        this.ux.log(`${chalk.cyan(targetFilename)}: removing object perm for ${item.object}`);
                        return false;
                    }
                });
            }
            if (mdType.key === 'field') {
                // the object exists locally, and if so, the field does, too.
                existing.fieldPermissions = existing.fieldPermissions.filter(item => {
                    const objectName = item.field.split('.')[0];
                    const fieldName = item.field.split('.')[1] + '.field-meta.xml';
                    if (objects.includes(objectName) && fs.readdirSync(`${objDir}/${objectName}/fields`).includes(fieldName)) {
                        return true;
                    } else {
                        this.ux.log(`${chalk.cyan(targetFilename)}: removing field perm for ${item.field}`);
                        return false;
                    }
                });
            }
            if (mdType.key === 'layout') {
                // the object exists AND so does the specified layout
                existing.layoutAssignments = existing.layoutAssignments.filter(item => {
                    const objectName = item.layout.split('-')[0];
                    if (objects.includes(objectName) && layouts.includes(item.layout + '.layout-meta.xml')) {
                        return true;
                    } else {
                        this.ux.log(`${chalk.cyan(targetFilename)}: removing layout assignment for ${item.layout}`);
                        return false;
                    }
                });
            }
            if (mdType.key === 'recordType') {
                existing.recordTypeVisibilities = existing.recordTypeVisibilities.filter(item => {
                    const objectName = item.recordType.split('.')[0];
                    const recordTypeName = item.recordType.split('.')[1] + '.recordType-meta.xml';
                    if (objects.includes(objectName) && fs.readdirSync(`${objDir}/${objectName}/recordTypes`).includes(recordTypeName)) {
                        return true;
                    } else {
                        this.ux.log(`${chalk.cyan(targetFilename)}: removing recordTypeVisibility for ${item.recordType}`);
                        return false;
                    }
                });
            }
            if (mdType.key === 'tab') {
                existing[mdType[typeKey]] = existing[mdType[typeKey]].filter(item => this.checkTab(item.tab, tabs, objects));
            }
            if (mdType.key === 'externalDataSource') {
                existing.externalDataSourceAccesses = existing.externalDataSourceAccesses.filter(item => {
                    if (dataSources.includes(item.externalDataSource + '.dataSource-meta.xml')) {
                        return true;
                    } else {
                        this.ux.log(`${chalk.cyan(targetFilename)}: removing external data source ${item.externalDataSource}`);
                        return false;
                    }
                });
            }
            if (mdType.key === 'application') {
                existing.applicationVisibilities = existing.applicationVisibilities.filter(item => {
                    if (applications.includes(item.application + '.app-meta.xml')) {
                        return true;
                    } else {
                        this.ux.log(`${chalk.cyan(targetFilename)}: removing app ${item.application}`);
                        return false;
                    }
                });
            }
        }

        // remove empty stuff
        for (const mdType of metadataTypes) {
            if (existing[mdType[typeKey]] && existing[mdType[typeKey]].length === 0) {
                delete existing[mdType[typeKey]];
            }
        }

        existing = await fixExistingDollarSign(existing);
        // this.ux.logJson(existing);

        const outputXML = jsToXml.parse(profileOrPermset, existing, options.js2xmlStandardOptions);
        fs.writeFileSync(targetFilename, outputXML);
        // this.ux.log(`removed ${objectBefore - existing.objectPermissions.length} objects, ${recordTypeBefore - existing.recordTypeVisibilities.length} recordTypes, ${layoutBefore - existing.layoutAssignments.length} layout, ${fieldBefore - existing.fieldPermissions.length} fields from ${this.flags.object} ${chalk.cyan(targetFilename)}`);
    }
}
