import { flags, SfdxCommand } from '@salesforce/command';

import ucc = require('../../../../shared/unzipConvertClean');

const tmpDir = 'mdapiout';

export default class Get extends SfdxCommand {
    public static description = 'gets package from an org, converts, and merges it into the local source';

    public static examples = [
        `sfdx shane:mdapi:package:get -p MyPkg -u someOrg
// pulls a package from the org and converts/merges it into force-app
`,
        `sfdx shane:mdapi:package:get -p MyPkg -u someOrg -t someDir
// pulls a package from the org and converts/merges it into /someDir
`
    ];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        packagename: flags.string({ required: true, char: 'p', description: 'the name of the package you want to retrieve' }),
        target: flags.directory({ char: 't', default: 'force-app', description: 'where to convert the result to...defaults to force-app' })
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        const retrieveCommand = `sfdx force:mdapi:retrieve -s -p "${this.flags.packagename}" -u ${this.org.getUsername()}  -r ./${tmpDir} -w 30`;
        await ucc.retrieveUnzipConvertClean(tmpDir, retrieveCommand, this.flags.target);
    }
}
