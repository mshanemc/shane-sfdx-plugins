import { SfdxCommand } from '@salesforce/command';

import { exec2JSON } from '../../../shared/execProm';

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

    public async run(): Promise<any> {
        // required flags
        const command = `sfdx force:org:open --path /componentReference/suite.app --json -u ${this.org.getUsername()}`;
        const response = await exec2JSON(command);
        this.ux.logJson(response);
        return response;
    }
}
