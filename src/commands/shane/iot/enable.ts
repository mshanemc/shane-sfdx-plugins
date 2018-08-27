/* tslint:disable no-var-requires */
import { SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import child_process = require('child_process');
import Nightmare = require('nightmare');
import request = require('request-promise-native');
import util = require('util');

const exec = util.promisify(child_process.exec);
const waitTimeOut = 1000 * 5;

export default class Enable extends SfdxCommand {

  public static description = 'enable IoT in setup';

  public static examples = [
    `sfdx shane:iot:enable
// enable IoT
`
  ];

  protected static flagsConfig = {
    insights: { type: 'boolean', char: 'i', description: 'also enable IoT insights while you\'re a it' },
    show: { type: 'boolean', char: 's', description: 'actually show thr browser doing the work' }
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const openOutput = await exec(`sfdx force:org:open -u ${this.org.getUsername()} -r -p /lightning/setup/IoTGettingStarted/home --json`);
    const url = JSON.parse(openOutput.stdout).result.url;
    this.ux.log(url);

    const nightmare = new Nightmare({ show: this.flags.show || false, waitTimeOut });
    this.ux.startSpinner('opening Salesforce setup');
    await nightmare.goto(url);
    await nightmare.wait('#iotPrefEnable');
    this.ux.stopSpinner('page ready!');

    this.ux.startSpinner('enabling insights');
    await nightmare.click('#iotPrefEnable');
    this.ux.stopSpinner(chalk.green('IoT enabled!'));

    if (this.flags.insights) {
      await nightmare.wait(2000);
      this.ux.startSpinner('enabling insights');
      await nightmare.click('#iotCRMEnable');
      this.ux.stopSpinner(chalk.green('Insights enabled!'));
    }
  }
}
