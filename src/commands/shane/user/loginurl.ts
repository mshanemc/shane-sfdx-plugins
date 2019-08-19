import { flags, SfdxCommand } from '@salesforce/command';
import * as assert from 'assert';

import { exec2JSON } from '../../../shared/execProm';

export default class LoginURL extends SfdxCommand {
    public static description = 'generate a long-lived shareable login url for the org';

    public static examples = [
        `sfdx shane:user:loginurl
    // generates a url including un and pw query strings to simplify logging into the scratch org
    `,
        `sfdx shane:user:loginurl -p /lightning/setup/ObjectManager/home
    // same, but sets the start url to ObjectManager
    `
    ];

    protected static flagsConfig = {
        starturl: flags.string({ char: 'p', description: 'url to open' })
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const auth = this.org.getConnection().getAuthInfoFields();
        // this.ux.logJson(auth);
        assert.ok(auth.password, 'No password is set...run sfdx shane:user:password:set first');

        const username = this.org.getUsername();

        const resultObject = await exec2JSON(`sfdx force:org:display --json -u ${username}`);

        // this.ux.logJson(resultObject.result);
        let url = `${auth.loginUrl}/login.jsp?un=${encodeURIComponent(auth.username)}&pw=${encodeURIComponent(resultObject.result.password)}`;

        if (this.flags.starturl) {
            url = `${url}&startURL=${encodeURIComponent(this.flags.starturl)}`;
        }

        this.ux.log(url);
        return url;
    }
}
