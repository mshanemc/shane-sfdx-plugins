import { flags, SfdxCommand } from '@salesforce/command';
import child_process = require('child_process');
import * as puppeteer from 'puppeteer';
import * as stripcolor from 'strip-color';
import util = require('util');
import { CommunitiesRestResult } from './../../../shared/typeDefs';

const exec = util.promisify(child_process.exec);

export default class CommunityPublish extends SfdxCommand {

  public static description = 'Publish a community using a headless browser';

  protected static requiresUsername = true;

  protected static flagsConfig = {
    name: flags.string({char: 'n', description: 'name of the community to publish', required: true}),
    showbrowser: flags.boolean({char: 'b', description: 'show the browser...useful for local debugging'})
  };

  public async run(): Promise<any> { // tslint:disable-line:no-any

    // first, get the id of the theme
    const conn = this.org.getConnection();
    const apiVersion = await conn.getApiVersion();

    if (parseFloat(apiVersion) > 45.0 ) {
      const communitiesList = <CommunitiesRestResult> <unknown> await conn.request(`${conn.baseUrl()}/connect/communities/`);
      const foundCommunity = communitiesList.communities.find( comm => comm.name === this.flags.name);
      const publishUrl = `${conn.baseUrl()}/connect/communities/${foundCommunity.id}/publish`;

      this.ux.startSpinner(`publishing community via rest api [${publishUrl}]...`);
      await conn.request({
        method: 'POST',
        url: publishUrl,
        body: '{}'
      });
      this.ux.stopSpinner('done');
      return;
    }

    const sites = await conn.query(`select id from site where masterlabel = '${this.flags.name}' and sitetype = 'ChatterNetworkPicasso'`);
    // tslint:disable-next-line:no-any
    if (sites.totalSize === 0) {
      throw new Error('community not found');
    }

    // tslint:disable-next-line:no-any
    const site: any = sites.records[0];

    this.ux.startSpinner(`found matching community site with id ${site.Id} to publish...starting headless browser`);

    const browser = await puppeteer.launch({ headless: !this.flags.showbrowser, args: ['--no-sandbox'] });
    const context = browser.defaultBrowserContext();

    // // get the force-org-open url for your scratch org
    const openResult = await exec(`sfdx force:org:open -p /sfsites/picasso/core/config/commeditor.jsp?siteId=${site.Id} -r --json`);

    const url = JSON.parse(stripcolor(openResult.stdout)).result.url;

    await context.overridePermissions(url, ['notifications']);
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle2'
    });

    const publishButtonSelector = 'button.cb-SiteActions-publish';

    await page.waitForSelector(publishButtonSelector);
    const publishButton1 = await page.$(publishButtonSelector);
    await publishButton1.click();
    await page.waitFor(1500);

    const publishButton2Selector = 'input[value="Publish"]';

    await page.waitForSelector(publishButton2Selector);
    const publishButton2 = await page.$(publishButton2Selector);
    await publishButton2.click();
    await page.waitFor(1500);

    await browser.close();
    this.ux.stopSpinner(`Published community: ${this.flags.name}`);

  }

}
