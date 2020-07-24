import { flags, SfdxCommand } from '@salesforce/command';

import * as fs from 'fs-extra';
import * as puppeteer from 'puppeteer';
// import { retry } from '@lifeomic/attempt';

import { getMatchingApp, patchApp, defaultHerokuRequest, credentialParser } from '../../../shared/herokuConnectApi';
import { checkHerokuEnvironmentVariables } from '../../../shared/herokuCheck';
import { writeJSONasXML } from '../../../shared/JSONXMLtools';
import { getExisting } from '../../../shared/getExisting';

// import { exec2JSON } from '../../../shared/execProm';

import request = require('request-promise-native');

const metadataTypeName = 'ExternalDataSource';

export default class HerokuExternalObjects extends SfdxCommand {
    public static description = 'set up heroku connect on an existing app with external objects';

    public static examples = [];

    protected static supportsUsername = true;

    protected static flagsConfig = {
        app: flags.string({ char: 'a', description: 'name of the heroku app', required: true }),
        tables: flags.array({
            char: 't',
            description: 'comma separated list of postgres table names to share.  If omitted, you want them all!'
        }),
        createdir: flags.directory({
            char: 'c',
            description: 'creates an external data source in the chosen directory',
            exclusive: ['updatefile']
        }),
        updatefile: flags.filepath({
            char: 'f',
            description: 'updates an existing external data source with username/password/url',
            exclusive: ['createdir'],
            default: 'force-app/main/default/dataSources'
        }),
        label: flags.string({
            char: 'c',
            description: 'label that will appear for the external data source you create',
            exclusive: ['updatefile']
        }),
        showbrowser: flags.boolean({ char: 'b', description: 'show the browser...useful for local debugging' }),
        verbose: flags.builtin()
    };

    public async run(): Promise<any> {
        // validations
        checkHerokuEnvironmentVariables();
        if (this.flags.createdir && !(await fs.pathExists(this.flags.createdir))) {
            throw new Error(`path not found ${this.flags.createdir}`);
        }
        if (this.flags.updatefile && !fs.existsSync(this.flags.updatefile)) {
            throw new Error(`file not found ${this.flags.updatefile}`);
        }
        const logVerbosely = !this.flags.json && this.flags.verbose;

        // actual API work
        const matchingApp = await getMatchingApp(this.flags.app, logVerbosely);

        await patchApp(matchingApp, logVerbosely);

        this.ux.setSpinnerStatus('logging into heroku');

        const browser = await puppeteer.launch({ headless: !this.flags.showbrowser, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(`https://connect.heroku.com/sync/${matchingApp.id}/external`, {
            waitUntil: 'networkidle2'
        });

        // heroku login page pops up instead
        await page.waitForSelector('input#email');
        await page.type('input#email', process.env.HEROKU_USERNAME);
        await page.type('input#password', process.env.HEROKU_PASSWORD);
        await page.click('button');
        await page.waitFor(3000);

        // actual XO page
        this.ux.setSpinnerStatus('creating credentials');

        const createCredentialsSelector = '.btn.btn-default';
        await page.waitForSelector(createCredentialsSelector);
        await page.click(createCredentialsSelector);

        this.ux.setSpinnerStatus('getting odata url from API');
        // calculate the odata url
        const matchingAppDetails = await request.get({
            ...defaultHerokuRequest,
            uri: matchingApp.detail_url
        });

        this.ux.setSpinnerStatus('getting the credentials');
        // show the credentials
        const showCredentialsSelector = 'div.hc-external-objects > div > p:nth-child(3) > button:nth-child(1)';
        await page.waitFor(showCredentialsSelector);
        await page.click(showCredentialsSelector);

        const odataUrl = `${matchingApp.region_url}/odata/v4/${matchingAppDetails.odata.slug}`;
        this.ux.log(`odata url: ${odataUrl}`);

        const credentialsSelector = 'div.hc-external-objects > div > p:nth-child(4)';
        await page.waitForSelector(credentialsSelector);

        const credentialsBlock = await page.$eval(credentialsSelector, el => el.textContent);
        const finalOutput = {
            ...credentialParser(credentialsBlock),
            endpoint: odataUrl
        };

        this.ux.setSpinnerStatus('setting the tables');
        const dataSourceTableSelector = '#sync-content-inner > div > div.hc-external-objects > div > table:nth-child(10) > tbody > tr';
        await page.waitForSelector(dataSourceTableSelector);
        const tableBodyRows = await page.$$(dataSourceTableSelector);
        // iterate each row.  If the name column matches the tables flag OR there isn't a tables flag, then check the box
        for (const row of tableBodyRows) {
            const databaseTableName = await row.$eval('td:nth-child(2)', el => el.textContent);
            if (!this.flags.tables || this.flags.tables.includes(databaseTableName)) {
                await (await row.$('td input')).click();
            }
        }

        // await browser.close();
        this.ux.stopSpinner();
        if (logVerbosely) {
            this.ux.logJson(finalOutput);
        }

        if (this.flags.createdir) {
            // create the external data source
            // https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_externaldatasource.htm
            const path = `${this.flags.createdir}/${this.flags.label.replace(/ /g, '')}.dataSource-meta.xml`;
            await writeJSONasXML({
                path,
                type: metadataTypeName,
                json: {
                    '@': {
                        xmlns: 'http://soap.sforce.com/2006/04/metadata'
                    },
                    isWritable: true,
                    principalType: 'NamedUser',
                    label: this.flags.label,
                    protocol: 'Password',
                    type: 'OData4',
                    ...finalOutput
                }
            });
            this.ux.log(`created new data source at ${path}`);
        }

        if (this.flags.updatefile) {
            const existing = await getExisting(this.flags.updatefile, metadataTypeName);
            await writeJSONasXML({
                path: this.flags.updatefile,
                type: metadataTypeName,
                json: {
                    ...existing,
                    ...finalOutput
                }
            });
            this.ux.log(`updated ${this.flags.updatefile}`);
        }

        return finalOutput;
    }
}
