import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import util = require('util');
import request = require('request-promise-native');
import child_process = require('child_process');

const exec = util.promisify(child_process.exec);

export default class GithubPackageInstall extends SfdxCommand {

  public static description = 'installs a package from github using the latestVersion.json file convention';

  public static examples = [
`sfdx shane:github:package:install -g someUser -r someRepo -u someOrg
// pulls SubscriberPackageVersionId from https://github.com/someUser/someRepo/latestVersion.json
`
  ];

  protected static requiresUsername = true;

  protected static flagsConfig = {
    githubUser: flags.string({ required: true, char: 'g', description: 'github username where the package lives' }),
    repo: flags.string({ required: true, char: 'r', description: 'repo where the packages lives' })
    // branch: flags.string({ char: 'b', description: 'optional branch' })
  };

  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    // get the SubscriberPackageVersionId from github
    const url = `https://github.com/${this.flags.githubUser}/${this.flags.repo}/latestVersion.json`;
    // if (this.flags.branch) {
    //   this.ux.error(chalk.red('branch handling is not implemented yet'));
    //   return false;
    // }

    const result = await request.get({
      url,
      json: true
    });

    // install in the org
    const installResult = await exec(`sfdx force:package:install -i ${result.SubscriberPackageVersionId} -r -u ${this.org.getUsername()} -w 20 -p 20 --json`);
    console.log(installResult);
    return installResult;
  }

}
