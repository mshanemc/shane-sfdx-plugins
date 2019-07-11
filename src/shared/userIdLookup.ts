import { Connection } from '@salesforce/core';
import { QueryResult, Record } from './../shared/typeDefs';

export async function getUserId(conn: Connection, lastname: string, firstname?: string): Promise<Record> {
    let query;
    if (firstname) {
        query = `Select Id, Username from User where LastName = '${lastname}' and FirstName = '${firstname}'`;
    } else {
        query = `Select Id, Username from User where LastName = '${lastname}'`;
    }

    const users = <QueryResult>await conn.query(query);
    if (users.totalSize > 1) {
        throw new Error('There are more than 1 result for that name.');
    } else if (users.totalSize === 0) {
        throw new Error('User not found');
    } else {
        return users.records[0];
    }
}
