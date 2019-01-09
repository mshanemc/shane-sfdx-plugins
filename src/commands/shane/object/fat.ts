import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');

import { fixExistingDollarSign, getExisting } from '../../../shared/getExisting';
import * as options from '../../../shared/js2xmlStandardOptions';

export default class FATUpdate extends SfdxCommand {

  public static description = 'add or update a field audit trail retention policy on an object.  Modifies local source--you still need to push/deploy';

  public static examples = [
`sfdx shane:object:fat -o Account
// set the retention policy on Account to the defaults (archive after 18 months, archive for 10 years)
`,
`sfdx shane:object:fat -o Account -m 4 -y 5
// archive history for 5 years, after being in regular history for 4 months
`,
`sfdx shane:object:fat -o Account -m 4 -y 5 -d myDir
// same as 2nd example, except metadata is in myDir instead of the default force-app/main/default
`,
`sfdx shane:mdapi:pull -o Account -u realOrg && sfdx shane:object:fat -o Account -m 4 -y 5 -d myDir && sfdx shane:mdapi:push -u realOrg
// get some object you don't have locally, create the policy, and push that back up to where it came from
`
];

  protected static flagsConfig = {
    object: flags.string({char: 'o', description: 'object to manage the policy for', required: true}),
    archiveaftermonths: flags.integer({ char: 'm', description: 'archive after this number of months', default: 18, min: 1, max: 18 }),
    archiveretentionyears: flags.integer({ char: 'y', default: 10, min: 0, max: 10, description: 'Archive for this many years'}),
    description: flags.string({description: 'optional friendly description for the policy'}),
    directory: flags.directory({ char: 'd', default: 'force-app/main/default', description: 'Where is all this metadata? defaults to force-app/main/default'})
  };

  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const targetFolder = `${this.flags.directory}/objects/${this.flags.object}`;
    const targetFilename = `${targetFolder}/${this.flags.object}.object-meta.xml`;

    if (!fs.existsSync(targetFolder)) {
      this.ux.error(`Folder does not exist: ${targetFolder}.  Pull object schema using sfdx shane:mdapi:pull -o ${this.flags.object}`);
      return;
    }

    if (!fs.existsSync(targetFilename)) {
      this.ux.error(`Object does not exist in local source: ${targetFilename}.  Pull object schema using sfdx shane:mdapi:pull -s`);
      return;
    }

    let existing = await getExisting(targetFilename, 'CustomObject');
    existing.enableHistory = true;

    existing.historyRetentionPolicy = existing.historyRetentionPolicy || {};

    if (this.flags.archiveaftermonths) {
      existing.historyRetentionPolicy.archiveAfterMonths = this.flags.archiveaftermonths;
    }
    if (this.flags.archiveretentionyears) {
      existing.historyRetentionPolicy.archiveRetentionYears = this.flags.archiveretentionyears;
    }
    if (this.flags.description) {
      existing.historyRetentionPolicy.description = this.flags.description;
    }

    existing = await fixExistingDollarSign(existing);

    // convert to xml and write out the file
    const xml = jsToXml.parse('CustomObject', existing, options.js2xmlStandardOptions);
    fs.writeFileSync(targetFilename, xml);

    this.ux.log(chalk.green(`Updated ${targetFilename} in local source`));
    return existing;
  }

}
