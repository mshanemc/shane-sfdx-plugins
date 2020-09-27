import { flags, SfdxCommand } from '@salesforce/command';

export default class Search extends SfdxCommand {
    public static description = 'sosl search';

    public static examples = [`sfdx shane:data:search -q "find {stuff}"`];

    protected static flagsConfig = {
        query: flags.string({ char: 'q', required: true, description: 'valid sosl query' })
        // public: { type: 'boolean',  char: 'p', default: false, description: 'mark the cache control public' })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        const result = ((await conn.request({
            url: `${conn.baseUrl()}/search/?q=${encodeURI(this.flags.query)}`
        })) as unknown) as SOSLResponse;
        this.ux.table(result.searchRecords, ['attributes.type', 'attributes.url']);
        return result;
    }
}

interface SOSLResponse {
    searchRecords: [
        {
            attributes: {
                type: string;
                url: string;
            };
        }
    ];
}
