import { flags, SfdxCommand } from '@salesforce/command';

import { createReadStream, ReadStream } from 'fs-extra';

import { AITokenRetrieve } from '../../../../shared/ai/aiConstants';
import { datasetGet, datasetEndpoint, trainingEndpoint } from '../../../../shared/ai/datasetGet';

import requestPromise = require('request-promise-native');

const imageTypes = ['image', 'image-detection', 'image-multi-label'];
const textTypes = ['text-intent', 'text-sentiment'];

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
            description:
                'Path to the .zip (image) or .csv/.tsv/.json (language) file on the local drive (FilePart). The maximum file size you can upload from a local drive is 50 MB for images, 25 MB for text'
        }),
        path: flags.string({
            char: 'p',
            description:
                'URL of the .zip (image) or .csv/.tsv/.json (language) file. The maximum file size you can upload from a web location is 2 GB (images), 25MB (text) '
        }),
        type: flags.string({
            char: 't',
            description: 'Type of dataset data. Valid values are:',
            options: [...imageTypes, ...textTypes],
            default: 'image'
        }),
        train: flags.boolean({ description: 'train a model on the dataset' }),
        // sync: flags.boolean({ char: 's', description: 'keep polling until the dataset creation is done' }),
        email: flags.email({ char: 'e', description: 'email address you used when you signed up for your einstein.ai account' }),
        wait: flags.integer({ char: 'w', description: 'how long to wait for this to process (minutes)', default: 10 }),
        verbose: flags.builtin()
    };

    public async run(): Promise<any> {
        const token = await AITokenRetrieve(this.flags.email || process.env.EINSTEIN_EMAIL);
        const endpoint = `${datasetEndpoint(textTypes.includes(this.flags.type))}/upload`;

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
        this.ux.startSpinner('creating dataset');
        const createResponse = await requestPromise(endpoint, {
            method: 'POST',
            formData,
            headers: {
                'Content-type': 'multipart/form-data',
                'Cache-Control': 'no-cache',
                Authorization: `Bearer ${token}`
            },
            json: true
        });
        this.ux.stopSpinner(`created dataset with id ${createResponse.id}`);

        if (this.flags.wait > 0 || this.flags.train) {
            this.ux.startSpinner('waiting for dataset to complete');
            const completedResponse = await datasetGet({
                email: this.flags.email || process.env.EINSTEIN_EMAIL,
                isLanguage: textTypes.includes(this.flags.type),
                dataset: createResponse.id,
                poll: true,
                pollLimitMins: this.flags.wait
            });
            this.ux.stopSpinner(`completed with status ${completedResponse.statusMsg}`);

            if (!this.flags.json && this.flags.verbose) {
                this.ux.logJson(completedResponse);
            }

            if (this.flags.train) {
                this.ux.startSpinner('training model from dataset');
                const trainResponse = await requestPromise(trainingEndpoint(textTypes.includes(this.flags.type)), {
                    method: 'POST',
                    formData: {
                        datasetId: createResponse.id,
                        name: this.flags.name ?? 'autocreated from shane:sfdx plugin'
                    },
                    headers: {
                        'Content-type': 'multipart/form-data',
                        'Cache-Control': 'no-cache',
                        Authorization: `Bearer ${token}`
                    },
                    json: true
                });
                this.ux.stopSpinner(`training in progress with modelId ${trainResponse.modelId}`);

                if (!this.flags.json && this.flags.verbose) {
                    this.ux.logJson(trainResponse);
                }
            }

            this.ux.log(`check the status using sfdx shane:ai:dataset:get -n ${completedResponse.id}`);
            return completedResponse;
        }

        if (!this.flags.json) {
            this.ux.logJson(createResponse);
        }

        this.ux.log(`check the status using sfdx shane:ai:dataset:get -n ${createResponse.id}`);
        return createResponse;
    }
}

interface DatasetCreateAsyncRequest {
    type: string;
    data?: ReadStream;
    path?: string;
    name?: string;
}
