import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';

import { writeJSONasXML } from '../../../shared/JSONXMLtools';
import { removeTrailingSlash } from '../../../shared/flagParsing';

import fs = require('fs-extra');

export default class PowerOfOne extends SfdxCommand {
    public static description = 'add a "power of one" formula field to any object';

    public static examples = [
        `sfdx shane:object:powerofone -a Poo -l "Power of One" -o User
// create a field with api name Poo__c and label "Power of One" on the user object with the default description in the default folder
`
    ];

    protected static flagsConfig = {
        object: flags.string({ char: 'o', required: true, description: 'API name of the object to add the field to' }),
        label: flags.string({ char: 'l', default: 'Power Of One', description: 'label' }),
        api: flags.string({
            char: 'a',
            default: 'Power_Of_One__c',
            description: "api name (will include the __c for you if you don't add it here"
        }),
        description: flags.string({
            char: 'd',
            default: 'Power of one is used for formulas, reporting, etc',
            description: "optional description so you can remember why you added this and what it's for"
        }),
        target: flags.directory({
            char: 't',
            default: 'force-app/main/default',
            description: "where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default",
            parse: input => removeTrailingSlash(input)
        })
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        if (this.flags.api.includes(' ')) {
            this.ux.error(chalk.red('spaces are not allowed in the api name'));
        }

        if (!this.flags.api.includes('__c')) {
            this.flags.api = `${this.flags.api}__c`;
        }

        await fs.ensureDirSync(`${this.flags.target}/objects/${this.flags.object}/fields`);

        await writeJSONasXML({
            path: `${this.flags.target}/objects/${this.flags.object}/fields/${this.flags.api}.field-meta.xml`,
            type: 'CustomField',
            json: {
                '@': {
                    xmlns: 'http://soap.sforce.com/2006/04/metadata'
                },
                fullName: this.flags.api,
                externalId: false,
                formula: 1,
                formulaTreatBlanksAs: 'BlankAsZero',
                label: this.flags.label,
                precision: 18,
                required: false,
                scale: 0,
                type: 'Number',
                unique: false,
                description: this.flags.description
            }
        });
        this.ux.log(`${chalk.green('Power of One field created for you')}.  It's only local...push to deploy.`);
    }
}
