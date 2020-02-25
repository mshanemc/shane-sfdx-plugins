import { flags, SfdxCommand } from '@salesforce/command';

import { convertEmailToFilename, ShaneAIConfig } from '../../../shared/ai/aiConstants';
import { authJwt } from '../../../shared/ai/aiAuth';

import fs = require('fs-extra');

export default class EinsteinAIAuth extends SfdxCommand {
    public static description = 'get an access token from an email and a .pem file, either passed in or from environment variables';

    public static examples = [
        `sfdx shane:ai:auth -e shane.mclaughlin@salesforce.com -f ~/code/certs/einstein_platform.pem
    // reauths, and takes what it can get
    `
    ];

    protected static flagsConfig = {
        email: flags.email({
            char: 'e',
            description: 'email address you used when you signed up for your einstein.ai account',
            env: 'EINSTEIN_EMAIL'
        }),
        certfile: flags.filepath({
            char: 'f',
            description: 'path to your private key from when you signed up',
            env: 'EINSTEIN_CERTPATH'
        }),
        tokentime: flags.integer({
            char: 't',
            description: 'time in minutes that you want your token to be valid for',
            default: 1440
        }),
        level: flags.string({ char: 'l', description: 'where to store this config', options: ['local', 'global'], default: 'local' })
    };

    public async run(): Promise<any> {
        if (!this.flags.email && !process.env.EINSTEIN_EMAIL) {
            throw new Error('You have to have an email address, either --email or stored in the environment as EINSTEIN_EMAIL');
        }
        if (!this.flags.certfile && !process.env.EINSTEIN_CERTPATH) {
            throw new Error('You have to have a certificate, either --certfile or stored in the environment as EINSTEIN_CERTPATH');
        }

        // const parsedResponse = JSON.parse(response);
        const parsedResponse = await authJwt({
            cert: await fs.readFile(this.flags.certfile, 'utf8'),
            email: this.flags.email
        });
        // this.ux.logJson(parsedResponse);
        const config = await ShaneAIConfig.create({
            filename: convertEmailToFilename(this.flags.email),
            isGlobal: this.flags.level === 'global'
        });
        await config.setToken(parsedResponse);
        await this.ux.log(`Your access token is ${parsedResponse.access_token} and saved to your keychain`);

        return parsedResponse;
    }
}
