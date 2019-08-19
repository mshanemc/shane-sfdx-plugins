import { flags, SfdxCommand } from '@salesforce/command';
// import chalk from 'chalk';

import * as fs from 'fs-extra';
import * as puppeteer from 'puppeteer';
import request = require('request-promise-native');

import { exec2JSON } from '../../../shared/execProm';

// const herokuAPIendpoint = 'https://api.heroku.com';
const HC_DiscoveryServiceEndpoint = 'https://hc-central.heroku.com';

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
        app: flags.string({ char: 'a', description: 'name of the heroku app', required: true }),
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
        instance: flags.boolean({
            char: 'i',
            description: 'salesforce instance for making login easier.  Will be read from org:display if exists...this is the override'
        }),
        verbose: flags.builtin()
    };

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        if (!process.env.HEROKU_API_KEY) {
            throw new Error(
                'This requires a valid HEROKU_API_KEY in the environment.  heroku auth:token will get you temporary one, or use the heroku web gui to get a permanent one'
            );
        }
        // you didn't set it so we're going to get it from orgDisplay
        if (!this.flags.password) {
            const displayResponse = await exec2JSON(`sfdx force:org:display --json -u ${this.org.getUsername()}`);
            this.flags.password = displayResponse.result.password;
            this.flags.instance = displayResponse.result.instanceUrl.replace('https://', '');
        }

        if (!this.flags.password) {
            throw new Error('There is password set.  Use sfdx force:user:password:generate to make one');
        }

        this.ux.log(`using password ${this.flags.password}`);
        this.ux.log(`using domain ${this.flags.instance}`);

        // get the apps region to use the correct connect api endpoint
        const defaultHerokuRequest = {
            headers: {
                Authorization: `Bearer ${process.env.HEROKU_API_KEY}`
            },
            json: true
        };

        this.ux.log(`getting connections url from ${HC_DiscoveryServiceEndpoint}/auth/${this.flags.app}`);
        const discoveryResult = await request.post({
            ...defaultHerokuRequest,
            url: `${HC_DiscoveryServiceEndpoint}/auth/${this.flags.app}`
        });

        if (!this.flags.json && this.flags.verbose) {
            this.ux.log('this is the discoveryResult');
            this.ux.logJson(discoveryResult);
        }

        const matchingApp = discoveryResult.connections.find(app => app.app_name === this.flags.app && app.resource_name);

        if (!this.flags.json && this.flags.verbose) {
            this.ux.log('this is the matching app');
            this.ux.logJson(matchingApp);
        }

        // const connectAPIendpoint = `${app.region_url}/api/v3`;

        // // verify the app has connect add-on installed
        // const addons = await request.get({ ...defaultHerokuRequest,
        //   url: `${herokuAPIendpoint}/apps/${this.flags.app}/addons`
        // });

        // if ( !this.flags.json && this.flags.verbose) {
        //   this.ux.log('addons: ');
        //   this.ux.logJson(addons);
        // }

        // if (
        //   !addons.some( addon => addon.addon_service.name === 'herokuconnect' ) ||
        //   !addons.some( addon => addon.addon_service.name === 'heroku-postgresql')
        // ) {
        //   throw new Error('the app needs to have both Postgres and Heroku Connect addons already installed');
        // }

        // if ( this.flags.verbose ) {
        //   this.ux.log(`calling endpoint: ${connectAPIendpoint}/users/me/apps/${this.flags.app}/auth`);
        // }
        // const postResult = await request.post({headers: defaultHerokuConnectRequest.headers, url: `${connectAPIendpoint}/users/me/apps/${this.flags.app}/auth`});

        // if ( !this.flags.json && this.flags.verbose) {
        //   this.ux.log('postResult from creating Auth');
        //   this.ux.log(postResult);
        // }

        // const connectionInfo = await request.get({ ...defaultHerokuConnectRequest, url: `${connectAPIendpoint}/connections?app=${this.flags.app}`});

        // if ( !this.flags.json && this.flags.verbose) {
        //   this.ux.log('connectionInfo');
        //   this.ux.logJson(connectionInfo);
        // }

        // const theConnection = connectionInfo.results.find( conn => conn.app_name === this.flags.app );
        // this.ux.log(`found connection with id ${theConnection.id}`);

        const patchResults = await request.patch({
            ...defaultHerokuRequest,
            uri: matchingApp.detail_url,
            body: {
                schema_name: 'salesforce',
                db_key: 'DATABASE_URL'
            }
        });

        if (!this.flags.json && this.flags.verbose) this.ux.logJson(patchResults);

        // let's find out where to authenticate

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

        const browser = await puppeteer.launch({ headless: !this.flags.showbrowser, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(sfdcAuthUrl, {
            waitUntil: 'networkidle2'
        });

        // login page
        await page.waitForSelector('input#username');
        await page.type('input#username', this.org.getUsername());
        await page.type('input#password', this.flags.password);
        await page.click('input#Login');
        await page.waitFor(3000);

        // mostly happens on new scratch orgs, but not if you've previously auth'd it
        try {
            await page.waitForSelector('input#oaapprove');
            await page.click('input#oaapprove');
            await page.waitFor(1000);
        } catch (e) {
            this.ux.log('no connection approval page');
        }

        await browser.close();

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

        this.ux.log(`set up Heroku Connect for ${this.flags.app}`);
        return `set up Heroku Connect for ${this.flags.app}`;
    }
}
