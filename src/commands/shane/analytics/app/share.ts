import { flags, SfdxCommand } from '@salesforce/command';
import request = require('request-promise-native');

// import chalk from 'chalk';

export default class AnalyticsAppShare extends SfdxCommand {

  public static description = 'share an analytics app by name';

  public static examples = [
`sfdx shane:analytics:app:share -n SharedApp --allprm
// share the standard SharedApp with all partners view level perms (default)
`
  ];

  protected static flagsConfig = {
    name: flags.string({char: 'n', required: true, description: 'name of the analytics app' }),
    allprm: flags.boolean({description: 'share with all partner users' }),
    allcsp: flags.boolean({description: 'share with all customer portal users' }),
    org: flags.boolean({description: 'share with all internal users' }),
    type: flags.string({char: 't', default: 'View', description: 'access level', options: ['View', 'Edit', 'Manage']})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const conn = this.org.getConnection();
    const defaultRequest = {
      json : true,
      headers: {
        Authorization: `Bearer ${conn.accessToken}`
      }
    };

    const folders = await request({
      ...defaultRequest,
      uri: `${conn.instanceUrl}/services/data/v45.0/wave/folders`
    });
    // this.ux.logJson(folders);

    // match the folder from the list
    const foundFolder = folders.folders.find( folder => folder.name === this.flags.name);
    // this.ux.logJson(foundFolder);

    if (!foundFolder) {
      throw new Error(`no application by that name exists.  Folders: ${folders.folders.map( folder => folder.name).join(',')}`);
    }

    // get the applications's existing json > shares
    const retrievedFolder = await request({
      ...defaultRequest,
      uri: `${conn.instanceUrl}/services/data/v45.0/wave/folders/${foundFolder.id}`
    });

    // convert shareRepresentation to shareInputRepresentation
    let sharesToPatch = retrievedFolder.shares.map( share => {
      delete share.sharedWithLabel;
      delete share.imageUrl;
      return share;
    });

    if (this.flags.allprm) {
      sharesToPatch = [...sharesToPatch, {shareType : 'allprmusers', accessType: this.flags.type}];
    }

    // doesn't seem to work correctly, but might be my org not having csp users on?
    if (this.flags.allcsp) {
      sharesToPatch = [...sharesToPatch, {shareType : 'allcspusers', accessType: this.flags.type}];
    }
    if (this.flags.org) {
      sharesToPatch = [...sharesToPatch, {shareType : 'organization', accessType: this.flags.type}];
    }

    // this.ux.logJson(sharesToPatch);

    const patchResult = await request({
      ...defaultRequest,
      method: 'PATCH',
      body: { shares: sharesToPatch},
      uri: `${conn.instanceUrl}/services/data/v45.0/wave/folders/${foundFolder.id}`
    });

    if (!this.flags.json) {
      this.ux.logJson(patchResult);
    }

    return patchResult;

  }

}
