// https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_features_favorites.htm

import { flags, SfdxCommand } from '@salesforce/command';
import { singleRecordQuery } from '../../../shared/queries';

import request = require('request-promise-native');

export default class Favorite extends SfdxCommand {
    public static description = 'query records and set the match as a favorite';

    public static aliases = ['shane:data:favourite'];

    public static examples = [
        `sfdx shane:data:favorite -o Account -w "name='Salesforce.com'"
// finds the matching record and adds it to the end of the favorites menu
`
    ];

    protected static flagsConfig = {
        where: flags.string({ char: 'w', required: true, description: 'SOQL where clause to match a single record' }),
        object: flags.string({ char: 'o', required: true, description: 'object API name (including __c if custom)' }),
        start: flags.boolean({ description: 'add the favorite at the beginning of the menu' })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        const matchedRecord = await singleRecordQuery({
            conn,
            query: `select id from ${this.flags.object} where ${this.flags.where}`
        });

        this.flags.apiversion = this.flags.apiversion || (await conn.retrieveMaxApiVersion());
        let uri = `${conn.instanceUrl}/services/data/v${this.flags.apiversion}/ui-api/favorites/?target=${matchedRecord.Id}&targetType=Record`;
        if (this.flags.start) {
            uri = `${uri}&sortOrder=1`;
        }

        const result = await request({
            method: 'POST',
            uri,
            headers: {
                Authorization: `Bearer ${conn.accessToken}`
            },
            json: true
        });
        if (result.id.startsWith('0MV')) {
            this.ux.log('Favorite Created');
        }
        return result;
    }
}
