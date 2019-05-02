import { flags, SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');
import request = require('request-promise-native');

export default class Record extends SfdxCommand {

  public static description = 'get a ui api response from the getrecord endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_record_get.htm';

  public static examples = [
    `sfdx shane:uiapi:record -r 001R0000003I6CoIAK -f Account.Name --optionalfields Account.AnnualRevenue,AccountAccount.Number --json
// default ui-api response for a getrecord.
`
  ];

  protected static flagsConfig = {
    recordid: flags.string({ char: 'r', description: 'single recordId to generate the data/metadata', required: true }),
    fields: flags.array({ char: 'f', required: true, description: 'fields to return.  Specify with the object API name, like Account.Name, Account.Phone, etc.  If not visible to the running user, an error is thrown'}),
    optionalfields: flags.array({ description: 'optional fields to return.  If not visible to the running user, the field is just omitted' }),
    outputfile: flags.filepath({ description: 'local path to save the output to' })
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const conn = this.org.getConnection();

    this.flags.apiversion = this.flags.apiversion || await conn.retrieveMaxApiVersion();
    let uri = `${conn.instanceUrl}/services/data/v${this.flags.apiversion}/ui-api/records/${this.flags.recordid}`;

    if (this.flags.fields) {
      if (uri.includes('?')) {
        uri = `${uri}&fields=${this.flags.fields.join(',')}`;
      } else {
        uri = `${uri}?fields=${this.flags.fields.join(',')}`;
      }
    }

    if (this.flags.optionalfields) {
      if (uri.includes('?')) {
        uri = `${uri}&optionalFields=${this.flags.optionalfields.join(',')}`;
      } else {
        uri = `${uri}?optionalFields=${this.flags.optionalfields.join(',')}`;
      }
    }

    const result = await request({
      method: 'get',
      uri,
      headers: {
        Authorization: `Bearer ${conn.accessToken}`
      },
      json: true
    });
    this.ux.log(result);

    if (this.flags.outputfile) {
      await fs.outputJSON(this.flags.outputfile, result);
    }

    return result;
  }

}
