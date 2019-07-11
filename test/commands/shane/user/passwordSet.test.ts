import child_process = require('child_process');
import fs = require('fs-extra');
import * as stripcolor from 'strip-color';
import util = require('util');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);
const testProjectName = 'testProjectUserPasswordSet';
const maxBuffer = 1000 * 1024;

describe('shane:user:password:set', () => {
  jest.setTimeout(testutils.remoteTimeout);

  if (!process.env.LOCALONLY) {
    beforeAll(async () => {
      await fs.remove(testProjectName);
      await exec(`sfdx force:project:create -n ${testProjectName}`);
      await testutils.orgCreate(testProjectName);
    });

    it('sets the password and verifies via force:org:display', async () => {
      const password = 'thePassw0rd';
      const result = await exec(`sfdx shane:user:password:set -l User -g User -p ${password} --json`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;
      expect(output.password).toBe(password);

      const displayResult = await exec('sfdx force:org:display --json', { cwd: testProjectName, maxBuffer });
      const displayResultJSON = JSON.parse(stripcolor(displayResult.stdout));
      expect(displayResultJSON.result.password).toBe(password);
    });

    afterAll(async () => {
      await testutils.orgDelete(testProjectName);
      await fs.remove(testProjectName);
    });
  }
});
