import { flags, SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');
import jwt = require('jsonwebtoken');

import requestPromise = require('request-promise-native');

import { aiServiceName, baseUrl, convertEmailToFilename, ShaneAIConfig } from '../../../shared/aiConstants';

export default class EinsteinAIAuth extends SfdxCommand {
    public static description = 'get an access token from an email and a .pem file, either passed in or from environment variables';

    public static examples = [
        `sfdx shane:ai:auth -e shane.mclaughlin@salesforce.com -f ~/code/certs/einstein_platform.pem
    // reauths, and takes what it can get
    `,
        `sfdx shane:org:reauth --requirecustomdomain
    // will try each minute, up to 60 minutes, until an org with a valid mydomain is ready
    `
    ];

    protected static flagsConfig = {
        email: flags.email({ char: 'e', description: 'email address you used when you signed up for your einstein.ai account' }),
        certfile: flags.filepath({ char: 'f', description: 'path to your private key from when you signed up' }),
        tokentime: flags.integer({ char: 't', description: 'time in minutes that you want your token to be valid for', default: 1440 })
    };

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        if (!this.flags.email && !process.env.EINSTEIN_EMAIL) {
            throw new Error('You have to have an email address, either --email or stored in the environment as EINSTEIN_EMAIL');
        }
        if (!this.flags.email && !process.env.EINSTEIN_CERTPATH) {
            throw new Error('You have to have a certificate, either --certfile or stored in the environment as EINSTEIN_CERTPATH');
        }

        const endpoint = `${baseUrl}/oauth2/token`;

        const assertion = jwt.sign(
            {
                sub: this.flags.email || process.env.EINSTEIN_EMAIL,
                aud: endpoint
            },
            await fs.readFile(this.flags.certfile, 'utf8'),
            {
                header: {
                    alg: 'RS256',
                    typ: 'JWT'
                },
                expiresIn: '1h'
            }
        );
        const response = await requestPromise(endpoint, {
            method: 'POST',
            body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                accept: 'application/json'
            }
        });

        const parsedResponse = JSON.parse(response);
        // this.ux.logJson(parsedResponse);
        const config = await ShaneAIConfig.create({
            filename: convertEmailToFilename(this.flags.email || process.env.EINSTEIN_EMAIL, aiServiceName),
            isGlobal: true
        });
        await config.setToken(parsedResponse.access_token);
        await this.ux.log(`Your access token is ${parsedResponse.access_token} and saved to your keychain`);

        return parsedResponse;
    }
}
