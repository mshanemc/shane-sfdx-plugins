import { flags, SfdxCommand } from '@salesforce/command';
import * as puppeteer from 'puppeteer';

import { exec2JSON } from '../../../../shared/execProm';

export default class CommunityEnable extends SfdxCommand {
    public static description = 'Activate a community using a headless browser';

    public static aliases = ['shane:communities:analytics:enable'];

    protected static requiresUsername = true;

    protected static deprecated = {
        version: 47,
        message: `This command is no longer needed because your scratch def file can use

"analyticsSettings": {
    "canShareAppsWithCommunities": true,
    "enableAnalyticsSharingEnable": true
}`
    };

    protected static flagsConfig = {
        showbrowser: flags.boolean({ char: 'b', description: 'show the browser...useful for local debugging' })
    };

    public async run(): Promise<any> {
        // this.ux.startSpinner('starting headless browser');

        const browser = await puppeteer.launch({ headless: !this.flags.showbrowser, args: ['--no-sandbox'] });
        const context = browser.defaultBrowserContext();

        // // get the force-org-open url for your scratch org
        const openResult = await exec2JSON('sfdx force:org:open -p /lightning/setup/InsightsSetupSettings/home -r --json');
        const iframeTitle = 'Get Started ~ Salesforce - Developer Edition';

        const { url } = openResult.result;

        await context.overridePermissions(url, ['notifications']);
        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: 'networkidle2'
        });

        const enable = 'input.enableWaveInCommunities';
        await page.waitForSelector(`iframe[title="${iframeTitle}"]`);

        for (const frame of page.frames()) {
            const title = await frame.title();
            if (title === iframeTitle) {
                await frame.waitForSelector('input.enableWaveInCommunities');
                await frame.click(enable);

                // verify that it actually changed value from the click?
                await frame.waitForSelector('input.enableWaveInCommunities:checked');

                await frame.waitForSelector('input[title="Save"]');
                await frame.click('input[title="Save"]');
                // this.ux.log('clicked save');
                await frame.waitFor(500);
                await browser.close();
                // this.ux.stopSpinner('Activated analytics for communities');
                return true;
            }
        }
        await browser.close();
        throw new Error('UI elements not found');
    }
}
