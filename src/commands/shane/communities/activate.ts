/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { flags, SfdxCommand } from '@salesforce/command';
import * as puppeteer from 'puppeteer';

import { exec2JSON } from '../../../shared/execProm';

export default class CommunityActivate extends SfdxCommand {
    public static description = 'Activate a community using a headless browser';

    protected static requiresUsername = true;

    protected static flagsConfig = {
        name: flags.string({ char: 'n', description: 'name of the community to activate', required: true }),
        showbrowser: flags.boolean({ char: 'b', description: 'show the browser...useful for local debugging' })
    };

    public async run(): Promise<any> {
        this.ux.startSpinner('starting headless browser');

        const browser = await puppeteer.launch({
            headless: !this.flags.showbrowser,
            args: ['--no-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
        });
        // const context = browser.defaultBrowserContext();

        // // get the force-org-open url for your scratch org
        // const openResult = await exec(`sfdx force:org:open -p /${this.flags.name}/communitySetup/cwApp.app#/c/page/settings -r --json`);
        const openResponse = await exec2JSON('sfdx force:org:open -p /lightning/setup/SetupNetworks/home -r --json');
        const { url } = openResponse.result;
        const iframeTitle = 'Communities ~ Salesforce - Developer Edition';
        const workspacesLink = `a[title*="Workspaces"][title*="${this.flags.name}"]`;
        // await context.overridePermissions(url, ['notifications']);
        const page = await browser.newPage();
        this.ux.setSpinnerStatus(`opening ${url}`);
        await page.goto(url, {
            waitUntil: 'networkidle2'
        });
        await page.waitFor(1500);
        this.ux.setSpinnerStatus(`waiting for selector iframe[title="${iframeTitle}"]`);
        await page.waitForSelector(`iframe[title="${iframeTitle}"]`, { timeout: 20000 });
        this.ux.stopSpinner('communities list loaded');
        // this.ux.log(page.frames().toString());
        this.ux.startSpinner(`iterating ${page.frames().length} frames on the page to find the workspace`);
        for (const frame of page.frames()) {
            const title = await frame.title();
            // this.ux.log(`in frame ${title}`);
            if (title === iframeTitle) {
                this.ux.setSpinnerStatus(`in matching frame, waiting for ${workspacesLink}`);

                await frame.waitForSelector(workspacesLink);

                const [newtab] = await Promise.all([
                    new Promise<puppeteer.Page>(resolve => page.once('popup', resolve)),
                    frame.click(workspacesLink)
                ]);
                this.ux.setSpinnerStatus(`opened popup, waiting for administration page`);

                await newtab.waitForSelector('a.js-workspace-administration');
                await newtab.click('a.js-workspace-administration');
                await newtab.waitFor(1500);

                this.ux.setSpinnerStatus('administration page loaded.  Waiting for iFrames');
                // it's in another stupid iframe!!
                const activateIframeTitle = `Settings ~ ${this.flags.name}`;
                const activateIframeTitleSelector = `iframe[title="${activateIframeTitle}"]`;

                newtab.on('dialog', async dialog => {
                    this.ux.setSpinnerStatus('confirming activation');
                    await newtab.waitFor(1500);
                    await dialog.accept();
                    await newtab.waitFor(1500);
                    if (!this.flags.showbrowser) {
                        await browser.close();
                        this.ux.stopSpinner('Activated community');
                    }
                    return true;
                });

                await newtab.waitForSelector(activateIframeTitleSelector);
                this.ux.setSpinnerStatus('finding matching iframe for activation');

                for (const innerFrame of newtab.frames()) {
                    const innerTitle = await innerFrame.title();
                    if (innerTitle === activateIframeTitle) {
                        this.ux.setSpinnerStatus('activation button found.  Clicking it');

                        await innerFrame.waitForSelector('input[value="Activate Community"]');
                        await innerFrame.click('input[value="Activate Community"]');
                        break;
                    }
                }
            }
        }
    }
}
