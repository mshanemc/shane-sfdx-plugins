import { SfdxCommand } from '@salesforce/command';
import child_process = require('child_process');
import * as stripcolor from 'strip-color';
import util = require('util');

const exec = util.promisify(child_process.exec);

export default class ComponentLibrary extends SfdxCommand {
    public static description = 'opens the lightning component library for the specified org';

    public static examples = [
        `sfdx shane:org:componentlibrary
// opens /componentReference/suite.app on the default scratch org
`,
        `sfdx shane:org:componentlibrary -u someOrgAlias
// opens library for specified org
`
    ];

    protected static flagsConfig = {};

    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        // required flags
        const command = `sfdx force:org:open --path /componentReference/suite.app --json -u ${this.org.getUsername()}`;
        const response = await exec(command);
        this.ux.logJson(JSON.parse(stripcolor(response.stdout)));
        return response;
    }
}
