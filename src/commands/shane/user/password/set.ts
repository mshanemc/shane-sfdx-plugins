import { flags, SfdxCommand } from '@salesforce/command';

import chalk from 'chalk';

import request = require('request-promise-native');
import userIdLookup = require('../../../../shared/userIdLookup');

export default class Set extends SfdxCommand {
    public static description = 'Set the password for a user by first/last name';

    public static examples = [
        `sfdx shane:user:password:set -p sfdx1234 -g User -l User
// sets the password for User User to sfdx1234
`
    ];

    protected static flagsConfig = {
        firstname: flags.string({ char: 'g', required: true, description: 'first (given) name of the user--keeping -f for file for consistency' }),
        lastname: flags.string({ char: 'l', required: true, description: 'last name of the user' }),
        password: flags.string({ char: 'p', required: true, description: 'the password you want the user to have' })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        const user = await userIdLookup.getUserId(conn, this.flags.lastname, this.flags.firstname);
        this.ux.log(`found user with id ${user.Id}`);

        const resetResult = await request({
            method: 'post',
            uri: `${conn.instanceUrl}/services/data/v41.0/sobjects/User/${user.Id}/password`,
            body: {
                NewPassword: this.flags.password
            },
            headers: {
                Authorization: `Bearer ${conn.accessToken}`
            },
            json: true,
            resolveWithFullResponse: true
        });

        if (resetResult.statusCode !== 204) {
            throw new Error(`Password not set correctly: ${resetResult}`);
        }

        // store in local sfdx
        // await userOrg.saveConfig(Object.assign(orgConfig, { password: pwd }), undefined);
        const auth = await this.org.readUserAuthFiles();
        await auth[0].save({ ...auth, password: this.flags.password });

        this.ux.log(chalk.green(`Successfully set the password "${this.flags.password}" for user ${user.Username}.`));
        this.ux.log(`You can see the password again by running "sfdx force:user:display -u ${user.Username}".`);
        return {
            password: this.flags.password,
            username: user.Username
        };
    }
}
