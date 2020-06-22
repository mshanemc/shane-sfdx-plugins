import { flags, SfdxCommand } from '@salesforce/command';
import { FavoriteRequestBody } from '../../../shared/typeDefs';
import { saveFavorite } from '../../../shared/uiApiFavorites';

export default class Favorite extends SfdxCommand {
    public static description = 'favorite a tab';

    public static aliases = ['shane:tab:favourite'];

    public static examples = [
        `sfdx shane:tab:favorite -t Tab_API_Name'"
// creates a favorite
`,
        `sfdx shane:tab:favorite -t someNamespace__Tab_API_Name'"
// creates a favorite for a tab in a namespace
`
    ];

    protected static flagsConfig = {
        name: flags.string({ char: 'l', description: 'the label you want to appear in the favorites menu' }),
        target: flags.string({ char: 't', required: true, description: 'API name of the tab you want to favorite' }),
        start: flags.boolean({ description: 'add the favorite at the beginning of the menu' })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const body: FavoriteRequestBody = {
            targetType: 'Tab',
            target: this.flags.target,
            name: this.flags.name ?? this.flags.target
        };

        if (this.flags.start) {
            body.sortOrder = 1;
        }

        const result = await saveFavorite({ conn: this.org.getConnection(), body });

        if (result.id.startsWith('0MV')) {
            this.ux.log('Favorite Created');
        }
        return result;
    }
}
