import { SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';

export default class RefreshToken extends SfdxCommand {

  public static description = 'Outputs a refresh token from an org that you\'ve already auth\'d sfdx to.  PLEASE BE CAREFUL WITH THIS AND TREAT IT AS A PASSWORD';

  public static examples = [
`sfdx shane:org:refreshtoken -u someAliasOrUsername
// prints the refresh token for some org that you've already connected to
`
  ];

  protected static flagsConfig = {
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const auth = await this.org.readUserAuthFiles();
    const fields = auth[0].getFields();
    if (fields.refreshToken) {
      this.ux.log(`Your refresh token for ${chalk.blue(fields.username)} is ${chalk.green(fields.refreshToken)}`);
      this.ux.log(chalk.red('PLEASE BE CAREFUL WITH THIS AND TREAT THIS AS YOU WOULD A PASSWORD, INCLUDING CLEARING YOUR TERMINAL HISTORY'));
      return fields.refreshToken;
    } else {
      throw new Error('Refresh token not available');
    }
  }
}
