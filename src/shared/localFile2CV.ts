import fs = require('fs-extra');
// import { SfdxCommand, core } from '@salesforce/command';
import { Connection } from '@salesforce/core';

interface ContentVersionCreateRequest {
  VersionData: string;
  PathOnClient: string;
  Title?: string;
}

export interface CreateResult {
  id: string;
  success: boolean;
  errors: string[];
  name: string;
  message: string;
}

export interface QueryResult {
  totalSize: number;
  done: boolean;
  records: Record[];
}

export interface Record {
  attributes: object;
  Id: string;
  ContentDocumentId?: string;
}

export async function file2CV(conn: Connection, filepath: string, name?: string): Promise<Record> {
  const fileData = await fs.readFile(filepath);
  const cvcr = <ContentVersionCreateRequest> {
    VersionData: new Buffer(fileData).toString('base64'),
    PathOnClient: filepath
  };
  // optinal params
  if (name) {
    cvcr.Title = name;
  }

  const CV = <CreateResult> await conn.sobject('ContentVersion').create(cvcr);

  const result = <QueryResult> await conn.query(`Select Id, ContentDocumentId from ContentVersion where Id='${CV.id}'`);
  return result.records[0];
}
