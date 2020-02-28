import { flags, SfdxCommand } from '@salesforce/command';
import { exec2JSON } from '../../../shared/execProm';
import { writeJSONasXML } from '../../../shared/JSONXMLtools';

import fs = require('fs-extra');

export default class ThemeActivate extends SfdxCommand {
    public static description = 'Activate a LightningExperienceTheme via metadata api.  Makes no permanent changes to local source';

    protected static requiresUsername = true;

    protected static flagsConfig = {
        name: flags.string({ char: 'n', required: true, description: 'name of the theme to activate' }),
        showbrowser: flags.boolean({
            char: 'b',
            description: 'show the browser...useful for local debugging',
            deprecated: { messageOverride: 'This flag is no longer used' }
        })
    };

    public async run(): Promise<any> {
        // create a local metadata settings file in a tempDir
        this.ux.startSpinner('creating local file');
        const tempDir = 'themeActivationTempFolder';
        await fs.ensureDir(`${tempDir}/main/default/settings`);

        const metaJSON = {
            '@': {
                xmlns: 'http://soap.sforce.com/2006/04/metadata'
            },
            activeThemeName: this.flags.name
        };

        await writeJSONasXML({
            path: `${tempDir}/main/default/settings/LightningExperience.settings-meta.xml`,
            json: metaJSON,
            type: 'LightningExperienceSettings'
        });

        this.ux.setSpinnerStatus('pushing to org');
        // deploy that to the org
        const deployResults = await exec2JSON(`sfdx force:source:deploy -p ${tempDir} --json`);

        // clean up local fs
        if (deployResults.status === 0) {
            this.ux.stopSpinner('theme activated in org');
        } else if (!this.flags.json) {
            this.ux.logJson(deployResults);
        }
        await fs.remove(tempDir);
        return deployResults;
    }
}
