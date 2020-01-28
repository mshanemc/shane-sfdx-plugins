import { flags, SfdxCommand } from '@salesforce/command';

import { exec } from '../../../shared/execProm';

import fs = require('fs-extra');

export default class Push extends SfdxCommand {
    public static description = 'convert and deploy the packaged source';

    public static examples = [
        `sfdx shane:mdapi:push -u someOrg
// convert to mdapi format and push to the given org
`
    ];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        convertedfolder: flags.directory({ char: 'd', description: 'where to store the mdapi-converted source', default: 'mdapiout' }),
        keepconverted: flags.boolean({ char: 'k', description: "Don't automatically delete the converted source" }),
        source: flags.directory({ char: 'r', default: 'force-app', description: "deploy a specific folder that's not force-app" }),
        deploymenttimelimit: flags.integer({ char: 'w', description: 'How many minutes to wait for the deployment to finish', default: 200 })
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        if (!fs.existsSync(this.flags.source)) {
            this.ux.error(`your source folder [${this.flags.source}] doesn't exist`);
        }
        await fs.ensureDir(this.flags.convertedfolder);
        this.ux.startSpinner('Starting source conversion');
        await exec(`sfdx force:source:convert -d ${this.flags.convertedfolder} -r ${this.flags.source}`);
        this.ux.setSpinnerStatus('done.  Deploying...');
        await exec(`sfdx force:mdapi:deploy -w ${this.flags.deploymenttimelimit} -d ${this.flags.convertedfolder} -u ${this.org.getUsername()}`);

        if (!this.flags.keepconverted) {
            this.ux.setSpinnerStatus('done.  Cleaning up...');
            await fs.remove(this.flags.convertedfolder);
        }
        this.ux.stopSpinner('Done');
    }
}
