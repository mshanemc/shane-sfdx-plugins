/* tslint:disable:no-unused-expression */

import { expect, test } from '@salesforce/command/dist/test';
import fs = require('fs-extra');
import util = require('util');
import xml2js = require('xml2js');

import child_process = require('child_process');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);
const testProjectName = 'testProject';

describe('shane:data:file:upload', () => {

  before(async () => {
    await exec(`rm -rf ${testProjectName}`);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
    await testutils.orgCreate(testProjectName);
  });

  it('uploads a file simply', async () => {

    const results = await exec('sfdx shane:data:file:upload -f sfdx-project.json', { cwd: testProjectName });
    console.log(results);
    // console.log(results);
    // expect(results).to.be.an('object');
    // expect(results.stdout).to.be.a('string');
    // const stdout = JSON.parse(results.stdout);
    // // console.log(stdout);
    // // console.log(stdout.status);
    // expect(stdout.status).to.equal(0);

  });

  it('uploads a file with a name', async () => {

    const results = await exec('sfdx shane:data:file:upload -f sfdx-project.json -n "sfdx project json file"', { cwd: testProjectName });
    console.log(results);
    // console.log(results);
    // expect(results).to.be.an('object');
    // expect(results.stdout).to.be.a('string');
    // const stdout = JSON.parse(results.stdout);
    // // console.log(stdout);
    // // console.log(stdout.status);
    // expect(stdout.status).to.equal(0);

  });

  after(async () => {
    await testutils.orgDelete(testProjectName);
    await exec(`rm -rf ${testProjectName}`);
  });
});
