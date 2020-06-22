// https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_features_favorites.htm
import { Connection } from '@salesforce/core';

import { flags } from '@salesforce/command';
import { FavoriteRequestBody } from './typeDefs';

import request = require('request-promise-native');

const saveFavorite = async ({ body, conn }: SaveFavoriteRequest) => {
    const uri = `${conn.instanceUrl}/services/data/v${await conn.retrieveMaxApiVersion()}/ui-api/favorites`;

    return request({
        method: 'POST',
        uri,
        headers: {
            Authorization: `Bearer ${conn.accessToken}`
        },
        json: true,
        body
    });
};

const favoriteFlagsName = flags.string({ char: 'l', description: 'the label you want to appear in the favorites menu' });
const favoriteFlagsStart = flags.boolean({ description: 'add the favorite at the beginning of the menu' });
const favoriteFlagsObject = flags.string({ char: 'o', required: true, description: 'object API name (including __c if custom)' });
interface SaveFavoriteRequest {
    body: FavoriteRequestBody;
    conn: Connection;
}

export { saveFavorite, favoriteFlagsName, favoriteFlagsStart, favoriteFlagsObject };
