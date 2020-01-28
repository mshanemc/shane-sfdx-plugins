import { flags, SfdxCommand } from '@salesforce/command';

import { exec2JSON } from '../../../../shared/execProm';

import request = require('request-promise-native');

export default class GithubPackageInstall extends SfdxCommand {
    public static description = 'installs a package from github using the sfdx-project.json file (v43+) OR the latestVersion.json file convention';

    public static examples = [
        `sfdx shane:github:package:install -g someUser -r someRepo -u someOrg
// installs packageVersion (04t) from https://github.com/someUser/someRepo/sfdx-project.json or https://github.com/someUser/someRepo/latestVersion.json
`
    ];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        githubuser: flags.string({ required: true, char: 'g', description: 'github username where the package lives' }),
        repo: flags.string({ required: true, char: 'r', description: 'repo where the packages lives' })
        // branch: { type: 'string',  char: 'b', description: 'optional branch' })
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        let packageVersionId;

        // first, look in the sfdx-project.json file, using the packaging output from v43
        let url = `https://raw.githubusercontent.com/${this.flags.githubuser}/${this.flags.repo}/master/sfdx-project.json`;
        const primaryResult = await request.get({
            url,
            json: true
        });

        // this.ux.log(`file at ${url} says:`);

        if (primaryResult.packageAliases) {
            // grab the last package version unless a version is specified
            const packages = Object.values(primaryResult.packageAliases);
            // this.ux.log(`packages are ${packages}`);
            packageVersionId = packages[packages.length - 1];
            if (packageVersionId.startsWith('04t')) {
                this.ux.log(`found packageVersionId ${packageVersionId} in the sfdx-project.json file`);
            } else {
                throw new Error('no package version id found');
            }
        } else {
            // try the fallback option
            // get the SubscriberPackageVersionId from github using Shane's original format
            url = `https://raw.githubusercontent.com/${this.flags.githubuser}/${this.flags.repo}/master/latestVersion.json`;

            // this.ux.log(`file at ${url} says:`);

            const result = await request.get({
                url,
                json: true
            });

            // this.ux.log(result);
            packageVersionId = result.SubscriberPackageVersionId;
            // install in the org
        }
        const installResult = await exec2JSON(
            `sfdx force:package:install --package ${packageVersionId} -r -u ${this.org.getUsername()} -w 20 --publishwait 20 --json`,
            {}
        );
        if (!this.flags.json) {
            this.ux.logJson(installResult);
        }
        return installResult;
    }
}
