import { Connection } from '@salesforce/core';
import { retry } from '@lifeomic/attempt';
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
    // const result = tooling ? ((await conn.tooling.query(query)) as QueryResult) : ((await conn.query(query)) as QueryResult);

    // unfortunately, sometime you get a 404 bad_id error if the username isn't queryable yet.  retry prevents that.
    const result = (await retry(
        async () => {
            return tooling ? conn.tooling.query(query) : conn.query(query);
        },
        {
            maxAttempts: 5,
            delay: 1000,
            factor: 2
        }
    )) as QueryResult;

    if (result.totalSize === 0) {
        throw new Error('no records found');
    }
    if (result.totalSize > 1) {
        if (returnChoices) {
            throw new Error(`multiple records found: ${result.records.map(record => record[choiceField]).join(',')}`);
        }
        throw new Error('the query returned more than 1 record');
    }
    return result.records[0];
};

export { singleRecordQuery };
