/* tslint:disable:no-unused-expression */

import { expect, test } from '@salesforce/command/dist/test';
import fs = require('fs-extra');
import util = require('util');
import xml2js = require('xml2js');

import child_process = require('child_process');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);

const testProjectName = 'testProject';
const api = 'Hello__e';
const label = 'Hello';
const plural = 'Hellos';

describe('shane:object:create (platform event flavor)', () => {

  before(async function() {
    await exec(`rm -rf ${testProjectName}`);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
  });

  it('creates a platform event with all params supplied', async () => {

    // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path

    await exec(`sfdx shane:object:create --label "${label}" --plural "${plural}" --api ${api}`, { cwd: testProjectName });
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

    expect(parsed.CustomObject).to.be.an('object');
    expect(parsed.CustomObject.deploymentStatus).to.equal('Deployed');
    expect(parsed.CustomObject.label).to.equal(label);
    expect(parsed.CustomObject.pluralLabel).to.equal(plural);
    expect(parsed.CustomObject.eventType).to.equal('StandardVolume');
  });

  it('creates a Number field (18,0) on the Event', async () => {

    const fieldAPI = 'Number_Field__c';
    const fieldLabel = 'Number Field';

    await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Number  --scale 0 --precision 18`, { cwd: testProjectName });
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

    expect(parsed.CustomField).to.be.an('object');
    expect(parsed.CustomField.type).to.equal('Number');
    expect(parsed.CustomField.label).to.equal(fieldLabel);
    expect(parsed.CustomField.fullName).to.equal(fieldAPI);
    expect(parsed.CustomField.precision).to.equal('18');
    expect(parsed.CustomField.scale).to.equal('0');

    const parsedObj = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

  });

  it('creates a Text field on the Event', async () => {

    const fieldAPI = 'Text_Field__c';
    const fieldLabel = 'My Text Field';

    await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -l 255 -n "${fieldLabel}" -t Text`, { cwd: testProjectName });
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

    expect(parsed.CustomField).to.be.an('object');
    expect(parsed.CustomField.type).to.equal('Text');
    expect(parsed.CustomField.label).to.equal(fieldLabel);
    expect(parsed.CustomField.fullName).to.equal(fieldAPI);
    expect(parsed.CustomField.length).to.equal('255');

    const parsedObj = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

  });

  it('creates a required text field on the Event', async () => {

    const fieldAPI = 'Required_Text_Field__c';
    const fieldLabel = 'My Text Field';

    await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -l 255 -n "${fieldLabel}" -t Text --required`, { cwd: testProjectName });
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

    expect(parsed.CustomField).to.be.an('object');
    expect(parsed.CustomField.type).to.equal('Text');
    expect(parsed.CustomField.label).to.equal(fieldLabel);
    expect(parsed.CustomField.fullName).to.equal(fieldAPI);
    expect(parsed.CustomField.length).to.equal('255');
    expect(parsed.CustomField.required).to.equal('true');

    const parsedObj = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

  });

  it('creates a checkbox field on the Event', async () => {

    const fieldAPI = 'Checkbox_Field__c';
    const fieldLabel = 'My Checkbox Field';

    await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Checkbox --default true`, { cwd: testProjectName });
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

    expect(parsed.CustomField).to.be.an('object');
    expect(parsed.CustomField.type).to.equal('Checkbox');
    expect(parsed.CustomField.label).to.equal(fieldLabel);
    expect(parsed.CustomField.fullName).to.equal(fieldAPI);
    expect(parsed.CustomField.defaultValue).to.equal('true');

    const parsedObj = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

  });

  it('can build a permset', async () => {
    const permSetName = 'MyEventPerm';
    const permResult = await exec(`sfdx shane:permset:create -n ${permSetName} -o ${api}`, { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/permissionsets`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/permissionsets/${permSetName}.permissionset-meta.xml`)).to.be.true;

    // parse the permset
    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/permissionsets/${permSetName}.permissionset-meta.xml`);

    // verify object
    expect(parsed.PermissionSet).to.be.an('object');
    expect(parsed.PermissionSet.objectPermissions).to.be.an('object');
    expect(parsed.PermissionSet.objectPermissions.object).to.equal(api);

    expect(parsed.PermissionSet.fieldPermissions).to.be.an('array');
    expect(parsed.PermissionSet.fieldPermissions.length).to.equal(3);

    // verify all the fields so far.  Required fields, and fileds required because they're indexed, shouldn't be included

    expect(parsed.PermissionSet.fieldPermissions).to.deep.include({ readable: 'true', editable: 'true', field: `${api}.Number_Field__c` });
    expect(parsed.PermissionSet.fieldPermissions).to.deep.include({ readable: 'true', editable: 'true', field: `${api}.Text_Field__c` });
    expect(parsed.PermissionSet.fieldPermissions).to.deep.include({ readable: 'true', editable: 'true', field: `${api}.Checkbox_Field__c` });

    expect(parsed.PermissionSet.fieldPermissions).to.not.deep.include({ readable: 'true', editable: 'true', field: `${api}.Required_Text_Field__c` });

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
