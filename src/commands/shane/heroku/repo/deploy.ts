import { flags } from '@oclif/command';
import { join } from 'path';
import chalk from 'chalk';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import util = require('util');
import request = require('request-promise-native');
import child_process = require('child_process');
import { Options } from 'js2xmlparser/lib/options';

const exec = util.promisify(child_process.exec);

const tmpDir = 'githubHerokuTmp';
const herokuAPIendpoint = 'https://api.heroku.com/app-setups';

export default class GithubPackageInstall extends SfdxCommand {

  public static description = 'installs a package from github from mdapi src';

  public static examples = [
`sfdx shane:heroku:repo:deploy -g someUser -r someRepo -u
// deploys code from https://github.com/someUser/someRepo that has a valid app.json
`
  ];

  // protected static requiresUsername = true;

  protected static flagsConfig = {
    githubUser: flags.string({ required: true, char: 'g', description: 'github username where the app lives' }),
    repo: flags.string({ required: true, char: 'r', description: 'repo where the app lives' }),
    name: flags.string({ char: 'n', description: 'what do you want to heroku app to be named' }),
    overrides: {char: 'o', description: 'an array of key-value pairs, like SFDC_USERNAME=someuser@domain.com,SFDC_PASSWORD=5UP3R53CR3T!'}
    // branch: flags.string({ char: 'b', description: 'optional branch' })
  };

  // protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const body = {
      source_blob: {
        url: `https://github.com/${this.flags.githubUser}/${this.flags.repo}/tarball/master/`
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

    console.log(body);

    const headers = {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: `Bearer ${process.env.HEROKU_API_TOKEN}`
    };

    if (this.flags.name) {
      body.app = {
        name: this.flags.name
      };
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
      this.ux.log(chalk.green(`App deployed, available at ${statusResult.resolved_success_url}`));
      this.ux.logJson(statusResult);

    }
    return result;

  }

}
