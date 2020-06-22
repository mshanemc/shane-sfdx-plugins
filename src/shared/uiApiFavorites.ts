// https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_features_favorites.htm
import { Connection } from '@salesforce/core';

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

interface SaveFavoriteRequest {
    body: FavoriteRequestBody;
    conn: Connection;
}
export { saveFavorite };
