/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import { getExisting } from '../../../shared/getExisting';
import { writeJSONasXML } from '../../../shared/JSONXMLtools';

import fs = require('fs-extra');

export default class ListViewSecure extends SfdxCommand {
    public static description =
        'Find list views that are shared everywhere and makes them shared internally only.  Local source modification only--to use this command to fix an entire org, retrieve all your objects and then deploy the updated files';

    public static examples = [
        `sfdx shane:listview:secure -o Account
// add 'all internal users' sharing to any list view on Account without defined sharing
`,
        `sfdx shane:listview:secure
// add 'all internal users' sharing to any list view in local source without defined sharing
`
    ];

    protected static flagsConfig = {
        directory: flags.directory({
            char: 'd',
            default: 'force-app/main/default',
            description: 'Where is all this metadata? defaults to force-app/main/default'
        }),
        object: flags.directory({
            char: 'o',
            description: 'only modify list views for a single object.  Api name, including __c if custom'
        }),
        noprompt: flags.boolean({
            char: 'p',
            description: 'Do not prompt for confirmation'
        }),
        verbose: flags.builtin()
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        const objectsDirectory = `${this.flags.directory}/objects`;
        if (!(await fs.pathExists(objectsDirectory))) {
            throw new Error(`You have no local objects at ${objectsDirectory}.  Need to retrieve them from an org?`);
        }
        const objectsFolders = this.flags.object ? [this.flags.object] : await fs.readdir(objectsDirectory);
        let counter = 0;
        if (!this.flags.noprompt) {
            this.ux.log(`This will modify every list view that did not have sharing explicitly set on the following objects to 'All Internal Users'`);
            await this.ux.confirm(`type ${chalk.blue.bold('yes')} to continue`);
        }
        for (const objectFolder of objectsFolders) {
            // it may not have any listviews
            if (await fs.pathExists(`${objectsDirectory}/${objectFolder}/listViews`)) {
                const listViews = await fs.readdir(`${objectsDirectory}/${objectFolder}/listViews`);
                for (const listView of listViews) {
                    const listViewPath = `${objectsDirectory}/${objectFolder}/listViews/${listView}`;
                    const listViewJSON = await getExisting(listViewPath, 'ListView');
                    // only modify list views with no explicit sharing
                    if (!listViewJSON.sharedTo) {
                        await writeJSONasXML({
                            path: listViewPath,
                            json: {
                                ...listViewJSON,
                                sharedTo: [{ allInternalUsers: {} }]
                            },
                            type: 'ListView'
                        });
                        if (this.flags.verbose) {
                            this.ux.log(`modified:  ${listViewPath}`);
                        }
                        counter += 1;
                    } else if (this.flags.verbose) {
                        this.ux.log(`not modified:  ${listViewPath}`);
                    }
                }
            }
        }

        this.ux.log(`Modified ${counter} listviews (out of ${objectsFolders.length} objects) locally.`);
        this.ux.log(`Deploy to your org with ${chalk.blue.bold(`sfdx force:source:deploy -p ${objectsDirectory}`)}`);
    }
}
