import { flags, SfdxCommand } from '@salesforce/command';
import keytar = require('keytar');

import requestPromise = require('request-promise-native');

import { baseUrl } from '../../../../shared/aiConstants';

export default class EinsteinAIDelete extends SfdxCommand {
    public static description = 'delete a dataset';

    public static examples = [`sfdx shane:ai:dataset:delete -n 57`];

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
            method: 'DELETE',
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
