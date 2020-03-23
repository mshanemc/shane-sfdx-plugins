import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';

import { exec, exec2String } from '../../../shared/execProm';

import fs = require('fs-extra');

export default class ProjectCreate extends SfdxCommand {
    public static description = 'creates an sfdx project';

    public static examples = [
        `sfdx shane:project:create -n myProject
// create a project in the folder with all the default structure
`
    ];

    protected static requiresDevhubUsername = true;

    protected static flagsConfig = {
        name: flags.string({ char: 'n', required: true, description: 'name and path for the project' }),
        gitremote: flags.string({
            char: 'g',
            description: 'full github url for the remote...overrides the default generated from git config user.name and project name'
        })
    };

    public async run(): Promise<any> {
        this.ux.startSpinner('running core project:create command');
        await exec(`sfdx force:project:create -n ${this.flags.name}`);

        this.ux.startSpinner('git setup');
        await exec('git init', { cwd: this.flags.name });

        this.flags.gitremote = this.flags.gitremote ?? `https://github.com/${await exec2String(`git config user.name`)}/${this.flags.name}`;
        await exec(`git remote add origin ${this.flags.gitremote}`, { cwd: this.flags.name });

        this.ux.startSpinner('modifying base project files');

        await Promise.all([
            // folders I like to have
            fs.ensureDir(`${this.flags.name}/scripts`), // place to hold apex scripts for executing on the server
            fs.ensureDir(`${this.flags.name}/data`), // place to hold bulk upload stuff
            fs.ensureDir(`${this.flags.name}/assets`), // place to hold images/files to upload, etc
            fs.ensureDir(`${this.flags.name}/force-app/main/default/classes`), // you'll probably use apex!
            fs.ensureDir(`${this.flags.name}/config/userDef`), // a place to put userDef files

            // files I like to have
            fs.writeFile(`${this.flags.name}/orgInit.sh`, orgInit()), // basic init script
            fs.writeFile(`${this.flags.name}/README.md`, ''), // blank the standard sfdx readme
            fs.writeFile(`${this.flags.name}/package.json`, await this.packageJSON()), // modify default packageJSON
            fs.writeFile(`${this.flags.name}/.prettierrc`, await this.prettier()), // modify default prettier (ex: singleQuote)
            fs.writeFile(`${this.flags.name}/config/project-scratch-def.json`, this.scratchJSON()) // basic git ignore
        ]);

        this.ux.startSpinner('modifying admin profile and orgInit.sh');
        await Promise.all([
            exec('sfdx shane:profile:whitelist -n Admin', { cwd: this.flags.name }), // whitelist the admin profile for everyone
            exec('chmod +x orgInit.sh', { cwd: this.flags.name }) // make orgInit executable
        ]);

        // commands to run
        this.ux.startSpinner('installing dependencies');
        await exec('yarn install', { cwd: this.flags.name }); // whitelist the admin profile for everyone

        this.ux.startSpinner('first git commit');

        await exec(`git add .`, { cwd: this.flags.name });
        await exec(`git commit -m 'init'`, { cwd: this.flags.name });
        this.ux.log(chalk.green(`project created in /${this.flags.name}`));
        return `project created in /${this.flags.name}`;
    }

    // everything below is the content of files I want to create

    public scratchJSON(): string {
        const scratch = {
            orgName: this.flags.name,
            adminEmail: 'sfdx@mailinator.com',
            edition: 'Developer',
            settings: {
                communitiesSettings: {
                    enableNetworksEnabled: false
                },
                lightningExperienceSettings: {
                    enableS1DesktopEnabled: true
                },
                pathAssistantSettings: {
                    pathAssistantEnabled: true
                },
                mobileSettings: {
                    enableS1EncryptedStoragePref2: false
                },
                securitySettings: {
                    passwordPolicies: {
                        enableSetPasswordInApi: true
                    }
                }
            }
        };

        return JSON.stringify(scratch, null, 2);
    }

    public async prettier(): Promise<string> {
        const existing = await fs.readJson(`${this.flags.name}/.prettierrc`);
        return JSON.stringify(
            {
                ...existing,
                singleQuote: true
            },
            null,
            2
        );
    }

    public async packageJSON(): Promise<string> {
        const existing = await fs.readJson(`${this.flags.name}/package.json`);
        const packageJSON = {
            ...existing,
            name: this.flags.name,
            version: '0.0.1',
            description: '',
            scripts: {
                ...existing.scripts,
                build: 'sfdx shane:org:delete; ./orgInit.sh',
                publish: `sfdx shane:package2:version:bump -m -r; git add sfdx-project.json; git commit -m 'package version bump'; git push origin master`
            },
            repository: {
                type: 'git',
                url: `git+${this.flags.gitremote}.git`
            },
            bugs: {
                url: `${this.flags.gitremote}/issues`
            },
            homepage: this.flags.gitremote
        };

        existing.scripts = { ...existing.scripts };

        return JSON.stringify(packageJSON, null, 2);
    }
}

const orgInit = (): string => {
    return `sfdx force:org:create -f config/project-scratch-def.json -d 1 -s
sfdx force:source:push
sfdx force:org:open`;
};
