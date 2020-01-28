import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';

import { writeJSONasXML } from '../../../shared/JSONXMLtools';
import { removeTrailingSlash } from '../../../shared/flagParsing';

import fs = require('fs-extra');

export default class RemoteSite extends SfdxCommand {
    public static description = "create a remote site setting in the local source.  Push it when you're done";

    public static examples = [
        `sfdx shane:remotesite:create -n Test -u https://www.google.com
// create a remote site setting in force-app/main/default
`,
        `sfdx shane:remotesite:create -n Test -u https://www.google.com -d "my description" -t myOtherDirectory/main/default
// create a remote site setting in myOtherDirectory/main/default with a description
`
    ];

    protected static flagsConfig = {
        url: flags.url({ char: 'u', required: true, description: 'url that you want to allow callouts to' }),
        name: flags.string({ char: 'n', required: true, description: 'name it (Salesforce API compliant name)' }),
        description: flags.string({
            char: 'd',
            default: 'added from sfdx plugin',
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
        if (this.flags.name.includes(' ')) {
            throw new Error('spaces are not allowed in the name');
        }

        await fs.ensureDir(`${this.flags.target}/remoteSiteSettings`);
        await writeJSONasXML({
            path: `${this.flags.target}/remoteSiteSettings/${this.flags.name}.remoteSite-meta.xml`,
            type: 'RemoteSiteSetting',
            json: {
                '@': {
                    xmlns: 'http://soap.sforce.com/2006/04/metadata'
                },
                url: this.flags.url,
                disableProtocolSecurity: false,
                isActive: true,
                description: this.flags.description
            }
        });

        this.ux.log(chalk.green('Remote site created locally'));
    }
}
