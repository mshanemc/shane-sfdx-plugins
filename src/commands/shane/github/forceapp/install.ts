import { flags, SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');

import { exec, exec2JSON } from '../../../../shared/execProm';

export default class GithubPackageInstall extends SfdxCommand {
    public static description = 'installs a package from github in DX Source format';

    public static examples = [
        `sfdx shane:github:forceapp:install -g someUser -r someRepo -u someOrg
// pulls DX Source-formatted code from https://github.com/someUser/someRepo/src and deploys to the org
`,
        `sfdx shane:github:forceapp:install -g someUser -r someRepo -u someOrg -p my/folder/tree
// pulls DX Source-formatted code from https://github.com/someUser/someRepo/my/folder/tree and deploys to the org
`
    ];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        githubuser: flags.string({ required: true, char: 'g', description: 'github username where the package lives' }),
        repo: flags.string({ required: true, char: 'r', description: 'repo where the packages lives' }),
        path: flags.directory({ default: 'force-app', char: 'p', description: 'folder where the source lives' }),
        keeplocally: flags.boolean({ char: 'k', description: 'keep the cloned repo in local source instead of deleting it' })
        // branch: {type: 'string', char: 'b', description: 'optional branch' })
    };

    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        await fs.remove(this.flags.repo);
        const repoUrl = `https://github.com/${this.flags.githubuser}/${this.flags.repo}`;

        this.ux.startSpinner(`cloning from ${repoUrl}`);
        await exec(`git clone ${repoUrl}`);
        this.ux.stopSpinner();

        if (!fs.existsSync(`${this.flags.repo}`)) {
            if (!this.flags.keeplocally) {
                await fs.remove(this.flags.repo);
            }
            throw new Error(`there is nothing at '${this.flags.path}'.  Check your --path flag`);
        }

        this.ux.startSpinner(`deploying to org`);
        // install in the org
        const installResult = await exec2JSON(`sfdx force:source:deploy -p ${this.flags.path} -u ${this.org.getUsername()} -w 30 --json`, {
            cwd: this.flags.repo
        });
        this.ux.stopSpinner();

        if (!this.flags.json) {
            this.ux.logJson(installResult);
        }

        if (!this.flags.keeplocally) {
            await fs.remove(this.flags.repo);
        }

        return installResult;
    }
}
