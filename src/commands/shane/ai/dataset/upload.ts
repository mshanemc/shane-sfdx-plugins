import { flags, SfdxCommand } from '@salesforce/command';
import keytar = require('keytar');

import { createReadStream, ReadStream } from 'fs-extra';
import requestPromise = require('request-promise-native');

import { baseUrl } from '../../../../shared/aiConstants';

export default class EinsteinAIUpload extends SfdxCommand {
    public static description = 'upload a dataset';

    public static examples = [`sfdx shane:ai:dataset:upload -e shane.mclaughlin@salesforce.com -f ~/myPics.zip -n AwesomeDataset `];

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            description: 'Name of the dataset. Optional. If this parameter is omitted, the dataset name is derived from the .zip file name. '
        }),
        file: flags.filepath({
            char: 'f',
            description: 'Path to the .zip file on the local drive (FilePart). The maximum .zip file size you can upload from a local drive is 50 MB'
        }),
        path: flags.string({
            char: 'p',
            description: 'URL of the .zip file. The maximum .zip file size you can upload from a web location is 2 GB.'
        }),
        type: flags.string({
            char: 't',
            description: 'Type of dataset data. Valid values are:',
            options: ['image', 'image-detection', 'image-multi-label'],
            default: 'image'
        }),
        async: flags.boolean({ char: 'a', description: 'keep polling until the dataset creation is done' }),
        email: flags.email({ char: 'e', description: 'email address you used when you signed up for your einstein.ai account' }),
        wait: flags.integer({ char: 'w', description: 'how long to wait for this to proecess', default: 0 })
    };

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const token = await keytar.getPassword('einstein-ai', this.flags.email || process.env.EINSTEIN_EMAIL);
        console.log(token);
        const endpoint = `${baseUrl}/vision/datasets/upload`;

        const formData: DatasetCreateAsyncRequest = {
            type: this.flags.type
        };

        if (this.flags.file) {
            formData.data = createReadStream(this.flags.file);
        }
        if (this.flags.path) {
            formData.path = this.flags.path;
        }
        if (this.flags.name) {
            formData.name = this.flags.name;
        }
        // console.log(formData);

        const response = await requestPromise(endpoint, {
            method: 'POST',
            // body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
            formData,
            headers: {
                'Content-type': 'multipart/form-data',
                'Cache-Control': 'no-cache',
                Authorization: `Bearer ${token}`
            }
        });

        const parsedResponse = JSON.parse(response);
        this.ux.logJson(parsedResponse);
        this.ux.log(`check the status using sfdx shane:ai:dataset:get -n ${parsedResponse.id}`);
        // await keytar.setPassword('einstein-ai', this.flags.email || process.env.EINSTEIN_EMAIL, parsedResponse.access_token);
        // this.ux.log(`Your access token is ${parsedResponse.access_token} and saved to your keychain`);

        // const kca = new core.KeychainAccess();
        return parsedResponse;
    }
}

interface DatasetCreateAsyncRequest {
    type: string;
    data?: ReadStream;
    path?: string;
    name?: string;
}
