import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');

import * as options from '../../../shared/js2xmlStandardOptions';

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
            description: 'where to create the file...defaults to force-app/main/default'
        })
    };

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        if (!fs.existsSync(`${this.flags.target}/objects/${this.flags.object}`)) {
            throw new Error(`object does not exist at ${this.flags.target}/objects/${this.flags.object}`);
        }

        if (!this.flags.name) {
            this.flags.name = this.flags.label.replace(/\s/g, '');
        }

        if (this.flags.name.includes(' ')) {
            this.ux.error(chalk.red('spaces are not allowed in the api name.  Specify a --name to use a label with spaces'));
        }

        // remove trailing slash if someone entered it
        if (this.flags.target.endsWith('/')) {
            this.flags.target = this.flags.target.substring(0, this.flags.target.length - 1);
        }

        fs.ensureDirSync(`${this.flags.target}/objects/${this.flags.object}/recordTypes`);

        const rtJSON = {
            '@': {
                xmlns: 'http://soap.sforce.com/2006/04/metadata'
            },
            fullName: this.flags.name,
            active: true,
            label: this.flags.label,
            description: this.flags.description
        };

        const xml = jsToXml.parse('RecordType', rtJSON, options.js2xmlStandardOptions);

        fs.writeFileSync(`${this.flags.target}/objects/${this.flags.object}/recordTypes/${this.flags.name}.recordType-meta.xml`, xml);

        this.ux.log(`${chalk.green('Record type created')}.  It's only local...push to deploy.`);
    }
}
