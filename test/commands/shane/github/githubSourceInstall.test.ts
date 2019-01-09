/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import child_process = require('child_process');
import util = require('util');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);

const testProjectName = 'testProject';
const username = 'mshanemc';

describe('shane:github:src:install', () => {

  if (!process.env.LOCALONLY) {
    before(async () => {
      await exec(`rm -rf ${testProjectName}`);
      await exec(`sfdx force:project:create -n ${testProjectName}`);
      await testutils.orgCreate(testProjectName);
    });

    it('works with specified src folder', async () => {

      const repo = 'lightningErrorHandler';

      const results = await exec(`sfdx shane:github:src:install -g ${username} -r ${repo} -p src --json`, { cwd: testProjectName });

      // console.log(results);
      expect(results).to.be.an('object');
      expect(results.stdout).to.be.a('string');
      const stdout = JSON.parse(results.stdout);
      // console.log(stdout);
      // console.log(stdout.status);
      expect(stdout.status).to.equal(0);

    });

    after(async () => {
      await testutils.orgDelete(testProjectName);
      await exec(`rm -rf ${testProjectName}`);
    });
  }

});
