import { SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');

import { fixExistingDollarSign, getExisting} from '../../../../shared/getExisting';
import * as options from '../../../../shared/js2xmlStandardOptions';

import chalk from 'chalk';

export default class TSPUsernameUpdate extends SfdxCommand {

  public static description = 'change the username on all transaction security policies';

  public static examples = [
`sfdx shane:tsp:username:update -n newusername@example.com
// updates the username for executionUser and all notifications in all transaction security policies
`,
`sfdx shane:tsp:username:create
// updates the username for executionUser and all notifications in all transaction security policies to the default org's username
`,
`sfdx shane:tsp:username:create -u someAlias
// updates the username for executionUser and all notifications in all transaction security policies to the specified target org's username
`
  ];

  protected static flagsConfig = {
    newusername: { char: 'n', description: 'manually specify the username, ignoring your default or any -u', type: 'email'},
    directory: { char: 'd', default: 'force-app/main/default', description: 'Where is all this metadata? defaults to force-app/main/default', type: 'string'}
  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;
  protected static supportsUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const targetFolder = `${this.flags.directory}/transactionSecurityPolicies`;
    const finalUsername = this.flags.newusername || this.org.getUsername();
    const output = [];

    if (!fs.existsSync(targetFolder)) {
      this.ux.error(`Folder does not exist: ${targetFolder}`);
      return;
    }

    const tsps = fs.readdirSync(targetFolder);
    this.ux.log(`Updating ${tsps.length} transaction security policies`);

    // loop through the TSPs
    for (const tsp of tsps) {

      let existing = await getExisting(`${targetFolder}/${tsp}`, 'TransactionSecurityPolicy');

      existing.executionUser = finalUsername;

      if (Array.isArray(existing.action.notifications)) {
        existing.action.notifications.forEach((notification, key) => {
          existing.action.notifications[key].user = finalUsername;
        });
      } else {
        existing.action.notifications.user = finalUsername;
      }

      existing = await fixExistingDollarSign(existing);

      // convert to xml and write out the file
      const xml = jsToXml.parse('TransactionSecurityPolicy', existing, options.js2xmlStandardOptions);
      fs.writeFileSync(`${targetFolder}/${tsp}`, xml);

      this.ux.log(chalk.green(`Updated ${tsp}`));
      output.push(existing);
    }

    return output;

  }

}
