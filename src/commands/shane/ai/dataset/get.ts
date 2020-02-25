import { flags, SfdxCommand } from '@salesforce/command';
import { datasetGet } from '../../../../shared/ai/datasetGet';

export default class EinsteinAIGet extends SfdxCommand {
    public static description = 'get an access token from an email and a .pem file, either passed in or from environment variables';

    public static examples = [`sfdx shane:ai:dataset:get -n 57`];

    protected static flagsConfig = {
        dataset: flags.string({
            char: 'n',
            required: true,
            description: 'dataset id'
        }),
        language: flags.boolean({ char: 'l', description: 'use the language endpoint instead of vision' }),
        email: flags.email({ char: 'e', description: 'email address you used when you signed up for your einstein.ai account' }),
        poll: flags.boolean({ char: 'p', description: 'poll for the status to be completed' })
    };

    public async run(): Promise<any> {
        const parsedResponse = await datasetGet({
            email: this.flags.email || process.env.EINSTEIN_EMAIL,
            isLanguage: this.flags.language,
            poll: this.flags.poll,
            dataset: this.flags.dataset
        });
        if (!this.flags.json) {
            this.ux.logJson(parsedResponse);
        }
        return parsedResponse;
    }
}
