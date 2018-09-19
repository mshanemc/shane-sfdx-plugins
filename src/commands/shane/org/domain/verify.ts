import { SfdxCommand } from '@salesforce/command';

export default class DomainVerify extends SfdxCommand {

  public static description = 'Verifies that a domain was successfully setup with MyDomain';

  public static examples = [
    'sfdx shane:org:domain:verify'
  ];

  protected static flagsConfig = {
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const authInfo = this.org.getConnection().getAuthInfoFields();
    this.ux.logJson(authInfo);

    if (authInfo.instanceUrl.match(/(.my.salesforce.com)/g)) {
      this.ux.log('Domain is good');
    } else {
      throw new Error(`Invalid instanceUrl: ${authInfo.instanceUrl}`);
    }

  }
}
