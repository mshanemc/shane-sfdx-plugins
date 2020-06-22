import { flags, SfdxCommand } from '@salesforce/command';
import { singleRecordQuery } from '../../../shared/queries';
import { saveFavorite, favoriteFlagsName, favoriteFlagsStart, favoriteFlagsObject } from '../../../shared/uiApiFavorites';
import { FavoriteRequestBody } from '../../../shared/typeDefs';

export default class Favorite extends SfdxCommand {
    public static description = 'query records and set the match as a favorite';

    public static aliases = ['shane:data:favourite'];

    public static examples = [
        `sfdx shane:data:favorite -o Account -w "name='Salesforce.com'"
// finds the matching record and adds it to the end of the favorites menu
`
    ];

    protected static flagsConfig = {
        name: favoriteFlagsName,
        where: flags.string({ char: 'w', required: true, description: 'SOQL where clause to match a single record' }),
        object: favoriteFlagsObject,
        start: favoriteFlagsStart
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();

        const matchedRecord = await singleRecordQuery({
            conn,
            query: `select id from ${this.flags.object} where ${this.flags.where}`
        });

        const body: FavoriteRequestBody = {
            targetType: 'Record',
            target: matchedRecord.Id,
            name: this.flags.name ?? matchedRecord.Name ?? this.flags.object
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
