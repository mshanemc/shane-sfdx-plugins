import { flags, SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');

import { fixExistingDollarSign, getExisting } from './../../../shared/getExisting';

import * as options from '../../../shared/js2xmlStandardOptions';

import chalk from 'chalk';

export default class ConnectedAppUniquify extends SfdxCommand {
    public static description = 'modify a clientId/consumerKey on a local connected app to guaranatee uniqueness';

    public static examples = [
        `sfdx shane:connectedapp:uniquify -a force-app/main/default/connectedappmyConnectedApp -p 5h4n3
// update the consumerKey of myConnectedApp to be unique, but start with 5h4n3
`
    ];

    protected static flagsConfig = {
        prefix: flags.string({ char: 'p', required: true, description: "add a prefix to the connected app's consumerKey" }),
        app: flags.filepath({ char: 'a', required: true, description: 'full path to your connected app locally' })
    };

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const exists = await fs.pathExists(this.flags.app);
        if (!exists) {
            throw new Error(`file not found: ${this.flags.app}`);
        }
        const consumerKey = `${this.flags.prefix}x${new Date().getTime()}`;
        const existing = await getExisting(this.flags.app, 'ConnectedApp');
        existing.oauthConfig.consumerKey = consumerKey;
        const output = await fixExistingDollarSign(existing);

        const xml = jsToXml.parse('ConnectedApp', output, options.js2xmlStandardOptions);

        fs.writeFileSync(this.flags.app, xml);

        this.ux.log(`${chalk.green('Connected app updated locally')}.  Consumer Key is now ${consumerKey}`);
    }
}
