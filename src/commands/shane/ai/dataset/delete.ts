import { flags, SfdxCommand } from '@salesforce/command';
import { AITokenRetrieve, baseUrl } from '../../../../shared/ai/aiConstants';

import requestPromise = require('request-promise-native');

export default class EinsteinAIDelete extends SfdxCommand {
    public static description = 'delete a dataset';

    public static examples = [`sfdx shane:ai:dataset:delete -n 57`];

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

        const response = await requestPromise(`${baseUrl}/vision/datasets/${this.flags.dataset}`, {
            method: 'DELETE',
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
