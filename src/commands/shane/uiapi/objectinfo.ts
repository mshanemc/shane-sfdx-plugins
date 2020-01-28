import { flags, SfdxCommand } from '@salesforce/command';

import fs = require('fs-extra');
import request = require('request-promise-native');

export default class ObjectInfo extends SfdxCommand {
    public static description =
        'get a ui api response from the objectinfo endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_object_info.htm';

    public static examples = [
        `sfdx shane:uiapi:objectinfo -o Account --json
    // returns ui-api objectinfo for Account
    `,
        `sfdx shane:uiapi:objectinfo -o Account --json --outputfile accountObjectInfo.json
    // returns ui-api objectinfo for Account and saves it to a local file
    `
    ];

    protected static flagsConfig = {
        object: flags.string({ char: 'o', description: 'object api name' }),
        outputfile: flags.filepath({ description: 'local path to save the output to' })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();

        this.flags.apiversion = this.flags.apiversion ?? (await conn.retrieveMaxApiVersion());

        const result = await request({
            method: 'get',
            uri: `${conn.instanceUrl}/services/data/v${this.flags.apiversion}/ui-api/object-info/${this.flags.object}`,
            headers: {
                Authorization: `Bearer ${conn.accessToken}`
            },
            json: true
        });
        this.ux.log(result);

        if (this.flags.outputfile) {
            await fs.outputJSON(this.flags.outputfile, result);
        } else {
            this.ux.log('did you forget the outputfile');
        }

        return result;
    }
}
