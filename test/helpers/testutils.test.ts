/* tslint:disable:no-unused-expression */

import testutils = require('./testutils');
import { expect, test } from '@salesforce/command/dist/test';
import util = require('util');
import child_process = require('child_process');

const exec = util.promisify(child_process.exec);

const testProjectName = 'testProject';

before(async function() {
  this.timeout(600000);
  await exec(`rm -rf ${testProjectName}`);
  await exec(`sfdx force:project:create -n ${testProjectName}`);
});

describe('tests testUtils', () => {

  it('creates an org', async () => {
    const createResult = await testutils.orgCreate(testProjectName);
    expect(JSON.parse(createResult.stdout).status).to.equal(0);
    expect(JSON.parse(createResult.stdout).result.orgId).to.be.a('string');
  }).timeout(600000);

  it('deletes the org', async () => {
    const deleteResult = await testutils.orgDelete(testProjectName);
    expect(JSON.parse(deleteResult.stdout).status).to.equal(0);
  }).timeout(600000);

});

after(async function() {
  this.timeout(600000);
  await exec(`rm -rf ${testProjectName}`);
});
