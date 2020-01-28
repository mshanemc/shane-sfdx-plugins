import { flags, SfdxCommand } from '@salesforce/command';

import { writeJSONasXML } from '../../../../shared/JSONXMLtools';

import fs = require('fs-extra');

export default class DomainCSP extends SfdxCommand {
    public static description = "whitelist the org's domain as a CSP Trusted Site";

    public static examples = ['sfdx shane:org:domain:cors'];

    protected static requiresUsername = true;

    protected static requiresProject = true;

    protected static flagsConfig = {
        all: flags.boolean({
            description: "do all of Salesforce, not just this org's custom domain"
        }),
        liveagent: flags.boolean({
            description: 'whitelist all of LiveAgent urls'
        }),
        target: flags.directory({
            char: 't',
            default: 'force-app/main/default',
            description: "where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default"
        })
    };

    public async run(): Promise<any> {
        const folder = `${this.flags.target}/cspTrustedSites`;
        await fs.ensureDir(folder);
        const whiteListed = [];
        if (this.flags.all) {
            whiteListed.push(await this.writeOut('https://*.salesforce.com', 'allSalesforce', folder));
        }
        if (this.flags.liveagent) {
            whiteListed.push(await this.writeOut('https://*.salesforceliveagent.com', 'liveAgent', folder));
        }
        return whiteListed;
    }

    public async writeOut(urlPattern: string, name: string, folder: string) {
        const filename = `${folder}/${name}.cspTrustedSite-meta.xml`;

        await writeJSONasXML({
            path: filename,
            type: 'CspTrustedSite',
            json: {
                '@': {
                    xmlns: 'http://soap.sforce.com/2006/04/metadata'
                },
                endpointUrl: urlPattern,
                isActive: true,
                context: 'All'
            }
        });

        this.ux.log(`created new file for ${urlPattern} in ${filename}`);
        return {
            filename,
            urlPattern
        };
    }
}
