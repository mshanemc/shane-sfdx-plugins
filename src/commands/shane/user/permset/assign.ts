import { flags, SfdxCommand } from '@salesforce/command';
// import * as core from 'src/localTypings';
import { singleRecordQuery } from '../../../../shared/queries';
import userIdLookup = require('../../../../shared/userIdLookup');

export default class UserPermsetSassign extends SfdxCommand {
    public static description = 'Assign a permset to a user by first/last name';

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
    protected static requiresProject = false;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        // tslint:disable-next-line: no-any
        const conn: any = <unknown>this.org.getConnection();
        let user;
        if (this.flags.lastname) {
            user = await userIdLookup.getUserId(conn, this.flags.lastname, this.flags.firstname);
        } else {
            // default to the user that you're connected as
            const username = (await conn.identity()).username;
            console.log(`query is: select id from User where username ='${username}'`);

            user = await singleRecordQuery({ conn, query: `select id from User where username ='${username}'` });
        }

        this.ux.log(`found user with id ${user.Id}`);

        // find the permset id
        const permset = await singleRecordQuery({
            conn,
            query: `select id, Name from PermissionSet where Name = '${this.flags.name}' OR Label = '${this.flags.name}'`,
            returnChoices: true
        });

        this.ux.log(`found permset with id ${permset.Id}`);

        const result = await conn.create('PermissionSetAssignment', {
            PermissionSetId: permset.Id,
            AssigneeId: user.Id
        });

        this.ux.log(
            `Assigned permset ${this.flags.name} (${permset.Id}) to user ${this.flags.firstname ? this.flags.firstname : ''} ${
                this.flags.lastname
            } (${user.Id})`
        );

        return result;
    }
}
