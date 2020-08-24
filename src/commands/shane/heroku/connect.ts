import { flags, SfdxCommand } from '@salesforce/command';
// import chalk from 'chalk';

import * as fs from 'fs-extra';
import * as puppeteer from 'puppeteer';
import { retry } from '@lifeomic/attempt';

import { checkHerokuEnvironmentVariables } from '../../../shared/herokuCheck';
import { getMatchingApp, patchApp, defaultHerokuRequest } from '../../../shared/herokuConnectApi';

import { exec2JSON } from '../../../shared/execProm';
import { herokuAppNameValidator } from '../../../shared/flagParsing';

import request = require('request-promise-native');

export default class HerokuConnect extends SfdxCommand {
    public static description = 'set up heroku connect on an existing app to an existing org (that you may have just created)';

    public static examples = [
        `sfdx shane:heroku:connect -a prosaic-samurai-4564 -f assets/myConfig.json
// auth the heroku app to the current default org, assuming password is available from force:org:display, then import the json config file
`,
        `sfdx shane:heroku:connect -a prosaic-samurai-4564 -f assets/myConfig.json -p p455w0rd -u myother@scratch.org
// same, but not the default org, with a specified password
`
    ];

    protected static supportsUsername = true;

    protected static flagsConfig = {
        app: flags.string({
            char: 'a',
            description: 'name of the heroku app',
            required: true,
            parse: input => herokuAppNameValidator(input)
        }),
        environment: flags.string({
            char: 'e',
            description: 'environment of the salesforce org',
            options: ['sandbox', 'production', 'custom'],
            default: 'custom'
        }),
        password: flags.string({
            char: 'p',
            description:
                "pass in a password to override the one associated with your org in sfdx, or if you don't have one set properly (like you used `shane:user:password:set` instead of `force:user:password:generate"
        }),
        configfile: flags.filepath({ char: 'f', description: 'path to the json file exported from Heroku Connect', required: true }),
        showbrowser: flags.boolean({ char: 'b', description: 'show the browser...useful for local debugging' }),
        instance: flags.string({
            char: 'i',
            description: 'salesforce instance for making login easier.  Will be read from org:display if exists...this is the override'
        }),
        verbose: flags.builtin()
    };

    public async run(): Promise<any> {
        checkHerokuEnvironmentVariables();
        const logVerbosely = !this.flags.json && this.flags.verbose;

        // you didn't set it so we're going to get it from orgDisplay
        if (!this.flags.password) {
            const displayResponse = await exec2JSON(`sfdx force:org:display --json -u ${this.org.getUsername()}`);
            this.flags.password = displayResponse.result.password;
            this.flags.instance = this.flags.instance ?? displayResponse.result.instanceUrl.replace('https://', '').replace('.com/', '.com');
            // this.flags.instance = displayResponse.result.instanceUrl;
        }

        if (!this.flags.password) {
            throw new Error('There is no password set.  Use sfdx force:user:password:generate to make one');
        }

        this.ux.log(`using password ${this.flags.password} on domain ${this.flags.instance}`);

        const matchingApp = await getMatchingApp(this.flags.app, logVerbosely);
        await patchApp(matchingApp, logVerbosely);

        // let's find out where to authenticate
        this.ux.setSpinnerStatus('getting the auth url');

        const sfdcAuthUrlResp = await request.post({
            ...defaultHerokuRequest,
            url: `${matchingApp.detail_url}/authorize_url`,
            body: {
                environment: this.flags.environment,
                domain: this.flags.instance
            }
        });

        if (!this.flags.json && this.flags.verbose) this.ux.logJson(sfdcAuthUrlResp);
        const sfdcAuthUrl = sfdcAuthUrlResp.redirect;

        this.ux.setSpinnerStatus('authorizing heroku via browser');

        const browser = await puppeteer.launch({
            headless: !this.flags.showbrowser,
            args: ['--no-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
        });
        const page = await browser.newPage();
        await page.goto(sfdcAuthUrl, {
            waitUntil: 'networkidle2'
        });

        // heroku login page
        await page.waitForSelector('input#email');
        await page.type('input#email', process.env.HEROKU_USERNAME);
        await page.type('input#password', process.env.HEROKU_PASSWORD);
        await page.click('button');
        await page.waitFor(3000);

        // while (await page.$(selector))
        await retry(
            async () => {
                this.ux.setSpinnerStatus('authorizing the org via browser');
                // salesforce org login page
                await page.waitForSelector('input#username');
                await page.type('input#username', this.org.getUsername());
                await page.type('input#password', this.flags.password);
                await page.click('input#Login');
                await page.waitFor(3000);

                if (await page.$('input#username')) {
                    this.ux.setSpinnerStatus('auth to the org failed.  Login might not be read.  Waiting one minute before retrying');
                    throw new Error('auth failed');
                }
            },
            {
                maxAttempts: 10,
                delay: 60 * 1000
            }
        );

        // mostly happens on new scratch orgs, but not if you've previously auth'd it
        try {
            await page.waitForSelector('input#oaapprove');
            await page.click('input#oaapprove');
            await page.waitFor(1000);
        } catch (error) {
            this.ux.log('no connection approval page');
        }

        await browser.close();

        this.ux.setSpinnerStatus('applying the heroku connect config file');

        const fileResult = await request.post({
            headers: {
                Authorization: `Bearer ${process.env.HEROKU_API_KEY}`
            },
            url: `${matchingApp.detail_url}/actions/import`,
            body: await fs.readJSON(this.flags.configfile),
            json: true
        });

        if (fileResult !== undefined) {
            this.ux.error(fileResult);
            throw new Error(`file upload error: ${fileResult}`);
        }
        this.ux.stopSpinner(`set up Heroku Connect for ${this.flags.app}`);

        return `set up Heroku Connect for ${this.flags.app}`;
    }
}
