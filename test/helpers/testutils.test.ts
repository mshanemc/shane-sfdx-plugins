/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import child_process = require('child_process');
import util = require('util');

import testutils = require('./testutils');

const exec = util.promisify(child_process.exec);

const testProjectName = 'testProject';

describe('tests testUtils', () => {

  before(async () => {
    await exec(`rm -rf ${testProjectName}`);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
  });

  it('creates an org', async () => {
    const createResult = await testutils.orgCreate(testProjectName);
    expect(JSON.parse(createResult.stdout).status).to.equal(0);
    expect(JSON.parse(createResult.stdout).result.orgId).to.be.a('string');
  });

  it('deletes the org', async () => {
    const deleteResult = await testutils.orgDelete(testProjectName);
    expect(JSON.parse(deleteResult.stdout).status).to.equal(0);
  });

  after(async () => {
    await exec(`rm -rf ${testProjectName}`);
  });

});
