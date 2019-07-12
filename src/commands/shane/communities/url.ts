import { flags, SfdxCommand } from '@salesforce/command';
import { getExternalApps } from './../../../shared/community';

export default class CommunityUrl extends SfdxCommand {
    public static description = 'get me the login for a community from an org';

    public static examples = ['sfdx shane:communities:url --prefix dealers'];

    protected static flagsConfig = {
        prefix: flags.string({ char: 'p', required: false, description: 'community prefix (thing after the slash in the url)' })
    };

    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const conn = this.org.getConnection();

        const extApps = await getExternalApps(conn);
        let output;

        if (this.flags.prefix) {
            if (extApps.communities[this.flags.prefix]) {
                output = `https://${extApps.domain}/${this.flags.prefix}`;
            } else {
                throw new Error(`There is no community with prefix ${this.flags.prefix}`);
            }
        } else {
            output = `https://${extApps.domain}`;
        }
        this.ux.log(output);
        return output;
    }
}
