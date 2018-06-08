import { flags } from '@oclif/command';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import util = require('util');

import child_process = require('child_process');

const exec = util.promisify(child_process.exec);

export default class Push extends SfdxCommand {

  public static description = 'convert and deploy the packaged source';

  public static examples = [
`sfdx shane:mdapi:push -u someOrg
// convert to mdapi format and push to the given org
`
  ];

  protected static requiresUsername = true;

  protected static flagsConfig = {
    convertedFolder: flags.string({ char: 'd', description: 'where to store the mdapi-converted source', default: 'mdapiout' }),
    keepConverted: flags.boolean({ char: 'k', description: 'Don\'t automatically delete the converted source'}),
    source: flags.string({ char: 'r', default: 'force-app', description: 'deploy a specific folder that\'s not force-app'}),
    deploymentTimeLimit: {char: 'w', type: 'number', description: 'How many minutes to wait for the deployment to finish', default: 200 }
  };

  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    if (!fs.existsSync(this.flags.source)) {
      this.ux.error(`your source folder [${this.flags.source}] doesn't exist`);
    }

    fs.ensureDirSync(this.flags.convertedFolder);

    process.stdout.write('Starting source conversion');
    await exec(`sfdx force:source:convert -d ${this.flags.convertedFolder} -r ${this.flags.source}`);
    process.stdout.write('done.  Deploying...');
    await exec(`sfdx force:mdapi:deploy -w ${this.flags.deploymentTimeLimit} -d ${this.flags.convertedFolder} -u ${this.org.getUsername()}`);

    if (!this.flags.keepConverted) {
      process.stdout.write('done.  Cleaning up...');
      await exec(`rm -rf ./${this.flags.convertedFolder}`);
    }
    process.stdout.write('Done!\n');

  }
}
