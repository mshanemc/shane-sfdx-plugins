import { Connection } from '@salesforce/core';
import { singleRecordQuery } from './../shared/queries';
import { Record } from './../shared/typeDefs';

export async function getUserId(conn: Connection, lastname: string, firstname?: string): Promise<Record> {
    let query = `Select Id, Username from User where LastName = '${lastname}'`;
    if (firstname) {
        query = `${query} and FirstName = '${firstname}'`;
    }
    return await singleRecordQuery({ conn, query });
}
