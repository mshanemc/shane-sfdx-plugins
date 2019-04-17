/*
gratefully borrowed mostly from https://github.com/ChuckJonas/salesforce-jwt-promise
*/

import * as jwt from 'jsonwebtoken';
import * as request from 'request';

export interface JWTResponse {
    access_token: string;
    scope: string;
    instance_url: string;
    id: string;
    token_type: string;
}

export interface JWTError {
    error: string;
    error_description: string;
}

export interface JWTOptions {
    clientId: string;
    privateKey: string;
    userName: string;
    audience?: string; // defaults to login.salesforce.com
}

export const getJWTToken = (opts: JWTOptions): Promise<JWTResponse> => {
    const audience = opts.audience || 'https://login.salesforce.com';
    const options: jwt.SignOptions = {
      issuer: opts.clientId,
      audience: audienceTranslator(audience),
      expiresIn: 3,
      algorithm: 'RS256'
    };

    const token = jwt.sign({ prn: opts.userName }, opts.privateKey, options);

    return new Promise((resolve, reject) => {
        request(
            {
                uri: `${audience}/services/oauth2/token`,
                form: {
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    assertion:  token
                },
                method: 'post'
            }, (err, res, body) => {
            if (err) {
                reject(err);
            }

            if (!body) {
                reject(new Error('No response from oauth endpoint.'));
                return;
            }

            let respBody;
            try {
                respBody = JSON.parse(body);
            } catch (e) {
                reject(new Error('Could Not Parse Response'));
                return;
            }

            if (res.statusCode !== 200) {
                const respError = respBody as JWTError;
                const message = 'Failed to Authenticate: ' + respError.error + ' (' + respError.error_description + ')';
                reject(new Error(message));
                return;
            }

            resolve(respBody as JWTResponse);
        });
    });

};

// support custom domains so that newly created scratch orgs don't have to wait for login servers at test.salesforce.com to propogate
// jwt doesn't accept custom domains as audiences, but we can use them as the token endpoint

const audienceTranslator = (audience: string) => {
    if (audience === 'https://test.salesforce.com' || audience === 'https://login.salesforce.com') {
        // not a custom domain
        return audience;
    } else if (audience.match(/(\.cs[0-9]*\.my\.salesforce.com)/)) {
        return 'https://test.salesforce.com';
    } else {
        return 'https://login.salesforce.com';
    }
};
