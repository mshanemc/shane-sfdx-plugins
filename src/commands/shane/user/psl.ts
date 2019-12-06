import { flags, SfdxCommand } from '@salesforce/command';
import { singleRecordQuery } from '../../../shared/queries';
import userIdLookup = require('../../../shared/userIdLookup');

export default class PSLAssign extends SfdxCommand {
    public static description = 'Assign a permset license already in an org for a user';

    public static examples = [
        `sfdx shane:user:psl -n SomePSL -g User -l User
// assign the PSL named 'somePSL' for the user named User User
`
    ];

    protected static flagsConfig = {
        firstname: flags.string({ char: 'g', description: 'first (given) name of the user--keeping -f for file for consistency' }),
        lastname: flags.string({ char: 'l', required: true, description: 'last name of the user' }),
        name: flags.filepath({ char: 'n', required: true, description: 'developer name or label of the PermSetLicense' })
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    // protected static supportsDevhubUsername = true;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        // const name = this.flags.name || 'world';

        const conn = this.org.getConnection();
        // const query = 'Select Name, TrialExpirationDate from Organization';
        const user = await userIdLookup.getUserId(conn, this.flags.lastname, this.flags.firstname);
        this.ux.log(`found user with id ${user.Id}`);
        const PSL = await singleRecordQuery({
            conn,
            query: `select Id, DeveloperName, MasterLabel from PermissionSetLicense where DeveloperName = '${this.flags.name}' or MasterLabel = '${this.flags.name}'`
        });
        this.ux.log(`found PSL with id ${PSL.Id}`);

        const createResult = await conn.create('PermissionSetLicenseAssign', {
            AssigneeId: user.Id,
            PermissionSetLicenseId: PSL.Id
        });
        this.ux.logJson(createResult);
        return createResult;
    }
}
