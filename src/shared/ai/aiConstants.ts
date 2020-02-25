import { ConfigFile } from '@salesforce/core/lib/config/configFile';
import { Crypto } from '@salesforce/core/lib/crypto';

import * as moment from 'moment';
import { AiAuthResponse } from '../typeDefs';

import requestPromise = require('request-promise-native');

const baseUrl = 'https://api.einstein.ai/v2';
const aiServiceName = 'shane-ai';
const tokenTime = 2592000;

class ShaneAIConfig extends ConfigFile<ConfigFile.Options> {
    public async getToken() {
        const crypto = await Crypto.create();
        // stored token is still fine
        if (moment().isBefore(moment(this.get('access_token_expires') as number))) {
            return crypto.decrypt(this.get('access_token') as string);
        }
        // do the refresh thing
        if (this.get('refresh_token')) {
            const refreshDecrypted = crypto.decrypt(this.get('refresh_token') as string);
            const refreshResponse = await authRefresh(refreshDecrypted);
            await this.setToken(refreshResponse);
            return refreshResponse.access_token;
        }
        throw new Error('authorization expired.  Run sfdx shane:ai:auth again to restore');
    }

    public async setToken(input: AiAuthResponse) {
        const crypto = await Crypto.create();
        this.set('access_token', crypto.encrypt(input.access_token));
        this.set(
            'access_token_expires',
            moment()
                .add(input.expires_in, 'seconds')
                .valueOf()
        );
        if (input.refresh_token) {
            this.set('refresh_token', crypto.encrypt(input.refresh_token));
        }
        await this.write();
    }
}

const convertEmailToFilename = (email = '', service: string = aiServiceName) => {
    const newEmail = email
        .replace('@', '_')
        .replace('.', '_')
        .replace('.', '_')
        .replace('.', '_')
        .replace('.', '_');
    return newEmail ? `${service}-${newEmail}.json` : `${service}.json`;
};

const AITokenRetrieve = async (email?: string) => {
    try {
        const config = await ShaneAIConfig.create({ filename: convertEmailToFilename(email), isGlobal: false });
        return config.getToken();
    } catch (error) {
        const config = await ShaneAIConfig.create({ filename: convertEmailToFilename(email), isGlobal: true });
        return config.getToken();
    }
};

const authRefresh = async (refreshToken): Promise<AiAuthResponse> => {
    const endpoint = `${baseUrl}/oauth2/token`;

    const response = await requestPromise(endpoint, {
        method: 'POST',
        body: `grant_type=refresh_token&refresh_token=${refreshToken}&valid_for=${tokenTime}`,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            accept: 'application/json'
        },
        json: true
    });

    return response;
};

export { baseUrl, ShaneAIConfig, convertEmailToFilename, AITokenRetrieve, aiServiceName };
