/* tslint:disable:no-unused-expression */

import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');
import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);
const testProjectName = 'testProjectOrgReauth';

describe('shane:org:reauth', () => {
  if (!process.env.LOCALONLY) {

    jest.setTimeout(testutils.remoteTimeout);

    beforeAll(async () => {
      await fs.remove(testProjectName);
      await exec(`sfdx force:project:create -n ${testProjectName}`);
      await testutils.orgCreate(testProjectName);
    });

    afterEach( async () => {
      await exec('sfdx shane:org:delete', { cwd: testProjectName });
    });

    it('uses a simple org, not json', async () => {
      await exec('sfdx force:org:create -d 1 -s edition=Developer');
      const results = await exec('sfdx shane:org:reauth', { cwd: testProjectName });
      expect(results.stdout).toBeTruthy();
    });

    it('uses a simple org, with wait, not json', async () => {
      await exec('sfdx force:org:create -d 1 -s edition=Developer');
      const results = await exec('sfdx shane:org:reauth -r', { cwd: testProjectName });
      expect(results.stdout).toBeTruthy();
    });

    it('uses a simple org, with json', async () => {
      await exec('sfdx force:org:create -d 1 -s edition=Developer');
      const results = await exec('sfdx shane:org:reauth --json', { cwd: testProjectName });
      expect(results.stdout).toBeTruthy();
    });

    it('uses a simple org, with wait, with json', async () => {
      await exec('sfdx force:org:create -d 1 -s edition=Developer');
      const results = await exec('sfdx shane:org:reauth -r --json', { cwd: testProjectName });
      expect(results.stdout).toBeTruthy();
    });

    // it('uploads a file with a name', async () => {

    //   const results = await exec('sfdx shane:data:file:upload -f sfdx-project.json -n "sfdx project json file"', { cwd: testProjectName });
    //   expect(results.stdout).toContain('created file with content document id');
    // });

    // it('uploads a file with a name attached to a record', async () => {

    //   const newAcct = await exec('sfdx force:data:record:create -s Account -v "Name=Acme2" --json', { cwd: testProjectName });
    //   const results = await exec(`sfdx shane:data:file:upload -f sfdx-project.json -n "sfdx project json file" -p ${JSON.parse(newAcct.stdout).result.id}`, { cwd: testProjectName });
    //   expect(results.stdout).toContain('created regular file attachment on record');
    // });

    // it('uploads a file with a name attached to a record in chatter', async () => {

    //   const newAcct = await exec('sfdx force:data:record:create -s Account -v "Name=Acme2" --json', { cwd: testProjectName });
    //   const results = await exec(`sfdx shane:data:file:upload -f sfdx-project.json -n "sfdx project json file" -c -p ${JSON.parse(newAcct.stdout).result.id}`, { cwd: testProjectName });
    //   expect(results.stdout).toContain('created chatter file attachment on record');
    // });

    // it('fails chatter without a parentid', async () => {

    //   try {
    //     await exec('sfdx shane:data:file:upload -f sfdx-project.json -n "sfdx project json file" -c --json', { cwd: testProjectName });
    //   } catch (err) {
    //     expect(err.message).toContain('--parentid= must also be provided when using --chatter=');
    //   }
    // });

    afterAll(async () => {
      await fs.remove(testProjectName);
    });
  }
});
