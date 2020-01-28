import { SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';

import { exec2JSON } from '../../../shared/execProm';

export default class Delete extends SfdxCommand {
    public static description = "delete the default scratch org.  Won't prompt you for confirmation";

    public static aliases = ['shane:org:destroy'];

    public static examples = [`sfdx shane:org:delete // deletes the current default scratch org`];

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const response = await exec2JSON(`sfdx force:org:delete -p -u ${this.org.getUsername()} --json`);
        this.ux.log(chalk.green('org successfully marked for deletion'));
        return response;
    }
}
