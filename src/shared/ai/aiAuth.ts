import { baseUrl } from './aiConstants';
import { AiAuthResponse } from '../typeDefs';

import fs = require('fs-extra');
import requestPromise = require('request-promise-native');
import jwt = require('jsonwebtoken');

const endpoint = `${baseUrl}/oauth2/token`;

const authJwt = async ({ cert, email = process.env.EINSTEIN_EMAIL, certFile }: AiAuthParams): Promise<AiAuthResponse> => {
    const assertion = jwt.sign(
        {
            sub: email,
            aud: endpoint
        },
        cert ?? (await fs.readFile(certFile, 'utf8')),
        {
            header: {
                alg: 'RS256',
                typ: 'JWT'
            },
            expiresIn: '1h'
        }
    );

    const response = await requestPromise(endpoint, {
        method: 'POST',
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}&scope=offline`,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            accept: 'application/json'
        },
        json: true
    });

    return response;
};

interface AiAuthParams {
    cert?: string;
    certFile?: string;
    email?: string;
}

export { authJwt };
