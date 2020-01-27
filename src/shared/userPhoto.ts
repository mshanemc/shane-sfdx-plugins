import { Connection } from '@salesforce/core';
import localFile2CV = require('./localFile2CV');
import request = require('request-promise-native');

const savePhotoForUser = async ({ conn, userId, filePath, isBanner }: PhotoSaveInput) => {
    const options = {
        method: 'POST',
        json: true,
        headers: {
            Authorization: `Bearer ${conn.accessToken}`
        }
    };
    // save the CV
    const photoCV = await localFile2CV.file2CV(conn, filePath);

    const savePhotResult = await request({
        ...options,
        uri: isBanner
            ? `${conn.instanceUrl}/services/data/v${conn.getApiVersion()}/connect/user-profiles/${userId}/banner-photo`
            : `${conn.instanceUrl}/services/data/v${conn.getApiVersion()}/connect/user-profiles/${userId}/photo`,
        body: {
            fileId: photoCV.ContentDocumentId
        }
    });
    return savePhotResult;
};

interface PhotoSaveInput {
    conn: Connection;
    userId: string;
    filePath: string;
    isBanner?: boolean;
}

export { savePhotoForUser };
