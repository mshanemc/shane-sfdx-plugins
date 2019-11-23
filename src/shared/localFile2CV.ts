import { Connection } from '@salesforce/core';
import fs = require('fs-extra');

import { CreateResult, QueryResult, Record } from './../shared/typeDefs';

interface ContentVersionCreateRequest {
    PathOnClient: string;
    Title?: string;
}

export async function file2CV(conn: Connection, filepath: string, name?: string): Promise<Record> {
    const apiVersion = conn.getApiVersion();

    const cvcr = <ContentVersionCreateRequest>{
        PathOnClient: filepath,
        Title: name
    };

    // Build the multi-part form data to be passed to the Request
    const formData = {
        entity_content: {
            value: JSON.stringify(cvcr),
            options: {
                contentType: 'application/json'
            }
        },
        VersionData: fs.createReadStream(filepath)
    };
    // POST the multipart form to Salesforce's API, can't use the normal "create" action because it doesn't support multipart
    // Had to bypass the type def to allow formData to pass through, will try and get it patched into the type def later
    // it is handled correctly by the underlying 'requst' library.
    // https://github.com/request/request#multipartform-data-multipart-form-uploads
    const CV = <
        CreateResult // tslint:disable-next-line:no-any
    >(<unknown>await conn.request(<any>{ url: `/services/data/v${apiVersion}/sobjects/ContentVersion`, formData, method: 'POST' }));
    const result = <QueryResult>await conn.query(`Select Id, ContentDocumentId from ContentVersion where Id='${CV.id}'`);
    return result.records[0];
}
