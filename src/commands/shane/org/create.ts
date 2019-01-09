import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import * as child_process from 'child_process';
import request = require('request-promise-native');
import util = require('util');

const exec = util.promisify(child_process.exec);

const usernameURL = 'https://unique-username-generator.herokuapp.com/unique';

export default class CreateOrg extends SfdxCommand {
  public static description =
    'create an org with a friendly username.  wraps force:org:create';

  public static examples = [
    `sfdx shane:org:create --userprefix shane -o org.test
// creates an org from the default project config/project-scratch-def.json but with username shane[i]@org.test where i is a unique sequence number for that -u/-o combination
`,
    `sfdx shane:org:create --userprefix shane -o org.test -a sydneyBristow -d 30 -v myOtherHub -f config/thatOtherFile.json
// above, but with an alias, a longer duration, and not the default hub, and not the default config file
`
  ];

  protected static flagsConfig = {
    userprefix: flags.string({
      required: true,
      description:
        'first part of the generated username.  Example: \'shane\' produces shane1@demo.org, shane2@demo.org'
    }),
    userdomain: flags.string({
      char: 'o',
      required: true,
      description:
        'last part of the generated username (after the @ sign).  Example: \'demo.org\' produces shane1@demo.org, shane2@demo.org'
    }),
    clientid: flags.string({
      char: 'i',
      description: 'connected app consumer key'
    }),
    definitionfile: flags.filepath({
      char: 'f',
      default: 'config/project-scratch-def.json',
      description:
        'path to a scratch org definition file.  Default = config/project-scratch-def.json'
    }),
    setalias: flags.string({
      char: 'a',
      description: 'set an alias for for the created scratch org'
    }),
    durationdays: flags.integer({
      char: 'd',
      default: 7,
      min: 1,
      max: 30,
      description:
        'duration of the scratch org (in days) (default:7, min:1, max:30)'
    }),
    wait: flags.integer({
      description:
        'the streaming client socket timeout (in minutes) (default:20, min:2)',
      default: 20,
      min: 2
    }),
    noancestors: flags.boolean({
      char: 'c',
      description:
        'do not include second-generation package ancestors in the scratch org'
    }),
    nonamespace: flags.boolean({
      char: 'n',
      description: 'creates the scratch org with no namespace'
    }),
    setdefaultusername: flags.boolean({
      char: 's',
      description: 'set the created org as the default username'
    })
    // targetdevhubusername: flags.boolean({description: 'username or alias for the dev hub org; overrides default dev hub org' })
  };

  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    // gets the unique username
    const usernameResult = await request.post({
      uri: usernameURL,
      body: {
        prefix: this.flags.userprefix,
        domain: this.flags.userdomain
      },
      json: true
    });

    // required flags
    let command = `sfdx force:org:create --json -f ${
      this.flags.definitionfile
    } -d ${this.flags.durationdays} -w ${this.flags.wait || 20}`;

    // optional value 	flags without defaults
    if (this.flags.clientid) {
      command = command + ` -i ${this.flags.clientid}`;
    }

    if (this.flags.targetdevhubusername) {
      command = command + ` -v ${this.flags.targetdevhubusername}`;
    }

    if (this.flags.setalias) {
      command = command + ` -a ${this.flags.setalias}`;
    }

    // optional boolean
    if (this.flags.noancestors) {
      command = command + ' -c';
    }

    if (this.flags.nonamespace) {
      command = command + ' -n';
    }

    if (this.flags.setdefaultusername) {
      command = command + ' -s';
    }

    if (this.flags.setdefaultusername) {
      command = command + ` username=${usernameResult.message}`;
    }
    this.ux.log(`executing ${command}`);

    const response = await exec(command);
    if (response.stdout) {
      const success = JSON.parse(response.stdout);
      if (success.status === 0) {
        this.ux.log(
          chalk.green(
            `Org created with id ${success.result.orgId} and username ${
              success.result.username
            } `
          )
        );
      } else {
        this.ux.log(chalk.red(response.stderr));
      }
      return success.result;
    } else {
      return JSON.parse(response.stdout);
    }
  }
}
