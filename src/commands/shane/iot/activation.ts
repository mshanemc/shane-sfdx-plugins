/* tslint:disable no-var-requires */
import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';

import request = require('request-promise-native');

export default class Activation extends SfdxCommand {
    public static description = 'Activate an iot orchestration by name';

    public static examples = [
        `sfdx shane:iot:activate -n orchName -r
// activates the orchestration, including the context if necessary, optionally resetting all the instances
`,
        `sfdx shane:iot:activate -n orchName -d
// deactivates the orchestration, without resetting all the instances
`
    ];

    protected static flagsConfig = {
        name: flags.string({ char: 'n', required: true, description: 'API name of the orchestration' }),
        reset: flags.boolean({ char: 'r', description: 'reset all instances of the orchestration' }),
        deactivate: flags.boolean({ char: 'd', description: 'deactivate the orchestration' })
    };

    protected static requiresUsername = true;

    protected static requiresProject = false;

    public async run(): Promise<any> {
        // hardcoded because I've been burned on this one before
        const version = this.flags.apiversion ?? '44.0';
        const conn = this.org.getConnection();
        const auth = {
            bearer: conn.accessToken
        };

        const options = {
            resetInstancesOnActivation: Boolean(this.flags.reset)
        };

        // first, get the orchestration Id
        const { orchestrations } = JSON.parse(
            await request.get(`${conn.instanceUrl}/services/data/v${version}/iot/orchestrations`, {
                auth
            })
        );
        // console.log(orchestrations);

        // find the matching orchestration by name
        const thisOrch = orchestrations.find(i => i.name === this.flags.name);

        // didn't find a match.  Tell the user what's in there.
        if (!thisOrch) {
            throw new Error(`No orchestration found matching that name.  Orchestrations found: ${orchestrations.map(x => x.name).join(', ')}`);
        }
        // this.ux.logJson(thisOrch);
        this.ux.log(`found orchestration with id ${thisOrch.id}.  Will activate its context ${thisOrch.orchestrationContext.label}`);

        const contextActivationResult = await request.post({
            url: `${conn.instanceUrl}/services/data/v${version}/iot/contexts/${thisOrch.orchestrationContext.id}/activations`,
            body: {},
            auth,
            json: true
        });
        this.ux.log(contextActivationResult);

        // wait for a sign that the context is active
        let contextActive = false;
        do {
            const context = JSON.parse(
                await request.get(`${conn.instanceUrl}/services/data/v${version}/iot/contexts/${thisOrch.orchestrationContext.id}`, {
                    auth
                })
            );
            // this.ux.logJson(context);
            if (context.activationStatus === 'Active') {
                contextActive = true;
            }
        } while (!contextActive);

        if (this.flags.deactivate) {
            const deactivationResult = await request.patch({
                url: `${conn.instanceUrl}/services/data/v42.0/iot/orchestrations/${thisOrch.id}/activations/last`,
                body: {
                    status: 'Inactive',
                    options
                },
                auth,
                json: true
            });
            this.ux.log(chalk.green('Orchestration deactivating.'));
            return deactivationResult;
        }
        const activationResult = await request.post({
            url: `${conn.instanceUrl}/services/data/v42.0/iot/orchestrations/${thisOrch.id}/activations`,
            body: {
                options
            },
            auth,
            json: true
        });
        this.ux.log(chalk.green('Orchestration activating.'));
        // wait for a sign that the context is active
        let orchActive = false;
        do {
            const newOrch = JSON.parse(
                await request.get(`${conn.instanceUrl}/services/data/v${version}/iot/orchestrations/${thisOrch.id}`, {
                    auth
                })
            );
            // this.ux.logJson(newOrch);
            if (newOrch.status === 'Active') {
                orchActive = true;
                this.ux.log(chalk.green('Orchestration is active.'));
                return newOrch;
            }
        } while (!orchActive);

        return activationResult;
    }
}
