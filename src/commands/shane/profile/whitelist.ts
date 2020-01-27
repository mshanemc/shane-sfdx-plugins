import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');

import { getExisting } from '../../../shared/getExisting';
import { setupArray } from '../../../shared/setupArray';
import { writeJSONasXML } from '../../../shared/JSONXMLtools';

export default class ProfileWhitelist extends SfdxCommand {
    public static description = 'whitelist the whole internet for a profile (no ip verification or 2FA/OTP challenges in dev)';

    public static examples = [
        `sfdx shane:profile:whitelist -n Admin
// add loginIpRanges of 0.0.0.0 to 255.255.255.255 to an existing profile, or create one if it doesn't exist
`
    ];

    protected static flagsConfig = {
        name: flags.string({ char: 'n', required: true, description: 'profile name' }),
        directory: flags.directory({
            char: 'd',
            default: 'force-app/main/default',
            description: 'Where is all this metadata? defaults to force-app/main/default'
        })
    };

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        await fs.ensureDir(`${this.flags.directory}/profiles`);
        const targetProfile = `${this.flags.directory}/profiles/${this.flags.name}.profile-meta.xml`;

        let existing = setupArray(
            await getExisting(targetProfile, 'Profile', {
                '@': {
                    xmlns: 'http://soap.sforce.com/2006/04/metadata'
                }
            }),
            'loginIpRanges'
        );

        existing.loginIpRanges.push({
            description: 'the whole internet',
            startAddress: '0.0.0.0',
            endAddress: '255.255.255.255'
        });

        await writeJSONasXML({
            type: 'Profile',
            path: targetProfile,
            json: existing
        });

        this.ux.log(chalk.green(`Whitelisted ${targetProfile} locally`) + '...next, push or deploy to an org.');
        return existing; // for someone who wants the JSON?
    }
}
