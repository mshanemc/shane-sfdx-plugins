import { SfdxCommand } from '@salesforce/command';
import { AuthInfo } from '@salesforce/core';
import * as assert from 'assert';
import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');

const exec = util.promisify(child_process.exec);

export default class ScratchOrgReAuth extends SfdxCommand {

  public static description = 'reauthenticates (generates a new authinfo) for a scratch org, optionally insisting on custom domain being ready.  Requires a hub';

  public static examples = [
    `sfdx shane:org:reauth
    // reauths, and takes what it can get
    `,
    `sfdx shane:org:reauth --requirecustomdomain
    // will try each minute, up to 60 minutes, until an org with a valid mydomain is ready
    `
  ];

  protected static flagsConfig = {
    requirecustomdomain: { type: 'boolean', char: 'r', description: 'keep trying until you get back an org with a custom domain on it' }
  };

  protected static requiresUsername = true;
  protected static requiresDevhubUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const username = this.org.getUsername();

    const maxTries = 60;
    const hubInfo = this.hubOrg.getConnection().getAuthInfoFields();

    // validate that this'll work for jwt
    assert.ok(hubInfo.privateKey, 'private key not present...did you use jwt auth flow?');
    assert.ok(hubInfo.clientId, 'clientId not present...did you use jwt auth flow?');
    assert.ok(hubInfo.isDevHub, 'not a valid dev hub');
    assert.ok(fs.existsSync(hubInfo.privateKey), `key is part of hub auth, but does not exist on local filesystem: ${hubInfo.privateKey}`);

    let keepTrying = this.flags.requirecustomdomain;
    let tryCounter = 0;

    const timeout = ms => new Promise(res => setTimeout(res, ms));

    do {

      tryCounter++;
      try {
        // await exec(`sfdx force:auth:logout -u ${username} -p`);
        AuthInfo.clearCache(username);
        const result = await exec(`sfdx force:auth:jwt:grant --json --clientid ${hubInfo.clientId} --username ${username} --jwtkeyfile ${hubInfo.privateKey} --instanceurl https://test.salesforce.com -s`);
      } catch (err) {
        if (err.message.includes('This org appears to have a problem with its OAuth configuration')) {
          console.log('login not available yet.');
        } else if (err.message.includes('This command requires a scratch org username set either with a flag or by default in the config.')) {
          console.log('no default scratch org username set');
        } else {
          console.log(err.message);
          keepTrying = false;
        }
        // this.ux.log(`error: ${JSON.parse(loginResult.stdout).message}`);
      }

      const auth = await AuthInfo.create(username);
      const authFields = auth.getFields();

      this.ux.logJson(authFields);

      if (authFields.instanceUrl.match(/(.my.salesforce.com)/g)) {
        this.ux.log(`domain is ${authFields.instanceUrl}`);
        keepTrying = false;
      } else if (this.flags.requirecustomdomain) {
        this.ux.log(`domain was ${authFields.instanceUrl}.  Pausing to wait 1 minute before checking domain again (${tryCounter}/${maxTries})`);
        await timeout(60000);
      } else {
        this.ux.logJson(authFields);
        return authFields;
      }

    } while (keepTrying && tryCounter < maxTries);

  }
}
