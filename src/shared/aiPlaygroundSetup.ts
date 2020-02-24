import { UX } from '@salesforce/command';
import { Connection } from '@salesforce/core';
import { ContentVersion, CreateResult } from './typeDefs';

import localFile2CV = require('./localFile2CV');

const FILENAME = 'einstein_platform';

const PlaygroundSetup = async ({ conn, filepath, email, key }: PlaygroundSetupParams) => {
    const ux = await UX.create();

    ux.startSpinner('uploading the pem file');
    const CV = (await localFile2CV.file2CV(conn, filepath, FILENAME)) as ContentVersion;
    ux.setSpinnerStatus('modifying your custom setting');

    const createResult = (await conn.sobject('einsteinplay__Einstein_Settings__c').create({
        einsteinplay__Einstein_EMail__c: email,
        einsteinplay__CertName__c: CV.ContentDocumentId,
        einsteinplay__Secret_Key__c: key
    })) as CreateResult;

    ux.stopSpinner(`created custom setting with id ${createResult.id}`);
    return createResult;
};

export { PlaygroundSetup };

interface PlaygroundSetupParams {
    email: string;
    conn: Connection;
    filepath?: string;
    key?: string;
}
