import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import child_process = require('child_process');
import request = require('request-promise-native');
import * as stripcolor from 'strip-color';
import util = require('util');

const exec = util.promisify(child_process.exec);

const herokuAPIendpoint = 'https://api.heroku.com/app-setups';

export default class HerokuRepoDeploy extends SfdxCommand {

  public static description = 'deploy a heroku app that has a valid app.json.  ';

  public static examples = [
`sfdx shane:heroku:repo:deploy -g someUser -r someRepo
// deploys code from https://github.com/someUser/someRepo that has a valid app.json
`
  ];

  protected static supportsUsername = true;

  protected static flagsConfig = {
    githubuser: flags.string({required: true, char: 'g', description: 'github username where the app lives' }),
    repo: flags.string({required: true, char: 'r', description: 'repo where the app lives' }),
    name: flags.string({char: 'n', description: 'what do you want to Heroku app to be named' }),
    overrides: flags.array({char: 'o', description: 'an array of key-value pairs, like SOME_VAR="some Value" (use quotes where string have spaces!)'}),
    envuser: flags.string({description: 'grab the default scratch org username and set it to this Heroku environment var'}),
    envpassword: flags.string({description: 'grab the default scratch org password and set it to this Heroku environment var' }),
    team: flags.string({char: 't', description: 'assign this new app to an existing heroku team'}),
    days: flags.integer({char: 'd', description: 'days you want the heroku app to live (does nothing locally)', min: 1, max: 30, default: 1})
    // branch: flags.string({char: 'b', description: 'optional branch' }
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
      for (const override of this.flags.overrides) {
        console.log(override);
        body.overrides.env[override.split('=')[0]] = override.split('=')[1];
      }
    }

    if (this.flags.envuser) {
      body.overrides.env[this.flags.envuser] = this.org.getUsername();
    }

    if (this.flags.envpassword) {
      const displayResult = await exec('sfdx force:org:display --json');
      const displayResultJSON = JSON.parse(stripcolor(displayResult.stdout));
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
      throw new Error(statusResult);
    } else if (status === 'succeeded') {
      this.ux.log(chalk.green(`App deployed, available at ${statusResult.resolved_success_url}. Delete by running heroku destroy -a ${statusResult.app.name} -c ${statusResult.app.name}`));
      return statusResult;
    }

  }

}
