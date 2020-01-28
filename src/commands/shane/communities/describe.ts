import { flags, SfdxCommand } from '@salesforce/command';
import { getExternalApps } from '../../../shared/community';

import fs = require('fs-extra');

export default class CommunityDescribe extends SfdxCommand {
    public static description = 'tell me about the communities in the org, and optionally store the description';

    public static examples = ['sfdx shane:communities:describe'];

    protected static flagsConfig = {
        store: flags.boolean({ description: 'store the community description in externalApps.json' })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = await this.org.getConnection();
        const output = await getExternalApps(conn);

        if (this.flags.store) {
            await fs.writeJSON('externalApps.json', output, { spaces: 2 });
            this.ux.log('wrote networks to externalApps.json.');
        } else if (!this.flags.json) {
            this.ux.logJson(output);
        }

        return output;
    }
}
