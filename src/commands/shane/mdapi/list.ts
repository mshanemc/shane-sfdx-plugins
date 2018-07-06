import { SfdxCommand } from '@salesforce/command';
import child_process = require('child_process');

export default class MetadataDescribe extends SfdxCommand {

  public static description = 'what\'s in the org?';

  public static examples = [
    `sfdx shane:mdapi:list -u someOrg -t CustomObject
// what metadata exists for a specific type
`
  ];

  protected static requiresUsername = true;

  protected static flagsConfig = {
    type: { required: true, type: 'string', char: 't', description: 'pull only a specific type.  See the metadata api docs for type names' }
  };

  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const conn = await this.org.getConnection();
    const apiVersion = await this.org.retrieveMaxApiVersion();
    const metadata = await conn.metadata.list([{ type: this.flags.type, folder: null }], apiVersion );
    this.ux.log(metadata);
  }
}
