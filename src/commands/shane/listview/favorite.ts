// https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_features_favorites.htm
import { flags, SfdxCommand } from '@salesforce/command';
import { FavoriteRequestBody } from '../../../shared/typeDefs';
import { singleRecordQuery } from '../../../shared/queries';
import { saveFavorite } from '../../../shared/uiApiFavorites';

export default class Favorite extends SfdxCommand {
    public static description = 'favorite a listview';

    public static aliases = ['shane:listview:favourite'];

    public static examples = [
        `sfdx shane:listview:favorite -o Account -t Awesome_Accounts
// finds the matching listview and adds it to the end of the favorites menu
`
    ];

    protected static flagsConfig = {
        name: flags.string({ char: 'l', description: 'the label you want to appear in the favorites menu' }),
        target: flags.string({ char: 't', required: true, description: 'API name of the list view you want to favorite' }),
        object: flags.string({ char: 'o', required: true, description: 'object API name (including __c if custom)' }),
        start: flags.boolean({ description: 'add the favorite at the beginning of the menu' })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();

        const matchedRecord = await singleRecordQuery({
            conn,
            query: `select id,Name from ListView where DEVELOPERNAME = '${this.flags.target}' AND SOBJECTTYPE = '${this.flags.object}'`
        });

        const body: FavoriteRequestBody = {
            targetType: 'ListView',
            target: matchedRecord.Id,
            name: this.flags.name ?? matchedRecord.Name
        };

        if (this.flags.start) {
            body.sortOrder = 1;
        }

        const result = await saveFavorite({ conn, body });

        if (result.id.startsWith('0MV')) {
            this.ux.log('Favorite Created');
        }
        return result;
    }
}
