import { SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');

const exec = util.promisify(child_process.exec);

export default class ProjectCreate extends SfdxCommand {

  public static description = 'creates an sfdx project';

  public static examples = [
`sfdx shane:project:create -n myProject
// create a project in the folder with all the default structure
`
  ];

  protected static requiresDevhubUsername = true;

  protected static flagsConfig = {
    name: { type: 'string', char: 'n', required: true, description: 'name and path for the project'},
    gitremote: { type: 'string', char: 'g', required: true, description: 'full github url for the remote', default: 'RemoteTBD' }
  };

  public async run(): Promise<any> { // tslint:disable-line:no-any

    await exec(`sfdx force:project:create -n ${this.flags.name}`);
    await exec('git init', {cwd: this.flags.name});

    if (this.flags.gitremote) {
      await exec(`git remote add origin ${this.flags.gitremote}`, { cwd: this.flags.name });
    }

    // folders I like to have
    fs.ensureDirSync(`${this.flags.name}/scripts`); // place to hold apex scripts for executing on the server
    fs.ensureDirSync(`${this.flags.name}/data`); // place to hold bulk upload stuff
    fs.ensureDirSync(`${this.flags.name}/assets`); // place to hold images/files to upload, etc
    fs.ensureDirSync(`${this.flags.name}/force-app/main/default/classes`); // you'll probably use apex!
    fs.ensureDirSync(`${this.flags.name}/config/userDef`); // a place to put userDef files

    // files I like to have
    fs.writeFileSync(`${this.flags.name}/orgInit.sh`, this.orgInit()); // basic init script
    await exec('chmod +x orgInit.sh', {cwd: this.flags.name}); // make executable
    fs.writeFile(`${this.flags.name}/README.md`, '');  // blank the standard sfdx readme
    fs.writeFileSync(`${this.flags.name}/.gitignore`, this.gitIgnore()); // basic git ignore
    fs.writeFileSync(`${this.flags.name}/package.json`, this.packageJSON()); // basic git ignore
    fs.writeFileSync(`${this.flags.name}/config/project-scratch-def.json`, this.scratchJSON()); // basic git ignore
    fs.writeFileSync(`${this.flags.name}/sfdx-project.json`, this.projectJSON(await await this.hubOrg.retrieveMaxApiVersion())); // basic git ignore

    // commands to run
    await exec('sfdx shane:profile:whitelist -n Admin', { cwd: this.flags.name }); // whitelist the admin profile for everyone
    await exec('npm install', { cwd: this.flags.name }); // whitelist the admin profile for everyone

    this.ux.log(chalk.green(`project created in /${this.flags.name}`));
  }

  // everything below is the content of files I want to create

  public orgInit(): string {
    return `sfdx force:org:create -f config/project-scratch-def.json -d 1 -s
    sfdx force:source:push
    sfdx force:org:open
    `;
  }

  public gitIgnore(): string {
    return 'node_modules' + '\r\n' + '.vscode/settings.json';
  }

  public projectJSON(api): string {
    const project = {
      packageDirectories: [
        {
          path: 'force-app',
          default: true
        }
      ],
      namespace: '',
      sfdcLoginUrl: 'https://login.salesforce.com',
      sourceApiVersion: api
    };

    return JSON.stringify(project, null, 2);
  }

  public scratchJSON(): string {
    const scratch = {
      orgName: this.flags.name,
      edition: 'Developer',
      orgPreferences: {
        enabled: ['S1DesktopEnabled', 'PathAssistantsEnabled'],
        disabled: ['S1EncryptedStoragePref2']
      }
    };

    return JSON.stringify(scratch, null, 2);
  }

  public packageJSON(): string {
    const pkg = {
      name: this.flags.name,
      version: '0.0.1',
      description: '',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
        build: 'sfdx shane:org:delete; ./orgInit.sh',
        reset: 'echo "sfdx force:apex:execute -f scripts/dataWipe.cls && sfdx force:apex:execute -f scripts/init.cls"'
      },
      nodemonConfig: {
        watch: [
          'force-app'
        ],
        exec: 'sfdx force:source:push',
        ext: 'cls,xml,json,js,trigger,cmp,css,design,svg',
        delay: '2500'
      },
      repository: {
        type: 'git',
        url: `git+${this.flags.gitremote}.git`
      },
      author: 'Shane McLaughlin',
      license: 'ISC',
      bugs: {
        url: `${this.flags.gitremote}/issues`
      },
      homepage: this.flags.gitremote,
      devDependencies: {
        nodemon: '^1.18.3'
      }
    };

    return JSON.stringify(pkg, null, 2);
  }
}
