/* eslint-disable no-restricted-syntax */
import { flags, SfdxCommand } from '@salesforce/command';
import * as puppeteer from 'puppeteer';

import { exec2JSON } from '../../../shared/execProm';

import fs = require('fs-extra');

export default class ConnectedAppAttributes extends SfdxCommand {
    public static description =
        'Set attributes on a connected app.  Attributes for salesforce mobile app at https://github.com/gabesumner/mobile-security/blob/master/customAttributes.json';

    protected static requiresUsername = true;

    public static examples = ['sfdx shane:connectedapp:attributes -n AppAPIName -a attributes.json'];

    protected static flagsConfig = {
        name: flags.string({ char: 'n', description: 'name of the connected app', required: true }),
        showbrowser: flags.boolean({ char: 'b', description: 'show the browser...useful for local debugging' }),
        attributes: flags.filepath({ required: true, char: 'a', description: 'json formatted file of key/values' })
    };

    public async run(): Promise<any> {
        if (!fs.existsSync(this.flags.attributes)) {
            throw new Error('attributes file not found');
        }
        const inputFromFile = await fs.readJSON(this.flags.attributes);

        this.ux.startSpinner('starting headless browser');

        const browser = await puppeteer.launch({
            headless: !this.flags.showbrowser,
            args: ['--no-sandbox', '--disable-features=site-per-process']
        });
        const context = browser.defaultBrowserContext();

        const urlResponse = await exec2JSON(`sfdx force:org:open -p /lightning/setup/ConnectedApplication/home -r --json`);
        const { url } = urlResponse.result;
        const iframeTitle = 'Connected Apps ~ Salesforce - Developer Edition';
        await context.overridePermissions(url, ['notifications']);

        // const iframeSelector = `iframe[title="${iframeTitle}"]`;
        // const appLink = `a[title*="Workspaces"][title*="${this.flags.name}"]`;
        // await context.overridePermissions(url, ['notifications']);
        const page = await browser.newPage();

        this.ux.setSpinnerStatus('on connected apps page');

        await page.goto(url, {
            waitUntil: 'networkidle2'
        });

        await page.waitForSelector(`iframe[title="${iframeTitle}"]`);
        // <a href="javascript:srcUp(%27%2F_ui%2Fcore%2Fapplication%2Fforce%2Fconnectedapp%2FForceConnectedApplicationPage%2Fd%3FapplicationId%3D06P8A0000004Yo8%26isdtp%3Dp1%27);">
        //     Salesforce for iOS
        // </a>;

        for (const frame of page.frames()) {
            const title = await frame.title();
            if (title === iframeTitle) {
                await frame.waitFor(3000);

                const matchedApp = await frame.$x(`//a[text()='${this.flags.name}']`);
                if (matchedApp.length === 0) {
                    throw new Error(`no app named ${this.flags.name} found`);
                }

                // console.log(matchedApp[0]);
                await matchedApp[0].click();
                break;
            }
        }

        this.ux.setSpinnerStatus(`on page for ${this.flags.name}`);

        const iframeTitle2 = `Connected App: ${this.flags.name} ~ Salesforce - Developer Edition`;
        const buttonSelector = 'input[title="New Custom Attributes"]';

        const inputIframeTitle = 'Create Custom Attribute ~ Salesforce - Developer Edition';

        for (const [key, value] of Object.entries(inputFromFile)) {
            this.ux.setSpinnerStatus(`adding new attribute`);

            await page.waitForSelector(`iframe[title="${iframeTitle2}"]`);
            for (const frame of page.frames()) {
                const title = await frame.title();
                if (title === iframeTitle2) {
                    // console.log('matches title2');
                    await frame.waitForSelector(buttonSelector);
                    await frame.click(buttonSelector);
                    break;
                }
            }
            this.ux.setSpinnerStatus(`setting ${key} to ${`"${JSON.stringify(value).replace(/"/g, '\\"')}"`}`);

            // we are now on the attribute form
            await page.waitForSelector(`iframe[title="${inputIframeTitle}"]`);
            for (const frame of page.frames()) {
                const title = await frame.title();
                // console.log(title);
                if (title === inputIframeTitle) {
                    // console.log('matches inputIframeTitle');
                    // console.log(`key is ${key}`);
                    await frame.waitForSelector(`input#key`);
                    await frame.waitForSelector('textarea#value');

                    await frame.click('input#key');
                    await frame.type('input#key', key);

                    await frame.click('textarea#value');
                    await frame.type('textarea#value', `"${JSON.stringify(value).replace(/"/g, '\\"')}"`);

                    await frame.click('input[name="save"]');
                    break;
                }
            }
            this.ux.setSpinnerStatus(`saved`);
        }

        // at this point, we're on the custom app page
        // read in the key/value pairs from the file
        // click the new attribute button

        // await page.click('input[title="New Custom Attributes"]');

        // const activateButtonSelector = 'button[data-nextstatus="Live"]';

        // await page.waitForSelector(activateButtonSelector);
        // const activateButton = await page.$(activateButtonSelector);
        // await activateButton.click();

        await browser.close();
        this.ux.stopSpinner(`Connected app updated: ${this.flags.name}`);
        return true;
    }
}
