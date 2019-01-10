import { flags, SfdxCommand } from '@salesforce/command';
import child_process = require('child_process');
import fs = require('fs-extra');
import request = require('request-promise-native');
import { URL } from 'url';
import util = require('util');
import localFile2CV = require('../../../shared/localFile2CV');
import { QueryResult, Record } from './../../../shared/typeDefs';
const exec = util.promisify(child_process.exec);

import chalk from 'chalk';

const tempRepo = 'tempRepo';
const photoRepo = 'https://github.com/mshanemc/badProfilePhotos';

export default class AllPhotos extends SfdxCommand {

  public static description = 'set the chatter photos of anyone who has not set theirs already to encourage them to do so';

  public static examples = [
'sfdx shane:user:allphotos -u someAlias'
  ];

  protected static flagsConfig = {
    repo: flags.url({char: 'r', default: new URL(photoRepo), description: 'optional alternate repo of photos, which contains a folder of photos named /img' }),
    folder: flags.directory({char: 'f', description: 'optional local folder of photos.  Overrides --repo' })
  };

  protected static requiresUsername = true;
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();
    let users;

    try {
      users = <QueryResult> await conn.query('select id, FirstName, LastName, FullPhotoUrl from user where fullPhotoUrl like \'%/profilephoto/005/F%\'');
    } catch (e) {
      this.ux.error(chalk.red(e));
      throw new Error(e);
    }

    let photos;
    // get our bad profile photos
    if (this.flags.folder) {
      photos = await fs.readdir(this.flags.folder);
    } else {
      await exec(`git clone ${this.flags.repo} ${tempRepo}`);
      photos = await fs.readdir(`${tempRepo}/img`);
    }

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
