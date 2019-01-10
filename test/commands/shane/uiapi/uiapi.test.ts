/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);
const testProjectName = 'testProject';
const maxBuffer = 1000 * 1024;

describe('shane:uiapi', () => {

  let recordId: string;
  let recordIds: string[];

  if (true) {
    before(async () => {
      await exec(`rm -rf ${testProjectName}`);
      await exec(`sfdx force:project:create -n ${testProjectName}`);
      // set up an org
      const configFileLocation = `${testProjectName}/config/project-scratch-def.json`;
      const config = fs.readJSONSync(configFileLocation);
      config.hasSampleData = true;
      fs.writeJSONSync(configFileLocation, config);

      await testutils.orgCreate(testProjectName);

      const { stdout } = await exec('sfdx force:data:soql:query -q "select id from account" --json', { cwd: testProjectName });
      const accounts = JSON.parse(stdout).result.records;
      expect(accounts).to.be.an('array');
      expect(accounts[0]).to.have.property('Id');

      recordId = accounts[0].Id;
      recordIds = accounts.map(account => account.Id);

      expect(recordId).to.be.a('string');
      expect(recordIds).to.be.an('array');
      expect(recordIds.length).to.equal(accounts.length);
    });

    it('tests recordui with single recordId', async () => {
      const result = await exec(`sfdx shane:uiapi:recordui -r ${recordId} --json`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;

      looksValidSingleRecordUI(output);
    });

    it('tests recordui with single and multiple layouts', async () => {
      const result = await exec(`sfdx shane:uiapi:recordui -r ${recordId} --json -l Compact`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;

      looksValidSingleRecordUI(output);
    });

    it('tests recordui with single recordid and single mode', async () => {
      const result = await exec(`sfdx shane:uiapi:recordui -r ${recordId} --json -m View`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;

      looksValidSingleRecordUI(output);
    });

    it('tests recordui with single recordid and single mode and layout', async () => {
      const result = await exec(`sfdx shane:uiapi:recordui -r ${recordId} --json -m View -l Full`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;

      looksValidSingleRecordUI(output);
    });

    it('tests recordui with single recordid and multiple modes and layouts', async () => {
      const result = await exec(`sfdx shane:uiapi:recordui -r ${recordId} --json -m View,Create,Edit -l Full,Compact`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;

      looksValidSingleRecordUI(output);
    });

    it('tests recordui with single recordid and multiple modes', async () => {
      const result = await exec(`sfdx shane:uiapi:recordui -r ${recordId} --json -m Create`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;

      looksValidSingleRecordUI(output);
    });

    it('tests recordui with list of recordIds', async () => {
      const result = await exec(`sfdx shane:uiapi:recordui -r ${recordIds.join(',')} --json`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;
      looksValidMultipleRecordUI(output);
    });

    it('tests recordui with list of recordIds and layout', async () => {
      const result = await exec(`sfdx shane:uiapi:recordui -r ${recordIds.join(',')} --json -l Full`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;
      looksValidMultipleRecordUI(output);
    });

    it('tests recordui with list of recordIds and mode', async () => {
      const result = await exec(`sfdx shane:uiapi:recordui -r ${recordIds.join(',')} --json -m Create`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;
      looksValidMultipleRecordUI(output);
    });

    it('tests objectinfo', async () => {
      const apiName = 'Account';
      const result = await exec(`sfdx shane:uiapi:objectinfo -o ${apiName} --json`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;
      expect(output).to.be.an('object').with.property('apiName').equals('Account');
      expect(output).to.be.an('object').with.property('eTag');
      expect(output).to.be.an('object').with.property('fields');
    });

    it('tests getrecord', async () => {
      const result = await exec(`sfdx shane:uiapi:record -r ${recordId} -f Account.Name --json`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;
      looksValidRecord(output);
    });

    it('tests getrecord with optional fields', async () => {
      const result = await exec(`sfdx shane:uiapi:record -r ${recordId} -f Account.Name --optionalfields Account.AnnualRevenue,AccountAccount.Number --json`, { cwd: testProjectName, maxBuffer });
      const output = JSON.parse(result.stdout).result;
      looksValidRecord(output);
    });

    const looksValidRecord = output => {
      expect(output.eTag).to.be.a('string');
      expect(output.apiName).to.equal('Account');
      expect(output.fields).to.be.an('object').with.property('Name');
    };

    const looksValidSingleRecordUI = output => {
      expect(output.eTag).to.be.a('string');
      expect(output.records).to.be.an('object').with.property(recordId);
      expect(output.objectInfos).to.be.an('object').with.property('Account');
    };

    const looksValidMultipleRecordUI = output => {
      expect(output.eTag).to.be.a('string');
      recordIds.forEach(id => {
        expect(output.records).to.be.an('object').with.property(id);
      });
      expect(output.objectInfos).to.be.an('object').with.property('Account');
    };

    after(async () => {
      await testutils.orgDelete(testProjectName);
      await exec(`rm -rf ${testProjectName}`);
    });

  }

});
