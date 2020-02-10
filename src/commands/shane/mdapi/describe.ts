import { SfdxCommand } from '@salesforce/command';

export default class MetadataDescribe extends SfdxCommand {
    public static description = "what's in the org?";

    public static examples = [
        `sfdx shane:mdapi:describe -u someOrg
// list the metadata available in the org
`
    ];

    protected static requiresUsername = true;

    protected static flagsConfig = {};

    protected static deprecated = {
        version: 43,
        to: 'sfdx force:mdapi:describemetadata'
    };

    public async run(): Promise<any> {
        const conn = await this.org.getConnection();
        const metadata = await conn.metadata.describe(this.flags.apiversion || (await this.org.retrieveMaxApiVersion()));
        // this.ux.logJson(metadata);
        return metadata;
    }
}
