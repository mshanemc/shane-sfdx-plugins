import { SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import * as stripcolor from 'strip-color';

import { exec } from '../../../shared/execProm';

export default class Delete extends SfdxCommand {
    public static description = "delete the default scratch org.  Won't prompt you for confirmation";
    public static aliases = ['shane:org:destroy'];

    public static examples = [
        `sfdx shane:org:delete
// deletes the current default scratch org
`
    ];

    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const result = await exec(`sfdx force:org:delete -p -u ${this.org.getUsername()} --json`);
        if (JSON.parse(stripcolor(result.stdout)).status === 0) {
            this.ux.log(chalk.green('org successfully marked for deletion'));
        } else {
            this.ux.error(result.stderr);
        }
        return result;
    }
}
