/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import util = require('util');

import child_process = require('child_process');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);
const testProjectName = 'testProject';
const username = 'mshanemc';

describe('shane:github:package:install', () => {

  before(async () => {
    await exec(`rm -rf ${testProjectName}`);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
    await testutils.orgCreate(testProjectName);
  });

  it('works with the old latestVersion.json format', async () => {

    const repo = 'lightningErrorHandler';
    const results = await exec(`sfdx shane:github:package:install -g ${username} -r ${repo} --json`, { cwd: testProjectName });

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

});
