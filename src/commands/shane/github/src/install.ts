import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import util = require('util');
import request = require('request-promise-native');
import child_process = require('child_process');

const exec = util.promisify(child_process.exec);

const tmpDir = 'githubMdapiTmp';

export default class GithubPackageInstall extends SfdxCommand {

  public static description = 'installs a package from github from mdapi src';

  public static examples = [
`sfdx shane:github:src:install -g someUser -r someRepo -u someOrg
// pulls mdapi-formatted code from https://github.com/someUser/someRepo/src and deploys to the org
`,
`sfdx shane:github:src:install -g someUser -r someRepo -u someOrg -p my/folder/tree
// pulls mdapi-formatted code from https://github.com/someUser/someRepo/my/folder/tree and deploys to the org
`
  ];

  protected static requiresUsername = true;

  protected static flagsConfig = {
    githubUser: flags.string({ required: true, char: 'g', description: 'github username where the package lives' }),
    repo: flags.string({ required: true, char: 'r', description: 'repo where the packages lives' }),
    path: flags.string({ default: 'src', char: 'r', description: 'folder where the source lives' })
    // branch: flags.string({ char: 'b', description: 'optional branch' })
  };

  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    fs.ensureDirSync(tmpDir);

    // download the source and put into the folder
    // may have to be a clone operation
    // // clone to tempCloneDir, single branch
    // // cp the path folder to the tmpDir
    // // rm the cloneDir
    const url = `https://github.com/${this.flags.githubUser}/${this.flags.repo}/src`;
    // if (this.flags.branch) {
    //   this.ux.error(chalk.red('branch handling is not implemented yet'));
    //   return false;
    // }

    // const result = await request.get({
    //   url,
    //   json: true
    // });

    // install in the org
    const installResult = await exec(`sfdx force:mdapi:deploy -d ${tmpDir} -u ${this.org.getUsername()} -w 20 --json`);
    console.log(installResult);
    return installResult;
  }

}
