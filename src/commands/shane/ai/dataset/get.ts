import { flags, SfdxCommand } from '@salesforce/command';
import keytar = require('keytar');

import requestPromise = require('request-promise-native');

import { baseUrl } from '../../../../shared/aiConstants';

export default class EinsteinAIGet extends SfdxCommand {
    public static description = 'get an access token from an email and a .pem file, either passed in or from environment variables';

    public static examples = [`sfdx shane:ai:dataset:get -n 57`];

    protected static flagsConfig = {
        dataset: flags.string({
            char: 'n',
            required: true,
            description: 'dataset id'
        })
    };

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const token = await keytar.getPassword('einstein-ai', this.flags.email || process.env.EINSTEIN_EMAIL);
        console.log(token);
        const endpoint = `${baseUrl}/vision/datasets/${this.flags.dataset}`;

        const response = await requestPromise(endpoint, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                Authorization: `Bearer ${token}`
            }
        });

        const parsedResponse = JSON.parse(response);
        this.ux.logJson(parsedResponse);
        return parsedResponse;
    }
}
