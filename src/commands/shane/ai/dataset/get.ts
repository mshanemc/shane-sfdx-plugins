import { flags, SfdxCommand } from '@salesforce/command';
import { AITokenRetrieve, baseUrl } from '../../../../shared/ai/aiConstants';

import requestPromise = require('request-promise-native');

export default class EinsteinAIGet extends SfdxCommand {
    public static description = 'get an access token from an email and a .pem file, either passed in or from environment variables';

    public static examples = [`sfdx shane:ai:dataset:get -n 57`];

    protected static flagsConfig = {
        dataset: flags.string({
            char: 'n',
            required: true,
            description: 'dataset id'
        }),
        email: flags.email({ char: 'e', description: 'email address you used when you signed up for your einstein.ai account' })
    };

    public async run(): Promise<any> {
        const token = await AITokenRetrieve(this.flags.email || process.env.EINSTEIN_EMAIL);
        const endpoint = `${baseUrl}/vision/datasets/${this.flags.dataset}`;

        const response = await requestPromise(endpoint, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                Authorization: `Bearer ${token}`
            }
        });

        const parsedResponse = JSON.parse(response);
        if (!this.flags.json) {
            this.ux.logJson(parsedResponse);
        }
        return parsedResponse;
    }
}
