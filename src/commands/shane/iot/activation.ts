import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import request = require('request-promise-native');
import localFile2CV = require('../../../shared/localFile2CV');

const chalk = require('chalk');

export default class Activation extends SfdxCommand {

	public static description = 'Activate an iot orchestration by name';

	public static examples = [
`sfdx shane:iot:activate -n orchName -r
// activates the orchestration, resetting all the instances
`,
		`sfdx shane:iot:activate -n orchName -d
// deactivates the orchestration, without resetting all the instances
`
	];

	protected static flagsConfig = {
		name: flags.string({ char: 'n', required: true, description: 'API name of the orchestration' }),
		reset: flags.boolean({ char: 'r', description: 'reset all instances of the orchestration' }),
		deactivate: flags.boolean({ char: 'd', description: 'deactivate the orchestration' }),
	};

	protected static requiresUsername = true;
	protected static requiresProject = false;

	public async run(): Promise<any> { // tslint:disable-line:no-any

		const conn = this.org.getConnection();
		const auth = {
			'bearer': conn.accessToken
		}
		const options = {
			"resetInstancesOnActivation": Boolean(this.flags.reset)
		};

		// first, get the orchestration Id
		const orchestrations = JSON.parse(await request.get(`${conn.instanceUrl}/services/data/v42.0/iot/orchestrations`, {
			auth
		})).orchestrations;
		// console.log(orchestrations);

		// find the matching orchestration by name
		const thisOrch = orchestrations.find((i) => {
			return i.name === this.flags.name;
		});

		// didn't find a match.  Tell the user what's in there.
		if (!thisOrch){
			const orchNames = orchestrations.map( x => x.name);
			this.ux.error(chalk.red(`No orchestration found matching that name.  Orchestrations found: ${orchNames.join(', ')}`));
			return;
		} else {
			this.ux.log(`found orchestration with id ${thisOrch.id}.  Activating...`);
		}

		if (this.flags.deactivate){
			const deactivationResult = await request.patch({
				url: `${conn.instanceUrl}/services/data/v42.0/iot/orchestrations/${thisOrch.id}/activations/last`,
				body: {
					"status" : "Inactive",
					options
				},
				auth,
				json: true
			});
			this.ux.log(chalk.green('Orchestration deactivated.'));
			return deactivationResult;
		} else {
			const activationResult = await request.post({
				url: `${conn.instanceUrl}/services/data/v42.0/iot/orchestrations/${thisOrch.id}/activations`,
				body: {
					options
				},
				auth,
				json: true
			});
			this.ux.log(chalk.green('Orchestration activating.'));
			return activationResult;
		}
	}
}
