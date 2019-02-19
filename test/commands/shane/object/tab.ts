/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import fs = require('fs-extra');
import util = require('util');

import child_process = require('child_process');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);

const testProjectName = 'tabTest';
const api = 'Corgi__c';
const label = 'Corgi';
const plural = 'Corgi';

describe('shane:object:create (regular object flavor)', () => {

  before(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
  });

  it('creates an object with all params supplied for a Text Name', async () => {

    // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path

    await exec(`sfdx shane:object:create --type custom --label "${label}" --plural "${plural}" --api ${api} --nametype Text --sharingmodel ReadWrite`, { cwd: testProjectName });
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

    expect(parsed.CustomObject).to.be.an('object');
    expect(parsed.CustomObject.deploymentStatus).to.equal('Deployed');
    expect(parsed.CustomObject.label).to.equal(label);
    expect(parsed.CustomObject.pluralLabel).to.equal(plural);
    expect(parsed.CustomObject.eventType).to.be.undefined;
    expect(parsed.CustomObject.sharingModel).to.equal('ReadWrite');

    await exec(`sfdx shane:object:tab --object ${api} --icon 1`, { cwd: testProjectName });
    const parsedTab = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/tabs//${api}.tab-meta.xml`);
    expect(parsedTab.CustomTab).to.be.an('object');
    expect(parsedTab.CustomTab.customObject).to.equal('true');
    expect(parsedTab.CustomTab.mobileReady).to.equal('false');
    expect(parsedTab.CustomTab.motif).to.equal('Custom1: Heart');
  }).timeout(5000);

  it('deploys as valid code', async () => {
    if (process.env.LOCALONLY === 'true') {
      console.log('skipping online-only test');
    } else {
      const deploySuccess = await testutils.itDeploys(testProjectName);
      expect(deploySuccess).to.be.true;
    }
  });

  after(async () => {
    await fs.remove(testProjectName);
  });
});
