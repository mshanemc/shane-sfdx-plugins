import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';

import { writeJSONasXML } from '../../../shared/JSONXMLtools';
import { removeTrailingSlash } from '../../../shared/flagParsing';

import fs = require('fs-extra');

export default class PowerOfOne extends SfdxCommand {
    public static description = 'create a new record type for an object';

    public static examples = [
        `sfdx shane:object:recordtype -o Something__c -l 'MyRecordType'
// create a recordtype named MyRecordType and label MyRecordType on the Something__c object with the default description in the default folder
`
    ];

    protected static flagsConfig = {
        object: flags.string({ char: 'o', required: true, description: 'API name of the object to add the record type to' }),
        name: flags.string({ char: 'n', description: 'Name for the record Type (defaults to label if not provided)' }),
        label: flags.string({ char: 'l', default: 'Power Of One', description: 'label', required: true }),
        description: flags.string({
            char: 'd',
            default: 'Created by shane:sfdx:plugins',
            description: "optional description so you can remember why you added this and what it's for"
        }),
        target: flags.directory({
            char: 't',
            default: 'force-app/main/default',
            description: 'where to create the file...defaults to force-app/main/default',
            parse: input => removeTrailingSlash(input)
        })
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        if (!fs.existsSync(`${this.flags.target}/objects/${this.flags.object}`)) {
            throw new Error(`object does not exist at ${this.flags.target}/objects/${this.flags.object}`);
        }

        if (!this.flags.name) {
            this.flags.name = this.flags.label.replace(/\s/g, '');
        }

        if (this.flags.name.includes(' ')) {
            throw new Error('spaces are not allowed in the api name.  Specify a --name to use a label with spaces');
        }

        await fs.ensureDir(`${this.flags.target}/objects/${this.flags.object}/recordTypes`);

        await writeJSONasXML({
            path: `${this.flags.target}/objects/${this.flags.object}/recordTypes/${this.flags.name}.recordType-meta.xml`,
            type: 'RecordType',
            json: {
                '@': {
                    xmlns: 'http://soap.sforce.com/2006/04/metadata'
                },
                fullName: this.flags.name,
                active: true,
                label: this.flags.label,
                description: this.flags.description
            }
        });

        this.ux.log(`${chalk.green('Record type created')}.  It's only local...push to deploy.`);
    }
}
