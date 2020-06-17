import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import cli from 'cli-ux';

import { fixExistingDollarSign, writeJSONasXML } from '../../../shared/JSONXMLtools';
import { getParsed } from '../../../shared/xml2jsAsync';
import { FieldMeta } from '../../../shared/typeDefs';

import fs = require('fs-extra');

const SupportedTypesB = ['Text', 'Number', 'DateTime', 'Lookup', 'LongTextArea'];
const SupportedTypesE = ['Text', 'Number', 'DateTime', 'Date', 'LongTextArea', 'Checkbox'];
const SupportedTypesC = [
    'Text',
    'Number',
    'DateTime',
    'Date',
    'LongTextArea',
    'Checkbox',
    'Url',
    'Email',
    'Phone',
    'Currency',
    'Picklist',
    'Html',
    'Location',
    'Lookup',
    'MasterDetail'
];
const SupportedTypesMDT = ['Text', 'LongTextArea', 'Number', 'DateTime', 'Date', 'Checkbox', 'Url', 'Email', 'Phone', 'Picklist'];

const deleteConstraintOptions = ['SetNull', 'Restrict', 'Cascade'];

export default class FieldCreate extends SfdxCommand {
    public static description = 'create or add fields to an existing object';

    public static examples = [
        `sfdx shane:object:field
// without any params, the cli is going to ask you questions to generate your field interactively
`,
        `sfdx shane:object:field --api My_Field__c -l 255 -n "My Field" -t Text -o  BigTest__b --noindex
// create new text field called My Field (My_Field__c) on BigObject BigTest__b
`,
        `sfdx shane:object:field --api My_Index_Field__c -l 255 -n "My Index Field" -t Text -o  BigTest__b --indexdirection ASC --indexposition 1
// create new text field called My Field (My_Field__c) on BigObject BigTest__b, add it to the existing index as the second field
`,
        `sfdx shane:object:field --api My_Field__c -l 255 -n "My Field" -t Text -o  EventTest__e
// create new text field called My Field (My_Field__c) on Platform Event EventTest__e
`
    ];

    protected static flagsConfig = {
        // common flags for field types
        object: flags.string({ char: 'o', description: 'API name of an object to add a field to' }),
        name: flags.string({ char: 'n', description: 'Label for the field' }),
        api: flags.string({ char: 'a', description: 'API name for the field' }),
        type: flags.string({
            char: 't',
            description: `field type.  Big Objects: ${SupportedTypesB.join(',')}.  Events: ${SupportedTypesE.join(
                ','
            )}.  Regular Objects: ${SupportedTypesC.join(',')}`
        }),
        description: flags.string({ description: "optional description for the field so you remember what it's for next year" }),
        default: flags.string({
            description: 'required for checkbox fields.  Express in Salesforce formula language (good luck with that!)'
        }),
        required: flags.boolean({ char: 'r', description: 'field is required' }),
        unique: flags.boolean({ char: 'u', description: 'field must be unique' }),
        externalid: flags.boolean({ description: 'use as an external id' }),
        trackhistory: flags.boolean({ description: 'enable history tracking on the field' }),
        helptext: flags.string({ description: 'optional inline help text' }),
        // type specific flags
        length: flags.integer({ char: 'l', description: 'length (for text fields and text area)' }),

        scale: flags.integer({ char: 's', description: 'places right of the decimal' }),
        precision: flags.integer({ description: 'maximum allowed digits of a number, including whole and decimal places' }),

        lookupobject: flags.string({ description: 'API name of the object the lookup goes to' }),
        relname: flags.string({ description: 'API name for the child relationship' }),
        rellabel: flags.string({ description: 'label for the child relationship (appears on related lists)' }),

        deleteconstraint: flags.string({ description: 'delete behavior', options: deleteConstraintOptions }),

        reparentable: flags.boolean({ description: 'the master detail is parentable' }),
        writerequiresmasterread: flags.boolean({ description: 'the master detail is parentable' }),

        picklistvalues: flags.array({ description: 'values for the picklist' }),
        picklistdefaultfirst: flags.boolean({ description: 'use the first value in the picklist as the default' }),

        // big object index handling
        indexposition: flags.integer({
            description:
                "put in a specific position in the big object index (0 is the first element).  You're responsible for dealing with producing a sane array"
        }),
        indexappend: flags.boolean({ description: 'put next in the big object index' }),
        indexdirection: flags.string({ description: 'sort direction for the big object index', options: ['ASC', 'DESC'] }),
        noindex: flags.boolean({ description: 'do not add this field to the index' }),

        // stuff about the command's behavior itself
        interactive: flags.boolean({ char: 'i', description: 'fully interactive--ask me every possible question.' }),
        directory: flags.directory({
            char: 'd',
            default: 'force-app/main/default',
            description: 'Where is this object metadata? defaults to force-app/main/default'
        })
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        if (!this.flags.object) {
            this.flags.object = await cli.prompt('object API name?');
        }

        const objectMetaPath = `${this.flags.directory}/objects/${this.flags.object}/${this.flags.object}.object-meta.xml`;
        // does it exist?
        if (!fs.existsSync(objectMetaPath)) {
            throw new Error(`object not found: ${objectMetaPath}`);
        }

        if (!this.flags.name) {
            this.flags.name = await cli.prompt('Label for your new field?');
        }

        if (!this.flags.api) {
            this.flags.api = await cli.prompt('API name for your new field?', {
                default: `${this.flags.name.replace(/ /g, '_').replace(/-/g, '_')}__c`
            });
        }

        // be helpful
        if (!this.flags.api.endsWith('__c')) {
            this.flags.api = `${this.flags.api}__c`;
        }

        const fieldsFolderPath = `${this.flags.directory}/objects/${this.flags.object}/fields`;
        const fieldMetaPath = `${fieldsFolderPath}/${this.flags.api}.field-meta.xml`;

        await fs.ensureDir(fieldsFolderPath);

        if (fs.existsSync(fieldMetaPath)) {
            this.ux.error(chalk.red(`field already exists ${fieldMetaPath}`));
            return;
        }

        while (this.flags.object.endsWith('__mdt') && !SupportedTypesMDT.includes(this.flags.type)) {
            // eslint-disable-next-line no-await-in-loop
            this.flags.type = await cli.prompt(`Type (${SupportedTypesMDT.join(',')})?`, { default: 'Text' });
        }

        while (this.flags.object.endsWith('__b') && !SupportedTypesB.includes(this.flags.type)) {
            // eslint-disable-next-line no-await-in-loop
            this.flags.type = await cli.prompt(`Type (${SupportedTypesB.join(',')})?`, { default: 'Text' });
        }

        while (this.flags.object.endsWith('__e') && !SupportedTypesE.includes(this.flags.type)) {
            // eslint-disable-next-line no-await-in-loop
            this.flags.type = await cli.prompt(`Type (${SupportedTypesE.join(',')})?`, { default: 'Text' });
        }

        while (this.flags.object.endsWith('__c') && !SupportedTypesC.includes(this.flags.type)) {
            // eslint-disable-next-line no-await-in-loop
            this.flags.type = await cli.prompt(`Type (${SupportedTypesC.join(',')})?`, { default: 'Text' });
        }

        // we have at least these two fields now
        const outputJSON = {
            label: this.flags.name,
            type: this.flags.type,
            fullName: this.flags.api
        } as FieldMeta;

        // type specific values
        if (this.flags.type === 'Text') {
            outputJSON.length = this.flags.length >= 0 ? this.flags.length : await cli.prompt('Length? (Max 255)', { default: '255' });
        }

        if (this.flags.type === 'Checkbox') {
            outputJSON.defaultValue = this.flags.default || (await cli.prompt('Default value (required for checkboxes)?', { default: 'false' }));
        }

        if (this.flags.type === 'LongTextArea') {
            outputJSON.length = this.flags.length >= 0 ? this.flags.length : await cli.prompt('Length? (Max 131072)', { default: '131072' });
            outputJSON.visibleLines = 3;
        }

        if (this.flags.type === 'Html') {
            outputJSON.length = this.flags.length >= 0 ? this.flags.length : await cli.prompt('Length? (Max 131072)', { default: '131072' });
            outputJSON.visibleLines = 5;
        }

        if (this.flags.type === 'Lookup' || this.flags.type === 'MasterDetail') {
            outputJSON.referenceTo = this.flags.lookupobject || (await cli.prompt('API name of the parent object ex: Account, Something__c'));
            outputJSON.relationshipName = this.flags.relname || (await cli.prompt('Child relationship api name?'));
            outputJSON.relationshipLabel =
                this.flags.rellabel || (await cli.prompt('Child relationship label?', { default: outputJSON.relationshipName }));
        }
        if (this.flags.type === 'Lookup' && this.flags.object.endsWith('__c')) {
            outputJSON.deleteConstraint = this.flags.interactive
                ? this.flags.deleteconstraint ||
                  (await cli.prompt(`What should happen to this field when the parent is deleted? (${deleteConstraintOptions.join(',')})`, {
                      default: 'SetNull'
                  }))
                : 'SetNull';
        }
        if (this.flags.type === 'MasterDetail') {
            outputJSON.reparentableMasterDetail = this.flags.interactive
                ? this.flags.reparentable || (await cli.confirm('Allow reparenting? (y/n)'))
                : this.flags.reparentable ?? false;
            outputJSON.writeRequiresMasterRead = this.flags.interactive
                ? this.flags.writerequiresmasterread || (await cli.confirm('Allow write access if parent is readable (y/n)'))
                : this.flags.writerequiresmasterread ?? false;
            outputJSON.relationshipOrder = (await masterDetailExists(fieldsFolderPath)) ? 1 : 0; // default, unless we find another one in the files
        }

        if (this.flags.type === 'Number' || this.flags.type === 'Currency') {
            outputJSON.scale = this.flags.scale >= 0 ? this.flags.scale : await cli.prompt('how many decimal places (scale)?', { default: '0' });
            outputJSON.precision =
                this.flags.precision >= 0
                    ? this.flags.precision
                    : await cli.prompt(
                          `how many total digits, including those ${outputJSON.scale} decimal places? (precision, MAX ${18 - outputJSON.scale})?`,
                          {
                              default: `${18 - outputJSON.scale}`
                          }
                      );
        }

        if (this.flags.type === 'Location') {
            outputJSON.scale = this.flags.scale >= 0 ? this.flags.scale : await cli.prompt('how many decimal places (scale)?', { default: '4' });
            outputJSON.displayLocationInDecimal = true;
        }

        if (this.flags.type === 'Picklist') {
            let values = [];
            // let defaultValue;

            if (this.flags.picklistvalues) {
                values = this.flags.picklistvalues;
            } else {
                this.ux.log(`OK, let's build a picklist.  Values will appear in the order entered.`);
                let keepAsking = true;
                const stopWord = 'STAHP';
                while (keepAsking) {
                    // eslint-disable-next-line no-await-in-loop
                    const response = await cli.prompt(`Enter a value to add to picklist, or say ${stopWord} to stop`);
                    if (response !== stopWord) {
                        values.push(response);
                    } else {
                        keepAsking = false;
                    }
                }
                if (!this.flags.picklistdefaultfirst) {
                    this.flags.picklistdefaultfirst = await cli.confirm('use the first value as default? (y/n)');
                }
            }

            outputJSON.valueSet = {
                valueSetDefinition: {
                    value: values.map((value, index) => ({
                        fullName: value,
                        label: value,
                        default: ((this.flags.picklistdefaultfirst ?? false) && index === 0) ?? false
                    })),
                    sorted: true
                }
            };
        }

        // optional stuff
        if (this.flags.required) {
            outputJSON.required = true;
        } else if (this.flags.interactive && outputJSON.type !== 'Checkbox') {
            outputJSON.required = await cli.confirm('required? (y/n)');
        }

        if (this.flags.unique) {
            outputJSON.unique = true;
        } else if (this.flags.interactive && ['Number', 'Text'].includes(outputJSON.type)) {
            outputJSON.unique = await cli.confirm('unique? (y/n)');
        }

        if (this.flags.externalid) {
            outputJSON.externalId = true;
        } else if (this.flags.interactive && !this.flags.object.endsWith('__e') && ['Number', 'Text'].includes(outputJSON.type)) {
            outputJSON.externalId = await cli.confirm('external ID?  (y/n)');
        }

        if (this.flags.description) {
            outputJSON.description = this.flags.description;
        } else if (this.flags.interactive) {
            outputJSON.description = await cli.prompt('description?  Be nice to your future self!', {
                required: false
            });
        }

        if (this.flags.helptext) {
            outputJSON.inlineHelpText = this.flags.helptext;
        } else if (this.flags.interactive && !this.flags.object.endsWith('__e')) {
            outputJSON.inlineHelpText = await cli.prompt('inline help text?  Be nice to your users!', {
                required: false,
                default: outputJSON.description
            });
        }

        if (this.flags.trackhistory) {
            outputJSON.trackHistory = this.flags.trackhistory;
        } else if (this.flags.interactive && this.flags.object.endsWith('__c')) {
            outputJSON.trackHistory = await cli.confirm('enable history tracking?  (y/n)');
        }

        // dealing with big object indexes
        if (this.flags.object.includes('__b') && !this.flags.noindex) {
            const fileRead = await getParsed(await fs.readFile(objectMetaPath), true);

            this.ux.logJson(fileRead);
            let existing = fileRead.CustomObject;
            // this.ux.log(existing.indexes[0].fields);
            existing.indexes[0].fields = existing.indexes[0].fields || [];
            // this.ux.log(existing.indexes[0].fields);

            while (!(this.flags.indexposition > -1) && !this.flags.indexappend && !this.flags.noindex) {
                // eslint-disable-next-line no-await-in-loop
                const response = await cli.prompt(
                    `where in the big object index? Enter an array key (0 is first.  There are already ${existing.indexes[0].fields.length}) or the word LAST (add to the end) or NO (don't index this field)`,
                    { default: 'LAST' }
                );
                if (response === 'NONE') {
                    this.flags.noindex = true;
                    // this.flags.indexappend = true;
                } else if (response === 'LAST') {
                    this.flags.indexappend = true;
                } else if (this.flags.indexposition >= 0) {
                    this.flags.indexposition = response;
                }
            }

            if (this.flags.noindex) {
                return; // we're done.  Just quit!
            }

            // make it required since we're going to index it
            outputJSON.required = true;

            // we were told what to do
            while (this.flags.indexdirection !== 'ASC' && this.flags.indexdirection !== 'DESC') {
                outputJSON.required = true;
                // eslint-disable-next-line no-await-in-loop
                this.flags.indexdirection = await cli.prompt('which direction should this index be sorted? (ASC, DESC)', {
                    default: 'DESC'
                });
            }

            existing = await fixExistingDollarSign(existing);

            const newIndex = {
                name: this.flags.api,
                sortDirection: this.flags.indexdirection
            };

            if (this.flags.indexappend) {
                existing.indexes[0].fields.push(newIndex);
            } else {
                existing.indexes[0].fields.splice(this.flags.indexposition, 0, newIndex);
            }

            const position = this.flags.indexposition || existing.indexes[0].fields.length - 1;

            // convert to xml and write out the file
            await writeJSONasXML({
                type: 'CustomObject',
                path: objectMetaPath,
                json: existing
            });

            this.ux.log(chalk.green(`Index for ${this.flags.api} added as [${position}] of ${existing.indexes[0].fields.length}`));
        }

        // write out the field xml
        // const xml = jsToXml.parse('CustomField', outputJSON, options.js2xmlStandardOptions);
        await writeJSONasXML({
            type: 'CustomField',
            path: fieldMetaPath,
            json: outputJSON
        });
        this.ux.log(
            `Created ${chalk.green(fieldMetaPath)}.  Add perms with ${chalk.cyan(
                `sfdx shane:permset:create -o ${this.flags.object} -f ${this.flags.api} -n yourPermSetName`
            )}`
        );

        if (this.flags.type === 'MasterDetail') {
            // modify sharing on existing object
            const existingObject = (await getParsed(await fs.readFile(objectMetaPath), true)).CustomObject;
            existingObject.externalSharingModel = 'ControlledByParent';
            existingObject.sharingModel = 'ControlledByParent';
            await writeJSONasXML({
                type: 'CustomObject',
                path: objectMetaPath,
                json: await fixExistingDollarSign(existingObject)
            });
            this.ux.log(`Modified sharing model on ${objectMetaPath}.`);
        }
    }
}

const masterDetailExists = async fieldsFolderPath => {
    return (
        await Promise.all(
            (await fs.readdir(fieldsFolderPath)) // returns list of filenames
                .map(async fieldFile => getParsed(await fs.readFile(`${fieldsFolderPath}/${fieldFile}`), false)) // returns json objects
        )
    ).some(fileAsJSON => fileAsJSON.CustomField.type === 'MasterDetail'); // there is already some master-detail
};
