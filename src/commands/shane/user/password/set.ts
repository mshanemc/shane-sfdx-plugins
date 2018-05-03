import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import request = require('request-promise-native');
// import localFile2CV = require('../../../shared/localFile2CV');
import userIdLookup = require('../../../../shared/userIdLookup');

const chalk = require('chalk');


export default class Set extends SfdxCommand {

	public static description = 'Set the password for a user by first/last name';

	public static examples = [
`sfdx shane:user:password:set -p sfdx1234 -g User -l User
// sets the password for User User to sfdx1234
`
	];

	protected static flagsConfig = {
		firstName: flags.string({ char: 'g', required: true, description: 'first (given) name of the user--keeping -f for file for consistency' }),
		lastName: flags.string({ char: 'l', required: true, description: 'last name of the user' }),
		password: flags.string({ char: 'p', required: true, description: 'local path of the photo to use' })
	};

	// Comment this out if your command does not require an org username
	protected static requiresUsername = true;

	public async run(): Promise<any> { // tslint:disable-line:no-any
		const conn = this.org.getConnection();
		let user;

		try {
			user = await userIdLookup.getUserId(conn, this.flags.lastName, this.flags.firstName);
		} catch (e){
			this.ux.error(chalk.red(e));
			return {
				status: 1,
				result: {
					error: e
				}
			};
		}

		this.ux.log(`found user with id ${user.Id}`);

		const resetResult = await request({
			method: 'post',
			uri: `${conn.instanceUrl}/services/data/v41.0/sobjects/User/${user.Id}/password`,
			body: {
				NewPassword: this.flags.password
			},
			headers: {
				'Authorization': `Bearer ${conn.accessToken}`
			},
			json: true,
			resolveWithFullResponse: true
		});

		if (resetResult.statusCode === 204){
			this.ux.log(chalk.green(`Successfully set the password "${this.flags.password}" for user ${user.Username}.`));
			this.ux.log(`You can see the password again by running "sfdx force:user:display -u ${user.Username}".`);
			return {
        password: this.flags.password
			};
		}
		else {
			this.ux.error(chalk.red('Password not set correctly.'));
			return {
				status: 1,
				result: resetResult
			}
		}

	}
//
//
// 						.then((resp) => {
// 							if (resp.statusCode === 204) {
// 								if (this.flags.json) {
// 									let output = {
// 										status: 0,
// 										result: {
// 											password: this.flags.password
// 										}
// 									};
// 									console.log(JSON.stringify(output));
// 								} else {
// 									console.log(`Successfully set the password "${this.flags.password}" for user ${user.Username}.`);
// 									console.log(`You can see the password again by running "sfdx force:user:display -u ${user.Username}".`);
// 								}
// 							} else {
// 								console.error(resp);
// 							}
// 						})
// 						.catch((err) => {
// 							if (this.flags.json) {
// 								let output = {
// 									status: 1,
// 									message: err
// 								};
// 								console.error(JSON.stringify(output));
// 							} else {
// 								console.error(`Error: ${err}`);
// 							}
// 						});


// const forceUtils = require('../lib/forceUtils');
// const rp = require('request-promise-native');

// (function () {
// 	'use strict';

// 	module.exports = {
// 		topic: 'user',
// 		command: 'password:set',
// 		description: 'Set the password for a user by first/last name',
// 		help: 'Sets the password that you decide for a user, given their First and Last name (since username is randomly generated).  Can be used as a substitute for force:use:password:generate, which generates random, complex passwords',
// 		flags: [{
// 			name: 'firstName',
// 			char: 'g',
// 			description: 'first (given) name of the user--keeping -f for file for consistency',
// 			hasValue: true,
// 			required: false
// 		}, {
// 			name: 'lastName',
// 			char: 'l',
// 			description: 'last name of the user',
// 			hasValue: true,
// 			required: true
// 		}, {
// 			name: 'password',
// 			char: 'p',
// 			description: 'the password you want to change this user to',
// 			hasValue: true,
// 			required: true
// 		}, {
// 			name: 'targetusername',
// 			char: 'u',
// 			description: 'username for the target org (no the user that you want to set the password for, but to tell sfdx which org)',
// 			hasValue: true,
// 			required: false
// 		}, {
// 			name: 'json',
// 			description: 'return the output as json',
// 			hasValue: false,
// 			required: false
// 		}],
// 		run(context) {
// 			let targetUsername = this.flags.targetusername;
// 			let userid;
// 			let user;

// 			forceUtils.getOrg(targetUsername, (org) => {
// 				org.force._getConnection(org, org.config).then((conn) => {
// 					targetUsername = org.authConfig.username;

// 					let query;
// 					if (this.flags.firstName) {
// 						query = `Select Id, Username from User where LastName = '${this.flags.lastName}' and FirstName = '${this.flags.firstName}'`;
// 					} else {
// 						query = `Select Id, Username from User where LastName = '${this.flags.lastName}'`;
// 					}
// 					//first, query the user
// 					conn.query(query)
// 						.then((result) => {
// 							if (result.totalSize > 1) {
// 								throw 'There are more than 1 result for that name.';
// 							} else if (result.totalSize === 0) {
// 								throw 'User not found';
// 							} else {
// 								userid = result.records[0].Id;
// 								user = result.records[0];
// 								return userid;
// 								//return result.records[0].Id;
// 							}
// 						})
// 						.then(() => {
// 							// endpoint curl https://yourInstance.salesforce.com/services/data/v25.0/sobjects/User/005D0000001KyEIIA0/password -H "Authorization: Bearer token" —H "Content-Type: application/json" —d @newpwd.json —X POST
// 							return rp({
// 								method: 'post',
// 								uri: `${org.authConfig.instanceUrl}/services/data/v41.0/sobjects/User/${userid}/password`,
// 								body: {
// 									NewPassword: this.flags.password
// 								},
// 								headers: {
// 									'Authorization': `Bearer ${org.authConfig.accessToken}`
// 								},
// 								json: true,
// 								resolveWithFullResponse: true
// 							});
// 						})
// 						.then((resp) => {
// 							if (resp.statusCode === 204) {
// 								if (this.flags.json) {
// 									let output = {
// 										status: 0,
// 										result: {
// 											password: this.flags.password
// 										}
// 									};
// 									console.log(JSON.stringify(output));
// 								} else {
// 									console.log(`Successfully set the password "${this.flags.password}" for user ${user.Username}.`);
// 									console.log(`You can see the password again by running "sfdx force:user:display -u ${user.Username}".`);
// 								}
// 							} else {
// 								console.error(resp);
// 							}
// 						})
// 						.catch((err) => {
// 							if (this.flags.json) {
// 								let output = {
// 									status: 1,
// 									message: err
// 								};
// 								console.error(JSON.stringify(output));
// 							} else {
// 								console.error(`Error: ${err}`);
// 							}
// 						});

// 				});
// 			});

// 		}
// 	};
// }());

	}
