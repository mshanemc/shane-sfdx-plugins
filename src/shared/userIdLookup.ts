// eslint-disable-next-line unicorn/filename-case
import { Connection } from '@salesforce/core';
import { singleRecordQuery } from './queries';
import { User } from './typeDefs';

export async function getUserId(conn: Connection, lastname: string, firstname?: string): Promise<User> {
    let query = `Select Id, Username from User where LastName = '${lastname}'`;
    if (firstname) {
        query = `${query} and FirstName = '${firstname}'`;
    }
    return singleRecordQuery({ conn, query });
}
