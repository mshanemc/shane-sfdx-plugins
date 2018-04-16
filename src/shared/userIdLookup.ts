import { Connection } from '@salesforce/core';

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

export async function getUserId(conn: Connection, lastname: string, firstname?: string): Promise<Record> {

	let query;
	if (firstname) {
		query = `Select Id, Username from User where LastName = '${lastname}' and FirstName = '${firstname}'`;
	} else {
		query = `Select Id, Username from User where LastName = '${lastname}'`;
	}

	let userid;
		const users = <QueryResult>await conn.query(query);
	if (users.totalSize > 1) {
		throw('There are more than 1 result for that name.');
	} else if (users.totalSize === 0) {
		throw('User not found');
	} else {
		return userid = users.records[0];
	}

}