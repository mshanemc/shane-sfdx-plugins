import { flags, SfdxCommand } from '@salesforce/command';
// import chalk from 'chalk';
import request = require('request-promise-native');

export default class RecordApi extends SfdxCommand {

  public static description = 'get a ui api response from the record-ui endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_record_ui.htm';

  public static examples = [
    `sfdx shane:uiapi:recordui -r 001R0000003I6CoIAK
// default ui-api response for a single recordId
`
  ];

  protected static flagsConfig = {
    recordid: flags.string({ char: 'r', description: 'single recordId to generate the data/metadata', exclusive: ['recordids'] }),
    recordids: flags.array({ description: 'array of recordIds to generate the data/metadata', exclusive: ['recordid']}),
    layouttypes: flags.array({char: 'l', options: ['Compact', 'Full'], description: 'which layout (only choose one)' }),
    modes: flags.array({char: 'm', options: ['Create', 'Edit', 'View'], description: 'which mode (only choose one)'})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const conn = this.org.getConnection();

    this.flags.apiversion = this.flags.apiversion || await conn.retrieveMaxApiVersion();
    let uri = `${conn.instanceUrl}services/data/v${this.flags.apiversion}/ui-api/record-ui`;
    if (this.flags.recordid) {
      uri = `${uri}/${this.flags.recordid}`;
    } else if (this.flags.recordids) {
      uri = `${uri}/${this.flags.recordids.join(',')}`;
    }
    console.log(uri);

    const result = await request({
      method: 'get',
      uri,
      headers: {
        Authorization: `Bearer ${conn.accessToken}`
      },
      json: true
    });

    console.log(result);
    }

}
