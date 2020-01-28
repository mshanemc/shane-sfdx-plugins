import { flags, SfdxCommand } from '@salesforce/command';

import chalk from 'chalk';
import { getExisting } from '../../../../shared/getExisting';
import { writeJSONasXML } from '../../../../shared/JSONXMLtools';

import fs = require('fs-extra');

export default class TSPUsernameUpdate extends SfdxCommand {
    public static description = 'change the username on all transaction security policies';

    public static examples = [
        `sfdx shane:tsp:username:update -n newusername@example.com
// updates the username for executionUser and all notifications in all transaction security policies
`,
        `sfdx shane:tsp:username:create
// updates the username for executionUser and all notifications in all transaction security policies to the default org's username
`,
        `sfdx shane:tsp:username:create -u someAlias
// updates the username for executionUser and all notifications in all transaction security policies to the specified target org's username
`
    ];

    protected static flagsConfig = {
        newusername: flags.email({ char: 'n', description: 'manually specify the username, ignoring your default or any -u' }),
        directory: flags.directory({
            char: 'd',
            default: 'force-app/main/default',
            description: 'Where is all this metadata? defaults to force-app/main/default'
        })
    };

    protected static requiresProject = true;

    protected static supportsUsername = true;

    public async run(): Promise<any> {
        const targetFolder = `${this.flags.directory}/transactionSecurityPolicies`;
        const finalUsername = this.flags.newusername ?? this.org.getUsername();

        if (!fs.existsSync(targetFolder)) {
            throw new Error(`Folder does not exist: ${targetFolder}`);
        }

        const policies = await fs.readdir(targetFolder);

        this.ux.log(`Updating ${policies.length} transaction security policies`);

        // loop through the policies and do execution user modification on all of them
        const UpdateResults = await Promise.all(policies.map(tsp => this.updateTsp({ targetFolder, tsp, finalUsername })));
        return UpdateResults;
    }

    async updateTsp({ targetFolder, tsp, finalUsername }) {
        let existing = await getExisting(`${targetFolder}/${tsp}`, 'TransactionSecurityPolicy');
        existing = { ...existing, executionUser: finalUsername };

        if (Array.isArray(existing.action.notifications)) {
            existing.action.notifications.forEach((notification, key) => {
                existing.action.notifications[key].user = finalUsername;
            });
        } else {
            existing.action.notifications.user = finalUsername;
        }
        await writeJSONasXML({
            type: 'TransactionSecurityPolicy',
            path: `${targetFolder}/${tsp}`,
            json: existing
        });
        this.ux.log(chalk.green(`Updated ${tsp}`));
        return existing;
    }
}
