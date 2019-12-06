import { Connection } from '@salesforce/core';
import { QueryResult, Record } from './typeDefs';

interface SingleRecordQueryInputs {
    conn: Connection;
    query: string;
    returnChoices?: boolean;
    choiceField?: string;
    tooling?: boolean;
}

const singleRecordQuery = async ({
    conn,
    query,
    returnChoices = false,
    choiceField = 'Name',
    tooling = false
}: SingleRecordQueryInputs): Promise<Record> => {
    let result;
    if (tooling) {
        result = <QueryResult>await conn.tooling.query(query);
    } else {
        result = <QueryResult>await conn.query(query);
    }
    if (result.totalSize > 1) {
        if (returnChoices) {
            throw new Error(`multiple records found: ${result.records.map(record => record[choiceField]).join(',')}`);
        }
        throw new Error('the query returned more than 1 record');
    } else if (result.totalSize === 0) {
        throw new Error('no records found');
    } else {
        return result.records[0];
    }
};

export { singleRecordQuery };
