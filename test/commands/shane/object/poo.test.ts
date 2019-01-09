/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);

const testProjectName = 'testProject';
const api = 'Corgi__c';
const label = 'Corgi';
const plural = 'Corgi';

describe('shane:object:create (regular object flavor)', () => {

  before(async () => {
    await exec(`rm -rf ${testProjectName}`);
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
  });

  it('adds poo on custom object', async () => {

    const apiname = 'Power_Of_One__c';
    const fieldLabel = 'Power Of One';

    await exec(`sfdx shane:object:powerofone -o ${api}`, { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${apiname}.field-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${apiname}.field-meta.xml`);

    expect(parsed.CustomField).to.be.an('object');
    expect(parsed.CustomField.unique).to.equal('false');
    expect(parsed.CustomField.type).to.equal('Number');
    expect(parsed.CustomField.precision).to.equal('18');
    expect(parsed.CustomField.fullName).to.equal(apiname);
    expect(parsed.CustomField.label).to.equal(fieldLabel);
  });

  it('adds poo on standard object that is not local', async () => {

    const apiname = 'Power_Of_One__c';
    const fieldLabel = 'Power Of One';

    await exec('sfdx shane:object:powerofone -o Account', { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Account`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Account/fields`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Account/fields/${apiname}.field-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/Account/fields/${apiname}.field-meta.xml`);

    expect(parsed.CustomField).to.be.an('object');
    expect(parsed.CustomField.unique).to.equal('false');
    expect(parsed.CustomField.type).to.equal('Number');
    expect(parsed.CustomField.precision).to.equal('18');
    expect(parsed.CustomField.fullName).to.equal(apiname);
    expect(parsed.CustomField.label).to.equal(fieldLabel);
  });

  it('adds poo on standard object with custom name/label and apply __c', async () => {

    const apiname = 'Poo';
    const fieldLabel = 'The Poo field';

    await exec(`sfdx shane:object:powerofone -o Case -l "${fieldLabel}" -a "${apiname}"`, { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Case`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Case/fields`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Case/fields/${apiname}__c.field-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/Case/fields/${apiname}__c.field-meta.xml`);

    expect(parsed.CustomField).to.be.an('object');
    expect(parsed.CustomField.unique).to.equal('false');
    expect(parsed.CustomField.type).to.equal('Number');
    expect(parsed.CustomField.precision).to.equal('18');
    expect(parsed.CustomField.fullName).to.equal(`${apiname}__c`);
    expect(parsed.CustomField.label).to.equal(fieldLabel);
  });

  it('deploys as valid code', async () => {
    if (process.env.LOCALONLY === 'true') {
      console.log('skipping online-only test');
    } else {
      const deploySuccess = await testutils.itDeploys(testProjectName);
      expect(deploySuccess).to.be.true;
    }
  });

  after(async () => {
    await exec(`rm -rf ${testProjectName}`);
  });
});
