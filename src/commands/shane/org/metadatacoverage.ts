import { SfdxCommand } from '@salesforce/command';
import * as stripcolor from 'strip-color';

import { exec } from '../../../shared/execProm';

export default class MetadataCoverage extends SfdxCommand {
    public static description = 'opens the metadata coverage report page';

    public static examples = [
        `sfdx shane:org:metadatacoverage
// opens /mdcoverage/report.jsp on the default scratch org
`,
        `sfdx shane:org:metadatacoverage -u someOrgAlias
// opens mdcoverage for specified org
`
    ];

    protected static flagsConfig = {};

    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        // required flags
        const command = `sfdx force:org:open --path /mdcoverage/report.jsp --json -u ${this.org.getUsername()}`;
        const response = await exec(command);
        this.ux.logJson(JSON.parse(stripcolor(response.stdout)));
        return response;
    }
}
