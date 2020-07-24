import { UX } from '@salesforce/command';

import request = require('request-promise-native');

const hcDiscoveryServiceEndpoint = 'https://hc-central.heroku.com';

const defaultHerokuRequest = {
    headers: {
        Authorization: `Bearer ${process.env.HEROKU_API_KEY}`
    },
    json: true
};

const getMatchingApp = async (app: string, verbose?: boolean) => {
    const ux = await UX.create();
    const url = `${hcDiscoveryServiceEndpoint}/auth/${app}`;
    ux.startSpinner(`getting connections url from ${url}`);

    const discoveryResult = await request.post({
        ...defaultHerokuRequest,
        url
    });

    if (verbose) {
        ux.log('this is the discoveryResult');
        ux.logJson(discoveryResult);
    }

    const matchingApp = discoveryResult.connections.find(item => item.app_name === app && item.resource_name);

    if (verbose) {
        ux.log('this is the matching app');
        ux.logJson(matchingApp);
    }

    return matchingApp;
};

const patchApp = async (matchingApp, verbose?: boolean) => {
    const ux = await UX.create();
    ux.setSpinnerStatus('updating the heroku connect database url');

    const patchResults = await request.patch({
        ...defaultHerokuRequest,
        uri: matchingApp.detail_url,
        body: {
            schema_name: 'salesforce',
            db_key: 'DATABASE_URL'
        }
    });

    if (verbose) {
        ux.logJson(patchResults);
    }
};

// "User:a4f83e5a3eb243559bc1c83afdba0311Password: b203f027b3694eb98f7ae393619f0593"
const credentialParser = (credentialBlock: string) => {
    return {
        username: credentialBlock
            .split('Password: ')[0]
            .replace('User:', '')
            .trim(),
        password: credentialBlock.split('Password: ')[1].trim()
    };
};

export { getMatchingApp, patchApp, defaultHerokuRequest, credentialParser };
