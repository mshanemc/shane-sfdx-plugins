import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import cli from 'cli-ux';
import fs = require('fs-extra');

import { exec, exec2JSON } from '../../../../shared/execProm';

export default class Bump extends SfdxCommand {
    public static description = 'bump the major/minor version number in the packageDirectory';
    public static aliases = ['shane:package:version:bump'];

    public static examples = [
        `sfdx shane:package2:version:bump -m
// bump the minor version up by one (and set patch to 0)
`,
        `sfdx shane:package2:version:bump -M
// bump the major version up by one (and set minor/patch to 0)
`,
        `sfdx shane:package2:version:bump -p
// bump the patch version up by one
`,
        `sfdx shane:package2:version:bump -M -t myDir
// bump the major version up by one for a particular directory that's not the default
`,
        `sfdx shane:package2:version:bump --minor --create
// bump the minor version up by one and create a new package2version
`,
        `sfdx shane:package2:version:bump --minor --release
// bump the minor version up by one and create a new package2version, then set that as released
`
    ];

    protected static flagsConfig = {
        major: flags.boolean({
            char: 'M',
            description: 'Bump the major version by 1, sets minor,build to 0',
            exclusive: ['minor', 'patch']
        }),
        minor: flags.boolean({ char: 'm', description: 'Bump the minor version by 1', exclusive: ['major', 'patch'] }),
        patch: flags.boolean({ char: 'p', description: 'Bump the patch version by 1', exclusive: ['major', 'minor'] }),
        create: flags.boolean({ char: 'c', description: 'create a new packageVersion from the new versionNumber' }),
        release: flags.boolean({
            char: 'r',
            description: 'set the newly version as released (out of Beta).  Implies create whether you flag it or not :)'
        }),
        target: flags.string({
            char: 't',
            default: 'force-app',
            description: 'name of your package directory (defaults to force-app)'
        })
    };

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;
    protected static requiresDevhubUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        if ((this.flags.major && this.flags.minor) || (!this.flags.major && !this.flags.minor)) {
            this.ux.error(chalk.red('You have to specify either --major or --minor but not both'));
            return;
        }

        const projectFile = await this.project.retrieveSfdxProjectJson(false);

        const project = JSON.parse(fs.readFileSync(projectFile.getPath(), 'UTF-8'));

        const targetDirIndex = project.packageDirectories.findIndex(i => {
            return i.path === this.flags.target;
        });

        if (targetDirIndex < 0) {
            this.ux.error(`found nothing in packageDirectories matching path ${this.flags.path}`);
        }

        const versionNumber = project.packageDirectories[targetDirIndex].versionNumber.split('.');

        if (this.flags.major) {
            versionNumber[0] = parseInt(versionNumber[0], 10) + 1;
            versionNumber[1] = 0;
            versionNumber[2] = 0;
        } else if (this.flags.minor) {
            versionNumber[1] = parseInt(versionNumber[1], 10) + 1;
            versionNumber[2] = 0;
        } else if (this.flags.patch) {
            versionNumber[2] = parseInt(versionNumber[2], 10) + 1;
        }

        project.packageDirectories[targetDirIndex].versionNumber = versionNumber.join('.');
        await fs.writeFile(projectFile.getPath(), JSON.stringify(project, null, 2));

        this.ux.log(chalk.green(`Updated sfdx-project.json for ${this.flags.target} to ${project.packageDirectories[targetDirIndex].versionNumber}`));

        // do we need to generate the new version?
        if (this.flags.create || this.flags.release) {
            try {
                cli.action.start("Creating package version (this'll take a while)");
                // createResult = <CreateResultI>await exec(`sfdx force:package2:version:create -d ${this.flags.target} -w 20 -v ${this.hubOrg.getUsername()} --json`);
                const packageCreationStart = new Date();
                const createResult = await exec2JSON(
                    `sfdx force:package:version:create -x -d ${this.flags.target} -w 20 -v ${this.hubOrg.getUsername()} --json`
                );
                const packageCreationEnd = new Date();

                cli.action.stop(`done in (${Math.round((packageCreationEnd.getTime() - packageCreationStart.getTime()) / 1000)} seconds)`);
                const actualResult = createResult.result;

                if (!this.flags.json) {
                    this.ux.logJson(actualResult);
                }

                // await fs.writeFile(`${this.project.getPath()}/${pkgVersionFileName}`, JSON.stringify(actualResult, null, 2));
                this.ux.log(chalk.green(`Version Created with Id: ${actualResult.Package2VersionId}`));

                // now, are we publishing
                if (this.flags.release) {
                    cli.action.start(
                        `Releasing: sfdx force:package:version:promote -n -p ${actualResult.Package2VersionId} -v ${this.hubOrg.getUsername()} --json`
                    );
                    await exec(`sfdx force:package:version:promote -n -p ${actualResult.Package2VersionId} -v ${this.hubOrg.getUsername()} --json`);
                    cli.action.stop();
                    this.ux.log(`${chalk.green('Version released')}. May take several minutes to become available to destination org.`);
                    this.ux.log(
                        `Install with sfdx force:package:install -r -b 20 -w 20 -p ${actualResult.SubscriberPackageVersionId} -u destinationOrgAlias`
                    );
                } else {
                    return createResult.result;
                }
            } catch (err) {
                this.ux.error(err);
                cli.action.stop();
                return err;
            }
        }
    }
}
