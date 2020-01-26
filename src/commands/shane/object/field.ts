import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import cli from 'cli-ux';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');

import { fixExistingDollarSign } from '../../../shared/getExisting';
import * as options from '../../../shared/js2xmlStandardOptions';
import { getParsed } from '../../../shared/xml2jsAsync';

const SupportedTypes__b = ['Text', 'Number', 'DateTime', 'Lookup', 'LongTextArea'];
const SupportedTypes__e = ['Text', 'Number', 'DateTime', 'Date', 'LongTextArea', 'Checkbox'];
const SupportedTypes__c = ['Text', 'Number', 'DateTime', 'Date', 'LongTextArea', 'Checkbox', 'Url', 'Email', 'Phone', 'Currency', 'Picklist'];

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
            description: `field type.  Big Objects: ${SupportedTypes__b.join(',')}.  Events: ${SupportedTypes__e.join(
                ','
            )}.  Regular Objects: ${SupportedTypes__c.join(',')}`
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
        relname: flags.string({ description: 'API name for the lookup relationship' }),

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

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        if (!this.flags.object) {
            this.flags.object = await cli.prompt('object API name?');
        }

        const objectMetaPath = `${this.flags.directory}/objects/${this.flags.object}/${this.flags.object}.object-meta.xml`;
        // does it exist?
        if (!fs.existsSync(objectMetaPath)) {
            this.ux.error(chalk.red(`object not found: ${objectMetaPath}`));
            return;
        }

        if (!this.flags.name) {
            this.flags.name = await cli.prompt('Label for your new field?');
        }

        if (!this.flags.api) {
            this.flags.api = await cli.prompt('API name for your new field?', {
                default: `${this.flags.name.replace(/ /g, '_')}__c`
            });
        }

        // be helpful
        if (!this.flags.api.endsWith('__c')) {
            this.flags.api = this.flags.api + '__c';
        }

        const fieldsFolderPath = `${this.flags.directory}/objects/${this.flags.object}/fields`;
        const fieldMetaPath = `${this.flags.directory}/objects/${this.flags.object}/fields/${this.flags.api}.field-meta.xml`;

        fs.ensureDirSync(fieldsFolderPath);

        if (fs.existsSync(fieldMetaPath)) {
            this.ux.error(chalk.red(`field already exists ${fieldMetaPath}`));
            return;
        }

        interface FieldMeta {
            label: string;
            // tslint:disable-next-line:no-reserved-keywords
            type: string;
            fullName: string;
            defaultValue?: string;
            description?: string;
            inlineHelpText?: string;
            required?: boolean;
            unique?: boolean;
            externalId?: boolean;
            length?: number;
            scale?: number;
            precision?: number;
            relationshipLabel?: string;
            relationshipName?: string;
            referenceTo?: string;
            trackHistory?: boolean;
            visibleLines?: number;
            valueSet?: { valueSetDefinition?: ValueSetDefinition };
        }

        interface ValueSetDefinition {
            sorted: boolean;
            value: Value[];
        }

        interface Value {
            fullName: string;
            default?: boolean;
            label: string;
        }

        while (this.flags.object.endsWith('__b') && !SupportedTypes__b.includes(this.flags.type)) {
            this.flags.type = await cli.prompt(`Type (${SupportedTypes__b.join(',')})?`, { default: 'Text' });
        }

        while (this.flags.object.endsWith('__e') && !SupportedTypes__e.includes(this.flags.type)) {
            this.flags.type = await cli.prompt(`Type (${SupportedTypes__e.join(',')})?`, { default: 'Text' });
        }

        while (this.flags.object.endsWith('__c') && !SupportedTypes__c.includes(this.flags.type)) {
            this.flags.type = await cli.prompt(`Type (${SupportedTypes__c.join(',')})?`, { default: 'Text' });
        }

        // we have at least these two fields now
        const outputJSON = <FieldMeta>{
            label: this.flags.name,
            type: this.flags.type,
            fullName: this.flags.api
        };

        // type specific values
        if (this.flags.type === 'Text') {
            if (this.flags.length >= 0) {
                outputJSON.length = this.flags.length;
            } else {
                outputJSON.length = await cli.prompt('Length? (Max 255)', { default: '255' });
            }
        }

        if (this.flags.type === 'Checkbox') {
            outputJSON.defaultValue = this.flags.default || (await cli.prompt('Default value (required for checkboxes)?', { default: 'false' }));
        }

        if (this.flags.type === 'LongTextArea') {
            if (this.flags.length >= 0) {
                outputJSON.length = this.flags.length;
            } else {
                outputJSON.length = await cli.prompt('Length? (Max 131072)', { default: '131072' });
            }
            outputJSON.visibleLines = 3;
        }

        if (this.flags.type === 'Lookup') {
            outputJSON.referenceTo = this.flags.lookupobject || (await cli.prompt('What object for Lookup field? ex: Account, Something__c'));
            outputJSON.relationshipName = this.flags.relname || (await cli.prompt('relationship api name?'));
            outputJSON.relationshipLabel = outputJSON.relationshipName;
        }

        if (this.flags.type === 'Number' || this.flags.type === 'Currency') {
            if (this.flags.scale >= 0) {
                outputJSON.scale = this.flags.scale;
            } else {
                outputJSON.scale = await cli.prompt('how many decimal places (scale)?', { default: '0' });
            }

            if (this.flags.precision >= 0) {
                outputJSON.precision = this.flags.precision;
            } else {
                outputJSON.precision = await cli.prompt(
                    `how many total digits, including those ${outputJSON.scale} decimal places? (precision, MAX ${18 - outputJSON.scale})?`,
                    { default: `${18 - outputJSON.scale}` }
                );
            }
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
                        default: this.flags.picklistdefaultfirst && index === 0
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
            const filePath = `${this.flags.directory}/objects/${this.flags.object}/${this.flags.object}.object-meta.xml`;
            const fileRead = await getParsed(await fs.readFile(filePath), true);

            this.ux.logJson(fileRead);
            let existing = fileRead.CustomObject;
            // this.ux.log(existing.indexes[0].fields);
            existing.indexes[0].fields = existing.indexes[0].fields || [];
            // this.ux.log(existing.indexes[0].fields);

            while (!(this.flags.indexposition > -1) && !this.flags.indexappend && !this.flags.noindex) {
                const response = await cli.prompt(
                    `where in the big object index? Enter an array key (0 is first.  There are already ${existing.indexes[0].fields.length}) or the word LAST (add to the end) or NO (don't index this field)`,
                    { default: 'LAST' }
                );
                if (response === 'NONE') {
                    this.flags.noindex = true;
                    // this.flags.indexappend = true;
                } else if (response === 'LAST') {
                    this.flags.indexappend = true;
                } else {
                    if (this.flags.indexposition >= 0) {
                        this.flags.indexposition = response;
                    }
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

            // conver to xml and write out the file
            const objXml = jsToXml.parse('CustomObject', existing, options.js2xmlStandardOptions);
            fs.writeFileSync(filePath, objXml);

            this.ux.log(chalk.green(`Index for ${this.flags.api} added as [${position}] of ${existing.indexes[0].fields.length}`));
        }

        // write out the field xml
        const xml = jsToXml.parse('CustomField', outputJSON, options.js2xmlStandardOptions);

        fs.writeFileSync(fieldMetaPath, xml);

        this.ux.log(
            `Created ${chalk.green(fieldMetaPath)}.  Add perms with ${chalk.cyan(
                `sfdx shane:permset:create -o ${this.flags.object} -f ${this.flags.api} -n yourPermSetName`
            )}`
        );
    }
}
