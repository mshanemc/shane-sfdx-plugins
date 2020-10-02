import { flags, SfdxCommand } from '@salesforce/command';
import { singleRecordQuery } from '@mshanemc/plugin-helpers/dist/queries';

import userIdLookup = require('../../../../shared/userIdLookup');

export default class UserPermsetAssign extends SfdxCommand {
    public static description =
        'Assign a permset to a user by first/last name, or just the default user.  Does not error if permset is already assigned';

    public static examples = ['sfdx shane:user:permset:assign -n thePermSet -g User -l User'];

    protected static flagsConfig = {
        firstname: flags.string({
            char: 'g',
            description: 'first (given) name of the user--keeping -f for file for consistency',
            dependsOn: ['lastname']
        }),
        lastname: flags.string({ char: 'l', description: 'last name of the user' }),
        name: flags.string({ char: 'n', required: true, description: 'the value of the permset name or label field' })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        // tslint:disable-next-line: no-any
        const conn = this.org.getConnection() as any;

        const user = this.flags.lastname
            ? await userIdLookup.getUserId(conn, this.flags.lastname, this.flags.firstname)
            : await singleRecordQuery({ conn, query: `select id from User where username ='${(await conn.identity()).username}'` });

        this.ux.log(`found user with id ${user.Id}`);

        // find the permset id
        const permset = await singleRecordQuery({
            conn,
            query: `select id, Name from PermissionSet where Name = '${this.flags.name}' OR Label = '${this.flags.name}'`,
            returnChoices: true
        });

        this.ux.log(`found permset with id ${permset.Id}`);

        const result = await conn
            .create('PermissionSetAssignment', {
                PermissionSetId: permset.Id,
                AssigneeId: user.Id
            })
            .catch(error => {
                if (error.name === 'DUPLICATE_VALUE') {
                    // that's ok to swallow...it was already done, and this command is meant to be idempotent.  If the org is as you asked it to be, that's ok.
                } else {
                    throw new Error(error);
                }
            });
        this.ux.log(`User ${user.Id} has been assigned permset ${this.flags.name} (${permset.Id})`);

        return result;
    }
}
