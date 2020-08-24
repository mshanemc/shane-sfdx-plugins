import { flags, SfdxCommand } from '@salesforce/command';
import { singleRecordQuery } from '../../../shared/queries';

export default class CommunitySelfReg extends SfdxCommand {
    public static description = 'set the self-registration account for a community';

    public static examples = [`sfdx shane:communities:selfreg -a Salesforce -c "Trailblazer Community"`];

    protected static flagsConfig = {
        account: flags.string({
            char: 'a',
            required: true,
            description: 'Name of the account.  Wrap in quotes if there are spaces or weird characters'
        }),
        community: flags.string({
            char: 'c',
            required: true,
            description: 'name of the community.  Wrap in quotes if there are spaces or weird characters'
        })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        const account = await singleRecordQuery({ conn, query: `Select Id from Account where Name = '${this.flags.account}'` });
        const network = await singleRecordQuery({ conn, query: `Select Id from Network where Name = '${this.flags.community}'` });

        const result = await this.org
            .getConnection()
            .sobject('NetworkSelfRegistration')
            .create({
                AccountId: account.Id,
                NetworkId: network.Id
            });

        this.ux.log(`Successfully created NetworkSelfRegistration`);
        return result;
    }
}
