import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import util = require('util');

import child_process = require('child_process');
import chalk from 'chalk';

const exec = util.promisify(child_process.exec);

export default class Delete extends SfdxCommand {

  public static description = 'delete the default scratch org.  Won\'t prompt you for confirmation';

  public static examples = [
`sfdx shane:org:delete
// deletes the current default scratch org
`
  ];

  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const result = await exec(`sfdx force:org:delete -p -u ${this.org.getUsername()} --json`);
    if (JSON.parse(result.stdout).status === 0) {
      this.ux.log(chalk.green('org successfully marked for deletion'));
    } else {
      this.ux.error(result.stderr);
    }
    return result;
  }
}
