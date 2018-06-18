import { flags } from '@oclif/command';
import { SfdxCommand, core } from '@salesforce/command';
import util = require('util');
import child_process = require('child_process');

const exec = util.promisify(child_process.exec);

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
    path: flags.string({ default: 'src', char: 'p', description: 'folder where the source lives' }),
    keepLocally: flags.boolean({char: 'k', description: 'keep the cloned repo in local source instead of deleting it'})
    // branch: flags.string({ char: 'b', description: 'optional branch' })
  };

  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const repoUrl = `https://github.com/${this.flags.githubUser}/${this.flags.repo}`;

    const gitResult = await exec(`git clone ${repoUrl}`);
    this.ux.log(gitResult.stderr);

    // install in the org
    const installResult = await exec(`sfdx force:mdapi:deploy -d ${this.flags.repo}/${this.flags.path} -u ${this.org.getUsername()} -w 20 --json`);
    this.ux.logJson(JSON.parse(installResult.stdout));

    if (!this.flags.keepLocally) {
      await exec(`rm -rf ${this.flags.repo}`);
    }

    return JSON.parse(installResult.stdout);
  }

}
