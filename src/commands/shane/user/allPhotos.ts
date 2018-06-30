import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import request = require('request-promise-native');
import localFile2CV = require('../../../shared/localFile2CV');
// import userIdLookup = require('../../../shared/userIdLookup');
import fs = require('fs-extra');
import util = require('util');
import child_process = require('child_process');

const exec = util.promisify(child_process.exec);

import chalk from 'chalk';

const tempRepo = 'tempRepo';
const photoRepo = 'https://github.com/mshanemc/badProfilePhotos';

export default class AllPhotos extends SfdxCommand {

  public static description = 'set the chatter photos of anyone who has not set theirs already to encourage them to do so';

  public static examples = [
'sfdx shane:user:allPhotos -u someAlias'
  ];

  protected static flagsConfig = {
    // firstName: flags.string({ char: 'g', description: 'first (given) name of the user--keeping -f for file for consistency' }),
    // lastName: flags.string({ char: 'l', required: true, description: 'last name of the user' }),
    // file: flags.string({ char: 'f', description: 'local path of the photo to use' }),
    // banner: flags.string({ char: 'b', description: 'local path of the chatter banner photo to use' })
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  // protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    // get the list of users without chatter photos
    interface QueryResult {
      totalSize: number;
      done: boolean;
      records: Record[];
    }

    interface Record {
      attributes: object;
      Id: string;
      ContentDocumentId?: string;
    }

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();
    // const query = 'Select Name, TrialExpirationDate from Organization';
    let users;

    try {
      users = <QueryResult> await conn.query('select id, FirstName, LastName, FullPhotoUrl from user where fullPhotoUrl like \'%/profilephoto/005/F%\'');
    } catch (e) {
      this.ux.error(chalk.red(e));
      throw new Error(e);
    }

    // get our bad profile photos
    await exec(`git clone ${photoRepo} ${tempRepo}`);
    const photos = await fs.readdir(`${tempRepo}/img`);

    const options = {
      method: 'POST',
      json: true,
      body: {},
      uri: '',
      headers: {
        Authorization: `Bearer ${conn.accessToken}`
      }
    };

    users.records.forEach(async (user, index) => {
      this.ux.log(`going to upload ${photos[index % photos.length]} for ${user.FirstName} ${user.LastName}`);
      const photoCV = <Record> await localFile2CV.file2CV(conn, `${tempRepo}/img/${photos[ Math.floor(Math.random() * photos.length) ]}`);
      options.uri = `${conn.instanceUrl}/services/data/v42.0/connect/user-profiles/${user.Id}/photo`;
      options.body = {
        fileId: photoCV.ContentDocumentId
      };
      const photoResult = await request(options);
      this.ux.logJson(photoResult);
    });

    await exec(`rm -rf ${tempRepo}`);

  }
}
