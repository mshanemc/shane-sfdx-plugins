import { SfdxCommand } from '@salesforce/command';
import ucc = require('../../../../shared/unzipConvertClean');

const tmpDir = 'mdapiout';

export default class XML extends SfdxCommand {

  public static description = 'gets metadata form an org based on a local package.xml, converts, and merges it into the local source';

  public static examples = [
`sfdx shane:mdapi:package:xml -p someFolder/package.xml -u someOrg
// pulls a metadat from the org and converts/merges it into force-app
`,
    `sfdx shane:mdapi:package:xml -p someFolder/package.xml -u someOrg -t someDir
// pulls a package from the org and converts/merges it into /someDir
`
  ];

  protected static requiresUsername = true;

  protected static flagsConfig = {
    xmlpath: { type: 'filepath', required: true, char: 'p', description: 'the location of the package.xml you want to use' },
    target: { type: 'string', char: 't', default: 'force-app', description: 'where to convert the result to...defaults to force-app' }
  };

  protected static requiresProject = true;

  // tslint:disable-next-line:no-any
  public async run(): Promise<any> {

    const retrieveCommand = `sfdx force:mdapi:retrieve -s -k "${this.flags.xmlpath}" -u ${this.org.getUsername()}  -r ./${tmpDir} -w 30`;
    await ucc.retrieveUnzipConvertClean(tmpDir, retrieveCommand, this.flags.target);

  }
}
