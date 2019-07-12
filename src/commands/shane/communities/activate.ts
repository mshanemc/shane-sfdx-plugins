import { flags, SfdxCommand } from '@salesforce/command';
import * as puppeteer from 'puppeteer';
import * as stripcolor from 'strip-color';

import { exec } from '../../../shared/execProm';

export default class CommunityActivate extends SfdxCommand {
    public static description = 'Activate a community using a headless browser';

    protected static requiresUsername = true;

    protected static flagsConfig = {
        name: flags.string({ char: 'n', description: 'name of the community to activate', required: true }),
        showbrowser: flags.boolean({ char: 'b', description: 'show the browser...useful for local debugging' })
    };

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        this.ux.startSpinner('starting headless browser');

        const browser = await puppeteer.launch({ headless: !this.flags.showbrowser, args: ['--no-sandbox'] });
        // const context = browser.defaultBrowserContext();

        // // get the force-org-open url for your scratch org
        // const openResult = await exec(`sfdx force:org:open -p /${this.flags.name}/communitySetup/cwApp.app#/c/page/settings -r --json`);
        const openResult = await exec('sfdx force:org:open -p /lightning/setup/SetupNetworks/home -r --json');
        const url = JSON.parse(stripcolor(openResult.stdout)).result.url;
        const iframeTitle = 'Communities ~ Salesforce - Developer Edition';
        const workspacesLink = `a[title*="Workspaces"][title*="${this.flags.name}"]`;
        // await context.overridePermissions(url, ['notifications']);
        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: 'networkidle2'
        });

        await page.waitForSelector(`iframe[title="${iframeTitle}"]`);
        // <a href="/servlet/networks/switch?networkId=0DBZ00000004eq5&amp;startURL=%2FcommunitySetup%2FcwApp.app%23%2Fc%2Fhome&amp;" class="networkManageLink zen-mhs actionLink" data-networkid="0DBZ00000004eq5" data-networkurl="/servlet/networks/switch?networkId=0DBZ00000004eq5&amp;startURL=%2FcommunitySetup%2FcwApp.app%23%2Fc%2Fhome" target="_blank" title="Workspaces - Record 2 - dealers">Workspaces</a>
        for (const frame of page.frames()) {
            const title = await frame.title();
            if (title === iframeTitle) {
                await frame.waitForSelector(workspacesLink);

                const [newtab] = await Promise.all([
                    new Promise<puppeteer.Page>(resolve => page.once('popup', resolve)),
                    frame.click(workspacesLink)
                ]);

                await newtab.waitForSelector('a.js-workspace-administration');
                await newtab.click('a.js-workspace-administration');

                // it's in another stupid iframe!!
                const activateIframeTitle = `Settings ~ ${this.flags.name}`;
                const activateIframeTitleSelector = `iframe[title="${activateIframeTitle}"]`;

                newtab.on('dialog', async dialog => {
                    await newtab.waitFor(1500);
                    await dialog.accept();
                    await newtab.waitFor(1500);
                    await browser.close();
                    this.ux.stopSpinner('Activated community');
                    return true;
                });

                await newtab.waitForSelector(activateIframeTitleSelector);
                for (const innerFrame of newtab.frames()) {
                    const innerTitle = await innerFrame.title();
                    if (innerTitle === activateIframeTitle) {
                        await innerFrame.waitForSelector('input[value="Activate Community"]');
                        await innerFrame.click('input[value="Activate Community"]');
                    }
                }

                // <a class="js-workspace-administration slds-text-link--reset slds-m-bottom--small slds-text-align--center slds-box--border js-workspace-tile communitySetupCmcWorkspaceTile" href="javascript:void(0);" data-aura-rendered-by="58:119;a" data-aura-class="communitySetupCmcWorkspaceTile"><div class="slds-m-top--large" data-aura-rendered-by="59:119;a"><lightning-icon class="slds-shrink-none administration slds-icon-standard-custom slds-icon_container" data-data-rendering-service-uid="131" data-aura-rendered-by="61:119;a"><lightning-primitive-icon lightning-primitiveicon_primitiveicon-host=""><svg lightning-primitiveIcon_primitiveIcon="" focusable="false" data-key="custom" aria-hidden="true" class="slds-icon slds-icon_large"><use lightning-primitiveIcon_primitiveIcon="" xlink:href="/externalid/_slds/icons/standard-sprite/svg/symbols.svg?cache=9.24.0#custom"></use></svg></lightning-primitive-icon></lightning-icon></div><div class="slds-text-heading--small slds-m-top--small js-tile-label" data-aura-rendered-by="62:119;a"><strong data-aura-rendered-by="63:119;a">Administration</strong></div><div class="slds-text-body--regular slds-text-color--weak slds-m-top--small slds-m-horizontal--small js-tile-description" data-aura-rendered-by="65:119;a">Configure settings and properties for your community.</div></a>
                // // verify that it actually changed value from the click?
                // await frame.waitForSelector('input.enableWaveInCommunities:checked');

                // await frame.waitForSelector('input[title="Save"]');
                // await frame.click('input[title="Save"]');
                // // this.ux.log('clicked save');
                // await frame.waitFor(500);
                // await browser.close();
                // return true;
            }
        }

        // const activateButtonSelector = 'button[data-nextstatus="Live"]';

        // await page.waitForSelector(activateButtonSelector);
        // const activateButton = await page.$(activateButtonSelector);
        // await activateButton.click();

        // await browser.close();
        // this.ux.stopSpinner(`Published community: ${this.flags.name}`);
        // return true;
    }
}
