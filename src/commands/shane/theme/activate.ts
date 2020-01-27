import { flags, SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');
import * as puppeteer from 'puppeteer';

import { exec2JSON } from './../../../shared/execProm';
import { QueryResult } from './../../../shared/typeDefs';
import { writeJSONasXML } from '../../../shared/JSONXMLtools';

export default class ThemeActivate extends SfdxCommand {
    public static description =
        'Activate a LightningExperienceTheme via Puppeteer/Chromium headless.  Recommended: use shane:org:reauth -r to make darn sure that the domain is ready to open something';

    protected static requiresUsername = true;

    protected static flagsConfig = {
        name: flags.string({ char: 'n', required: true, description: 'name of the theme to activate' }),
        showbrowser: flags.boolean({ char: 'b', description: 'show the browser...useful for local debugging' })
    };

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        // first, get the id of the theme
        const conn = this.org.getConnection();
        const orgApiVersion = Number(await this.org.retrieveMaxApiVersion());
        // this.ux.log(`api version is ${orgApiVersion}`);

        // open up the dropdown menu to populate the Activate link
        if (orgApiVersion >= 48) {
            // create a local metadata settings file in a tempDir
            this.ux.startSpinner('creating local file');
            const tempDir = 'themeActivationTempFolder';
            await fs.ensureDir(`${tempDir}/main/default/settings`);

            const metaJSON = {
                '@': {
                    xmlns: 'http://soap.sforce.com/2006/04/metadata'
                },
                activeThemeName: this.flags.name
            };

            await writeJSONasXML({
                path: `${tempDir}/main/default/settings/LightningExperience.settings-meta.xml`,
                json: metaJSON,
                type: 'LightningExperienceSettings'
            });

            this.ux.setSpinnerStatus('pushing to org');
            // deploy that to the org
            const deployResults = await exec2JSON(`sfdx force:source:deploy -p ${tempDir} --json`);

            // clean up local fs
            if (deployResults.status === 0) {
                this.ux.stopSpinner('theme activated in org');
            } else if (!this.flags.json) {
                this.ux.logJson(deployResults);
            }
            await fs.remove(tempDir);
            return deployResults;
        }

        if (orgApiVersion === 47) {
            const results = <QueryResult>(
                await conn.query(
                    `select id from LightningExperienceTheme where DeveloperName = '${this.flags.name}' or MasterLabel = '${this.flags.name}'`
                )
            );

            if (results.records.length > 1) {
                throw new Error('There are more than 1 matching records');
            } else if (results.records.length === 0) {
                throw new Error('No records found');
            }

            const themeId = results.records[0].Id;
            this.ux.startSpinner(`found matching theme with Id ${themeId}...starting headless browser`);

            const browser = await puppeteer.launch({ headless: !this.flags.showbrowser, args: ['--no-sandbox'] });
            const context = browser.defaultBrowserContext();

            // get the force-org-open url for your scratch org
            const openResponse = await exec2JSON('sfdx force:org:open -p /lightning/setup/ThemingAndBranding/home -r --json');
            const url = openResponse.result.url;

            await context.overridePermissions(url, ['notifications']);
            const page = await browser.newPage();

            await page.goto(url, {
                waitUntil: 'networkidle2'
            });
            await page.waitForSelector(`tr[data-row-key-value='${themeId}']`, { visible: true });
            await page.evaluate(localThemeId => {
                const slot: HTMLSlotElement = document
                    .querySelector(`lightning-datatable`)
                    .shadowRoot.querySelector(`tr[data-row-key-value='${localThemeId}'] td:last-of-type lightning-primitive-cell-factory`)
                    .shadowRoot.querySelector('lightning-primitive-cell-wrapper')
                    .shadowRoot.querySelector('div slot');

                const middle: HTMLElement = slot.assignedNodes()[0] as HTMLElement;

                const buttonMenu: HTMLElement = middle.shadowRoot
                    .querySelector('lightning-primitive-cell-actions')
                    .shadowRoot.querySelector('lightning-button-menu');
                return buttonMenu.click();
            }, themeId);

            await page.evaluate(localThemeId => {
                const slot: HTMLSlotElement = document
                    .querySelector(`lightning-datatable`)
                    .shadowRoot.querySelector(`tr[data-row-key-value='${localThemeId}'] td:last-of-type lightning-primitive-cell-factory`)
                    .shadowRoot.querySelector('lightning-primitive-cell-wrapper')
                    .shadowRoot.querySelector('div slot');

                const middle: HTMLElement = slot.assignedNodes()[0] as HTMLElement;

                const buttonMenu: HTMLSlotElement = middle.shadowRoot
                    .querySelector('lightning-primitive-cell-actions')
                    .shadowRoot.querySelector('lightning-button-menu')
                    .shadowRoot.querySelector(`div[role='menu'] slot`);

                const menuItem: HTMLElement = buttonMenu.assignedNodes()[4] as HTMLElement;
                const link = menuItem.shadowRoot.querySelector('a');
                console.log(link);
                link.click();
            }, themeId);
            await browser.close();
            this.ux.stopSpinner(`Activated theme ${this.flags.name}`);

            return true;
        }
    }
}
