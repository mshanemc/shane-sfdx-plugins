import { retry } from '@lifeomic/attempt';
import { AITokenRetrieve, baseUrl } from './aiConstants';

import requestPromise = require('request-promise-native');

interface DatasetGetParams {
    dataset: string;
    isLanguage?: boolean;
    poll?: boolean;
    email?: string;
    pollLimitMins?: number;
}

const datasetGet = async ({ dataset, isLanguage, poll, email, pollLimitMins = 10 }: DatasetGetParams) => {
    const token = await AITokenRetrieve(email || process.env.EINSTEIN_EMAIL);
    let datasetId = dataset;

    if (!isDataSetANumber(dataset)) {
        datasetId = await datasetIdFromName({ datasetName: dataset, isLanguage, token });
    }

    const endpoint = `${datasetEndpoint(isLanguage)}/${datasetId}`;

    const parsedResponse = await retry(
        async () => {
            const response = await requestPromise(endpoint, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    Authorization: `Bearer ${token}`
                },
                json: true
            });
            // keep trying until other status
            if (poll && response.statusMsg === 'UPLOADING') {
                throw new Error('still processing');
            }
            return response;
        },
        {
            maxAttempts: 100,
            timeout: 1000 * 60 * pollLimitMins,
            async handleTimeout() {
                const response = await requestPromise(endpoint, {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache',
                        Authorization: `Bearer ${token}`
                    },
                    json: true
                });
                return response;
            }
        }
    );

    return parsedResponse;
};

const datasetIdFromName = async ({ datasetName, isLanguage, token }) => {
    const endpoint = datasetEndpoint(isLanguage);
    const pageSize = 25;

    const matched = await retry(async context => {
        const response = await requestPromise(`${endpoint}?offset=${context.attemptNum * pageSize}&count=${pageSize}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                Authorization: `Bearer ${token}`
            },
            json: true
        });
        if (response.data.find(dataset => dataset.name === datasetName)) {
            // found a match?  cool.  return its ID.
            return response.data.find(dataset => dataset.name === datasetName).id;
        }
        if (response.data.length === pageSize) {
            throw new Error('keep paginating');
        }
        return undefined;
    }, {});

    return matched;
};

const isDataSetANumber = dataset => {
    if (typeof dataset === 'string') {
        return dataset.trim() !== '' && Number.isFinite(Number(dataset));
    }
    if (typeof dataset === 'number') {
        return true;
    }
    return false;
};

const datasetEndpoint = isLanguage => {
    return `${baseUrl}/${isLanguage ? 'language' : 'vision'}/datasets`;
};

const trainingEndpoint = isLanguage => {
    return `${baseUrl}/${isLanguage ? 'language' : 'vision'}/train`;
};

export { datasetGet, isDataSetANumber, datasetIdFromName, datasetEndpoint, trainingEndpoint };
