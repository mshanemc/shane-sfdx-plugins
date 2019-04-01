/* tslint:disable:no-unused-expression */

import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');
import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);
const testProjectName = 'testProjectOrgReauth';

describe('shane:org:reauth', () => {
  if (!process.env.LOCALONLY) {
    jest.setTimeout(testutils.remoteTimeout * 4); // reauth can really slow things down

    beforeAll(async () => {
      await fs.remove(testProjectName);
      await exec(`sfdx force:project:create -n ${testProjectName}`);
      // console.log('beforeAll done');
    });

    afterEach( async () => {

      await exec('sfdx shane:org:delete', { cwd: testProjectName });
      // console.log('deleted an org');
    });

    it('uses a simple org, not json', async () => {
      await exec('sfdx force:org:create -d 1 -s edition=Developer', { cwd: testProjectName });
      const results = await exec('sfdx shane:org:reauth', { cwd: testProjectName });
      expect(results.stdout).toBeTruthy();
    });

    it('uses a simple org, with wait, not json', async () => {
      await exec('sfdx force:org:create -d 1 -s edition=Developer', { cwd: testProjectName });
      const results = await exec('sfdx shane:org:reauth -r', { cwd: testProjectName });

      expect(results.stdout).toBeTruthy();
    });

    it('uses a simple org, with json', async () => {
      await exec('sfdx force:org:create -d 1 -s edition=Developer', { cwd: testProjectName });
      const results = await exec('sfdx shane:org:reauth --json', { cwd: testProjectName });

      expect(results.stdout).toBeTruthy();
    });

    it('uses a simple org, with wait, with json', async () => {
      await exec('sfdx force:org:create -d 1 -s edition=Developer', { cwd: testProjectName });
      const results = await exec('sfdx shane:org:reauth -r --json', { cwd: testProjectName });

      expect(results.stdout).toBeTruthy();
    });

    afterAll(async () => {
      await fs.remove(testProjectName);
    });
  }
});
