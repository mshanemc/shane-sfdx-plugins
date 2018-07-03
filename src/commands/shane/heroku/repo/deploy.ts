import chalk from 'chalk';
import { SfdxCommand, core } from '@salesforce/command';
import util = require('util');
import request = require('request-promise-native');
import child_process = require('child_process');

const exec = util.promisify(child_process.exec);

const herokuAPIendpoint = 'https://api.heroku.com/app-setups';

export default class GithubPackageInstall extends SfdxCommand {

  public static description = 'installs a package from github from mdapi src';

  public static examples = [
`sfdx shane:heroku:repo:deploy -g someUser -r someRepo -u
// deploys code from https://github.com/someUser/someRepo that has a valid app.json
`
  ];

  protected static supportsUsername = true;

  protected static flagsConfig = {
    githubuser: {type: 'string', required: true, char: 'g', description: 'github username where the app lives' },
    repo: {type: 'string', required: true, char: 'r', description: 'repo where the app lives' },
    name: {type: 'string', char: 'n', description: 'what do you want to Heroku app to be named' },
    overrides: {char: 'o', description: 'an array of key-value pairs, like SOME_VAR="some Value" (use quotes where string have spaces!)'},
    envuser: { type: 'string', description: 'grab the default scratch org username and set it to this Heroku environment var'},
    envpassword: { type: 'string', description: 'grab the default scratch org password and set it to this Heroku environment var' },
    team: {type: 'string', char: 't', description: 'assign this new app to an existing heroku team'},
    days: {type: 'number', char: 'd', description: 'days you want the heroku app to live (does nothing locally)'}
    // branch: {type: 'string', char: 'b', description: 'optional branch' }
  };

  // protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    interface HerokuAppSetup {
      source_blob: {
        url: string
      };
      app?: {
        name?: string;
        organization?: string;
      };
      overrides?: {
        env?: {

        }
      };
    }

    const body: HerokuAppSetup = {
      source_blob: {
        url: `https://github.com/${this.flags.githubuser}/${this.flags.repo}/tarball/master/`
      },
      app: {},
      overrides: {
        env: {}
      }
    };

    // fs.ensureDirSync(tmpDir);
    if (this.flags.overrides) {
      // console.log(this.flags.overrides);
      for (const override of this.flags.overrides.split(',')) {
        console.log(override);
        body.overrides.env[override.split('=')[0]] = override.split('=')[1];
      }
    }

    if (this.flags.envuser) {
      body.overrides.env[this.flags.envuser] = this.org.getUsername();
    }

    if (this.flags.envpassword) {
      const displayResult = await exec('sfdx force:org:display --json');
      const displayResultJSON = JSON.parse(displayResult.stdout);
      // this.ux.logJson(displayResultJSON);
      body.overrides.env[this.flags.envpassword] = displayResultJSON.result.password;
    }

    // this.ux.logJson(body);

    const headers = {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: `Bearer ${process.env.HEROKU_API_KEY}`
    };

    if (this.flags.name) {
      body.app = {
        name: this.flags.name
      };
    }

    if (this.flags.name) {
      body.app.organization = this.flags.team;
    }

    const result = await request.post({
      url: herokuAPIendpoint,
      headers,
      body,
      json: true
    });

    let status = result.status;
    let statusResult;

    while (status === 'pending') {
      statusResult = await request.get({
        url : `${herokuAPIendpoint}/${result.id}`,
        json: true,
        headers
      });
      status = statusResult.status;
    }

    // if error
    if (status === 'failed') {
      this.ux.log(chalk.red('Error deploying the app'));
      this.ux.logJson(statusResult);
    } else if (status === 'succeeded') {
      this.ux.log(chalk.green(`App deployed, available at ${statusResult.resolved_success_url}. Delete by running heroku destroy -a ${statusResult.app.name} -c ${statusResult.app.name}`));
      // this.ux.logJson(statusResult);
    }

    return result;

  }

}
