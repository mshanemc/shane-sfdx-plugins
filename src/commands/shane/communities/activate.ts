import { flags, SfdxCommand } from '@salesforce/command';
import child_process = require('child_process');
import * as puppeteer from 'puppeteer';
import * as stripcolor from 'strip-color';
import util = require('util');
// import { Record } from './../../../shared/typeDefs';

const exec = util.promisify(child_process.exec);

export default class CommunityActivate extends SfdxCommand {

  public static description = 'Activate a community using a headless browser';

  protected static requiresUsername = true;

  protected static flagsConfig = {
    name: flags.string({char: 'n', description: 'name of the community to activate', required: true}),
    showbrowser: flags.boolean({char: 'b', description: 'show the browser...useful for local debugging'})
  };

  public async run(): Promise<any> { // tslint:disable-line:no-any

    this.ux.startSpinner('starting headless browser');

    const browser = await puppeteer.launch({ headless: !this.flags.showbrowser, args: ['--no-sandbox'] });
    const context = browser.defaultBrowserContext();

    // // get the force-org-open url for your scratch org
    const openResult = await exec(`sfdx force:org:open -p /${this.flags.name}/communitySetup/cwApp.app#/c/page/settings -r --json`);

    const url = JSON.parse(stripcolor(openResult.stdout)).result.url;

    await context.overridePermissions(url, ['notifications']);
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle2'
    });

    const activateButtonSelector = 'button[data-nextstatus="Live"]';

    await page.waitForSelector(activateButtonSelector);
    const activateButton = await page.$(activateButtonSelector);
    await activateButton.click();

    await browser.close();
    this.ux.stopSpinner(`Published community: ${this.flags.name}`);
    return true;
  }

}
