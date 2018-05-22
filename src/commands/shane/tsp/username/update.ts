import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import cli from 'cli-ux';
import jsToXml = require('js2xmlparser');
import xml2js = require('xml2js');
import util = require('util');
import { existsSync } from 'fs-extra';

const options = require('../../../../shared/js2xmlStandardOptions');

import chalk from 'chalk';

export default class TSPUsernameUpdate extends SfdxCommand {

  public static description = 'change the username on all transaction security policies';

  public static examples = [
`sfdx shane:tsp:username:update -n newusername@example.com
// updates the username for executionUser and all notifications in all transaction security policies
`,
`sfdx shane:permset:create
// updates the username for executionUser and all notifications in all transaction security policies to the default org's username
`,
`sfdx shane:permset:create -u someAlias
// updates the username for executionUser and all notifications in all transaction security policies to the specified target org's username
`
  ];

  protected static flagsConfig = {
    newusername: { char: 'n', description: 'manually specify the username to use', type: 'email'},
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

      const existing = await this.getExisting(`${targetFolder}/${tsp}`);

      existing.executionUser = finalUsername;

      if (Array.isArray(existing.action.notifications)) {
        existing.action.notifications.forEach((notification, key) => {
          existing.action.notifications[key].user = finalUsername;
        });
      } else {
        existing.action.notifications.user = finalUsername;
      }

      // correct @ => $ issue
      if (existing['$']) {
        const temp = existing['$'];
        delete existing['$'];
        existing['@'] = temp;
      }

      // convert to xml and write out the file
      const xml = jsToXml.parse('TransactionSecurityPolicy', existing, options);
      fs.writeFileSync(`${targetFolder}/${tsp}`, xml);

      this.ux.log(chalk.green(`Updated ${tsp}`));
      output.push(existing);
    }

    return output;

  }

  public async getExisting(targetFilename: string) {
    // get or create permset
    if (fs.existsSync(targetFilename)) {
      const parser = new xml2js.Parser({ explicitArray: false });
      const parseString = util.promisify(parser.parseString);
      const existing = await parseString(fs.readFileSync(targetFilename));
      return existing.TransactionSecurityPolicy;
    } else {
      throw new Error(`Not found: ${targetFilename}`);
    }
  }

}
