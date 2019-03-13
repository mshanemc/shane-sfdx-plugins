/* tslint:disable:no-unused-expression */
import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);

const testProjectName = 'testProjectGithubSrcInstall';
const username = 'mshanemc';

describe('shane:github:src:install', () => {
  jest.setTimeout(testutils.remoteTimeout);

  if (!process.env.LOCALONLY) {
    beforeAll(async () => {
      await fs.remove(testProjectName);
      await exec(`sfdx force:project:create -n ${testProjectName}`);
      await testutils.orgCreate(testProjectName);
    });

    it('works with specified src folder', async () => {

      const repo = 'lightningErrorHandler';

      const results = await exec(`sfdx shane:github:src:install -g ${username} -r ${repo} -p src --json`, { cwd: testProjectName });

      // console.log(results);
      expect(results).toBeTruthy();
      expect(results.stdout).toBeTruthy();
      const stdout = JSON.parse(results.stdout);
      // console.log(stdout);
      // console.log(stdout.status);
      expect(stdout.status).toBe(0);

    });

    afterAll(async () => {
      await testutils.orgDelete(testProjectName);
      await fs.remove(testProjectName);
    });
  }

});
