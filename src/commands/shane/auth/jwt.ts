import { flags, SfdxCommand } from '@salesforce/command';
// import { AuthInfo } from '@salesforce/core';
// import child_process = require('child_process');
import fs = require('fs-extra');
// import * as stripcolor from 'strip-color';
import { URL } from 'url';
import { getJWTToken } from './salesforce-jwt-promise';

// import util = require('util');

// const exec = util.promisify(child_process.exec);
// const retrySeconds = 20;
// const maxTries = 120;

export default class AuthJWT extends SfdxCommand {

  public static description = 'authenticates an org with jwt';

  public static examples = [
    // `sfdx shane:org:reauth
    // // reauths, and takes what it can get
    // `,
    // `sfdx shane:org:reauth --requirecustomdomain
    // // will try each minute, up to 60 minutes, until an org with a valid mydomain is ready
    // `
  ];

  protected static flagsConfig = {
    instanceurl: flags.url({description: 'manually specify the instance url', default: new URL('https://test.salesforce.com')}),
    clientid: flags.string({char: 'i', description: 'connected app client id', required: true}),
    jwtkeyfile: flags.filepath({char: 'f', description: 'path to the certificate file', required: true}),
    setalias: flags.string({ char: 'a', description: 'set an alias for the authenticated org'}),
    setdefaultusername: flags.boolean({ char: 's', description: 'set the authenticated org as the default username that all commands run against'})
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    if (!this.flags.username) {
      this.flags.username = await this.org.getUsername();
    }

    if (!fs.existsSync(this.flags.jwtkeyfile)) {
      throw new Error(`key file not found: ${this.flags.jwtkeyfile}`);
    }
    const privateKey = await fs.readFile(this.flags.jwtkeyfile, 'utf8');
    const tokenResult = await getJWTToken({
      clientId: this.flags.clientid,
      privateKey,
      userName: this.flags.username,
      audience: this.flags.instanceurl.toString().replace(/\/$/, '')
    });

    this.ux.logJson(tokenResult);
    // save all the bits to local sfdx auth store
  }
}
