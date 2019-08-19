import { flags, SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');

import { exec, exec2JSON } from '../../../../shared/execProm';

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
        githubuser: flags.string({ required: true, char: 'g', description: 'github username where the package lives' }),
        repo: flags.string({ required: true, char: 'r', description: 'repo where the packages lives' }),
        path: flags.directory({ default: 'src', char: 'p', description: 'folder where the source lives' }),
        keeplocally: flags.boolean({ char: 'k', description: 'keep the cloned repo in local source instead of deleting it' }),
        convert: flags.boolean({ char: 'c', description: 'the path folder is sfdx format, not mdapi, and should be converted first' })
        // branch: {type: 'string', char: 'b', description: 'optional branch' })
    };

    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        await fs.remove(this.flags.repo);
        const repoUrl = `https://github.com/${this.flags.githubuser}/${this.flags.repo}`;

        const gitResult = await exec(`git clone ${repoUrl}`);
        this.ux.log(gitResult.stderr);

        if (this.flags.convert) {
            // convert to temp dir
            await exec(`sfdx force:source:convert -r ${this.flags.path} -d tmpSrcFolder`, { cwd: this.flags.repo });
            // delete the original source
            await fs.remove(`${this.flags.repo}/${this.flags.path}`);
            // put the converted source where the original was
            await fs.move(`${this.flags.repo}/tmpSrcFolder`, `${this.flags.repo}/${this.flags.path}`);
        }

        // install in the org via mdapi
        const installResult = await exec2JSON(
            `sfdx force:mdapi:deploy -d ${this.flags.repo}/${this.flags.path} -u ${this.org.getUsername()} -w 20 --json`
        );
        // this.ux.logJson(JSON.parse(installResult.stdout));

        if (!this.flags.keeplocally) {
            await fs.remove(this.flags.repo);
        }

        return installResult;
    }
}
