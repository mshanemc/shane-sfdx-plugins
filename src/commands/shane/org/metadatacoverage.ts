import { SfdxCommand } from '@salesforce/command';

import { exec2JSON } from '../../../shared/execProm';

export default class MetadataCoverage extends SfdxCommand {
    public static description = 'opens the metadata coverage report page';

    public static examples = [
        `sfdx shane:org:metadatacoverage
// opens /mdcoverage/report.jsp on the default scratch org
`,
        `sfdx shane:org:metadatacoverage -u someOrgAlias
// opens report for specified org
`
    ];

    protected static flagsConfig = {};

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        // required flags
        const command = `sfdx force:org:open --path /mdcoverage/report.jsp --json -u ${this.org.getUsername()}`;
        const response = await exec2JSON(command);
        this.ux.logJson(response);
        return response;
    }
}
