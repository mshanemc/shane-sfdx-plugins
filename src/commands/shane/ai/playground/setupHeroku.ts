import { flags, SfdxCommand } from '@salesforce/command';
import { retry } from '@lifeomic/attempt';
import * as fs from 'fs-extra';

import { PlaygroundSetup } from '../../../../shared/ai/aiPlaygroundSetup';
import { authJwt } from '../../../../shared/ai/aiAuth';
import { ShaneAIConfig, convertEmailToFilename } from '../../../../shared/ai/aiConstants';

import crypto = require('crypto');
import aesjs = require('aes-js');
import requestPromise = require('request-promise-native');

const herokuAPIendpoint = 'https://api.heroku.com';

const defaultHerokuRequest = {
    headers: {
        Authorization: `Bearer ${process.env.HEROKU_API_KEY}`,
        Accept: 'application/vnd.heroku+json; version=3'
    },
    json: true
};

const tempFileName = 'einstein-key.pem';
const cryptoBytes = 16;

export default class AIPlaygroundSetupHeroku extends SfdxCommand {
    public static description = 'provisions a new einstein.ai account and sets up the org';

    public static examples = [
        `sfdx shane:ai:playground:herokuSetup -a my-existing-app
    // creates addons to existing app
    `,
        `sfdx shane:ai:playground:herokuSetup -c
    // creates an app with whatever name heroku feels like
    `,
        `sfdx shane:ai:playground:herokuSetup -a non-existing-app -c
    // creates a new app with the name of your choice (usually build dynamically!)
    `
    ];

    protected static flagsConfig = {
        app: flags.string({ char: 'a', description: 'name of the heroku app that we attach add-ons to' }),
        create: flags.boolean({ char: 'c', description: 'create the app' }),
        keepauth: flags.boolean({ char: 'k', description: 'save the refresh token for einstein.ai to the local sfdx store for future cli use' }),
        verbose: flags.builtin()
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        if (this.flags.create) {
            this.ux.startSpinner('creating app on heroku');

            // attach the einstein addon
            const appResponse = await requestPromise.post(`${herokuAPIendpoint}/apps`, {
                ...defaultHerokuRequest,
                body: this.flags.app
                    ? {
                          name: this.flags.app
                      }
                    : {}
            });
            this.ux.stopSpinner(`created app ${appResponse.name}`);
        }

        this.ux.startSpinner('provisioning einstein addon');
        // attach the einstein addon
        const addonResponse = await requestPromise.post(`${herokuAPIendpoint}/apps/${this.flags.app}/addons`, {
            ...defaultHerokuRequest,
            body: {
                plan: 'einstein-vision:starter',
                config: { ACCOUNT_ID: 'm.shane.mclaughlin@gmail.com' }
            }
        });
        // this.ux.logJson(addonResponse);
        this.ux.setSpinnerStatus('getting ai credentials');
        // get the config information
        const addonConfig = await retry(
            async () => {
                const potentialResult = await requestPromise.get(`${herokuAPIendpoint}/apps/${this.flags.app}/config-vars`, {
                    ...defaultHerokuRequest
                });
                if (potentialResult[addonResponse.config_vars.find(item => item.includes('ACCOUNT_ID'))].includes('heroku-')) {
                    throw new Error('no valid email for accountId');
                }
                return potentialResult;
            },
            {
                maxAttempts: 30,
                async handleTimeout(result) {
                    this.ux.logJson(result);
                    throw new Error('no valid email for accountId');
                }
            }
        );

        // this.ux.logJson(addonConfig);
        this.ux.setSpinnerStatus('creating security certificate locally');

        const specificKey = addonConfig[addonResponse.config_vars.find(item => item.includes('PRIVATE_KEY'))].trim();
        const specificEmail = addonConfig[addonResponse.config_vars.find(item => item.includes('ACCOUNT_ID'))];
        const iv = crypto.randomBytes(cryptoBytes);
        const encryptionKey = crypto.randomBytes(cryptoBytes);
        const specificKeyAsBytes = aesjs.utils.utf8.toBytes(specificKey);

        // eslint-disable-next-line new-cap
        const aesCbc = new aesjs.ModeOfOperation.cbc(encryptionKey.toJSON().data, iv.toJSON().data);
        const encryptedAsBytes = aesCbc.encrypt(aesjs.padding.pkcs7.pad(specificKeyAsBytes));

        // write the file to a local path
        await fs.writeFile(tempFileName, Buffer.concat([iv, encryptedAsBytes]), { encoding: 'binary' });
        this.ux.setSpinnerStatus('connecting Salesfore org to einstein.ai');

        // call the playgroundSetup stuff
        const playgroundResult = await PlaygroundSetup({
            conn: this.org.getConnection(),
            filepath: tempFileName,
            email: specificEmail,
            key: encryptionKey.toString('base64')
        });

        if (this.flags.keepauth) {
            this.ux.setSpinnerStatus('authing to einstein.ai for future local cli use');
            const tokenResponse = await authJwt({
                cert: specificKey,
                email: specificEmail
            });
            const config = await ShaneAIConfig.create({
                filename: convertEmailToFilename(),
                isGlobal: false
            });
            await config.setToken(tokenResponse);
        }
        await fs.remove(tempFileName); // delete the key file
        if (this.flags.verbose) {
            this.ux.log(`email: ${specificEmail}`);
            this.ux.log(`key:
            ${specificKey}`);
        }

        return { ...playgroundResult, credentials: { email: specificEmail, pem: specificKey } };
    }
}
