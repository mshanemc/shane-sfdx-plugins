import { flags, SfdxCommand } from '@salesforce/command';

export default class MetadataDescribe extends SfdxCommand {
    public static description = "what's in the org?";

    public static examples = [
        `sfdx shane:mdapi:list -u someOrg -t CustomObject
// what metadata exists for a specific type
`
    ];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        type: flags.string({ required: true, char: 't', description: 'pull only a specific type.  See the metadata api docs for type names' })
    };

    protected static requiresProject = false;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const conn = await this.org.getConnection();
        const apiVersion = this.flags.apiversion || (await this.org.retrieveMaxApiVersion());
        const metadata = await conn.metadata.list([{ type: this.flags.type, folder: null }], apiVersion);
        this.ux.logJson(metadata);
        return metadata;
    }
}
