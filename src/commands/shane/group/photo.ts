import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import request = require('request-promise-native');
import localFile2CV = require('../../../shared/localFile2CV');
import { QueryResult, Record } from './../../../shared/typeDefs';

export default class Photo extends SfdxCommand {

  public static description = 'Set the photo for a user by first/last name';

  public static examples = [
`sfdx shane:group:photo -g AwesomePeople -f ~/Downloads/King.png
// sets the chatter photo for the group named AwesomePeople using the local file
`,
`sfdx shane:user:photo -b ~/Downloads/King.png -g AwesomePeople
// sets the chatter banner photo for the group named AwesomePeople using the local file
`
  ];

  protected static flagsConfig = {
    group: flags.string({char: 'g', description: 'first (given) name of the user--keeping -f for file for consistency'}),
    file: flags.filepath({char: 'f', description: 'local path of the photo to use', exclusive: ['banner']}),
    banner: flags.filepath({char: 'b', description: 'local path of the chatter banner photo to use', exclusive: ['file']})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  // protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    // const name = this.flags.name || 'world';

    // potential errors
    if (!this.flags.file && !this.flags.banner) {
      this.ux.error(chalk.red('you have to supply either --banner or --file'));
    }

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();
    // const query = 'Select Name, TrialExpirationDate from Organization';
    let group;

    try {
      const groups = <QueryResult> await conn.query(`select id from CollaborationGroup where name = '${this.flags.group}'`);
      if (groups.totalSize > 1) {
        throw new Error('There are more than 1 result for that name.');
      } else if (groups.totalSize === 0) {
        throw new Error('User not found');
      } else {
        group = groups.records[0];
      }
    } catch (e) {
      this.ux.error(chalk.red(e));
      throw new Error (e);
    }

    this.ux.log(`found group with id ${group.Id}`);

    // still here?  you must be doing an attachment
    const options = {
      method: 'POST',
      uri: `${conn.instanceUrl}/services/data/v42.0/chatter/groups/${group.Id}/photo`,
      json: true,
      body: {},
      headers: {
        Authorization: `Bearer ${conn.accessToken}`
      }
    };

    if (this.flags.file) {
      const photoCV = <Record> await localFile2CV.file2CV(conn, this.flags.file);
      options.uri = `${conn.instanceUrl}/services/data/v42.0/chatter/groups/${group.Id}/photo`;
      options.body = {
        fileId: photoCV.ContentDocumentId
      };
      const photoResult = await request(options);
      return photoResult;
    } else if (this.flags.banner) {
      const bannerCV = <Record> await localFile2CV.file2CV(conn, this.flags.banner);
      options.uri = `${conn.instanceUrl}/services/data/v42.0/chatter/groups/${group.Id}/banner-photo`;
      options.body = {
        fileId: bannerCV.ContentDocumentId
      };
      const bannerResult = await request(options);
      return bannerResult;
    }
  }
}
