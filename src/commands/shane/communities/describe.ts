import { flags, SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');

export default class CommunityDescribe extends SfdxCommand {

  public static description = 'tell me about the communities in the org, and optionally store the description';

  public static examples = [
'sfdx shane:communities:describe'
  ];

  protected static flagsConfig = {
    store: flags.boolean({description: 'store the community description in externalApps.json' })
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const conn = this.org.getConnection();

    // tslint:disable-next-line:no-any
    const output: any = {
      communities: {}
    };

    // get the domain
    const domains = await conn.query('select CnameTarget, Domain from Domain');
    const mainDomain: any = domains.records.find( (domain: any) => domain.CnameTarget === null); // tslint:disable-line:no-any
    output.domain = mainDomain.Domain;
    // get the networks

    const networks = await conn.query('select id, Name, status, UrlPathPrefix from Network where UrlPathPrefix != null');

    networks.records.forEach( (network: any) => { // tslint:disable-line:no-any
      output.communities[network.UrlPathPrefix] = network.Name;
    });

    if (this.flags.store) {
      await fs.writeJSON('externalApps.json', output, {spaces: 2});
      this.ux.log('wrote networks to externalApps.json.');
    } else if (!this.flags.json) {
      this.ux.logJson(output);
    }

    return output;

  }

}
