import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');

import { writeJSONasXML } from '../../../shared/JSONXMLtools';
import { getExisting } from './../../../shared/getExisting';

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

    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        if (!(await fs.pathExists(this.flags.app))) {
            throw new Error(`file not found: ${this.flags.app}`);
        }
        const consumerKey = `${this.flags.prefix}x${new Date().getTime()}`;
        const existing = await getExisting(this.flags.app, 'ConnectedApp');
        existing.oauthConfig.consumerKey = consumerKey;

        await writeJSONasXML({
            type: 'ConnectedApp',
            path: this.flags.app,
            json: existing
        });

        this.ux.log(`${chalk.green('Connected app updated locally')}.  Consumer Key is now ${consumerKey}`);
    }
}

// Cannot read tslint configuration - 'Failed to load /Users/shane.mclaughlin/code/shane-sfdx-plugins/tslint.json: ENOENT: no such file or directory, open '/Users/shane.mclaughlin/code/shane-sfdx-plugins/node_modules/tslint/lib/configs/recommended.js''
