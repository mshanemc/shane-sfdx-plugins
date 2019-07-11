import { Connection } from '@salesforce/core';
import fs = require('fs-extra');

import { CreateResult, QueryResult, Record } from './../shared/typeDefs';

interface ContentVersionCreateRequest {
    VersionData: string;
    PathOnClient: string;
    Title?: string;
}

export async function file2CV(conn: Connection, filepath: string, name?: string): Promise<Record> {
    const fileData = await fs.readFile(filepath);
    const cvcr = <ContentVersionCreateRequest>{
        VersionData: Buffer.from(fileData).toString('base64'),
        PathOnClient: filepath
    };
    // optinal params
    if (name) {
        cvcr.Title = name;
    }

    const CV = <CreateResult>await conn.sobject('ContentVersion').create(cvcr);

    const result = <QueryResult>await conn.query(`Select Id, ContentDocumentId from ContentVersion where Id='${CV.id}'`);
    return result.records[0];
}
