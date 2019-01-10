import { flags, SfdxCommand } from '@salesforce/command';
// import chalk from 'chalk';
import request = require('request-promise-native');

export default class ObjectInfo extends SfdxCommand {

  public static description = 'get a ui api response from the objectinfo endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_object_info.htm';

  public static examples = [
    `sfdx shane:uiapi:objectinfo -o Account --json
// returns ui-api objectinfo for Account
`
  ];

  protected static flagsConfig = {
    object: flags.string({ char: 'o', description: 'object api name' })
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const conn = this.org.getConnection();

    this.flags.apiversion = this.flags.apiversion || await conn.retrieveMaxApiVersion();
    const uri = `${conn.instanceUrl}services/data/v${this.flags.apiversion}/ui-api/object-info/${this.flags.object}`;

    const result = await request({
      method: 'get',
      uri,
      headers: {
        Authorization: `Bearer ${conn.accessToken}`
      },
      json: true
    });
    this.ux.log(result);
    return result;
  }

}
