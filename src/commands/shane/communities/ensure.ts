/* tslint:disable:no-unused-expression */
import { flags, SfdxCommand } from '@salesforce/command';
import { ensureCommunity } from '../../../shared/community';

export default class CommunityEnsure extends SfdxCommand {
    public static description = 'Ensure a community with the given name exists';

    protected static requiresUsername = true;

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            description: 'name of the community to find',
            required: true
        })
    };

    // tslint:disable-next-line: no-any
    public async run(): Promise<any> {
        const conn = this.org.getConnection();

        this.ux.startSpinner(`Checking communities in the org`);

        const foundCommunity = await ensureCommunity(conn, this.flags.name);
        this.ux.stopSpinner(`The community ${this.flags.name} exists`);

        return foundCommunity;
    }
}
