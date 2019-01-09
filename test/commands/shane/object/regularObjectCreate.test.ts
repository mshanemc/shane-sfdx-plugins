/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import fs = require('fs-extra');
import util = require('util');

import child_process = require('child_process');

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
  }).timeout(1500);

  it('creates an object with all params supplied for a AutoNumber Name field', async () => {

    // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path
    const ANLabel = 'Sneltie';
    const ANPlural = 'Snelties';
    const ANAPI = 'Sneltie__c';

    await exec(`sfdx shane:object:create --type custom --label "${ANLabel}" --plural "${ANPlural}" --api ${ANAPI} --nametype AutoNumber --autonumberformat ${ANLabel}-{0} --sharingmodel ReadWrite`, { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}/fields`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}/${ANAPI}.object-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${ANAPI}/${ANAPI}.object-meta.xml`);

    expect(parsed.CustomObject).to.be.an('object');
    expect(parsed.CustomObject.deploymentStatus).to.equal('Deployed');
    expect(parsed.CustomObject.label).to.equal(ANLabel);
    expect(parsed.CustomObject.pluralLabel).to.equal(ANPlural);
    expect(parsed.CustomObject.eventType).to.be.undefined;
    expect(parsed.CustomObject.sharingModel).to.equal('ReadWrite');
    expect(parsed.CustomObject.nameField.type).to.equal('AutoNumber');

  }).timeout(1500);

  it('creates an object with all params supplied for a AutoNumber Name field and every option turned on', async () => {

    // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path
    const ANLabel = 'Shark';
    const ANPlural = 'Sharks';
    const ANAPI = 'Shark__c';

    await exec(`sfdx shane:object:create --type custom --label "${ANLabel}" --plural "${ANPlural}" --api ${ANAPI} --nametype AutoNumber --autonumberformat ${ANLabel}-{0} --sharingmodel ReadWrite --enterprise --history --activities --search --reports --feeds`, { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}/fields`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}/${ANAPI}.object-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${ANAPI}/${ANAPI}.object-meta.xml`);

    expect(parsed.CustomObject).to.be.an('object');
    expect(parsed.CustomObject.deploymentStatus).to.equal('Deployed');
    expect(parsed.CustomObject.label).to.equal(ANLabel);
    expect(parsed.CustomObject.pluralLabel).to.equal(ANPlural);
    expect(parsed.CustomObject.eventType).to.be.undefined;
    expect(parsed.CustomObject.sharingModel).to.equal('ReadWrite');
    expect(parsed.CustomObject.nameField.type).to.equal('AutoNumber');

    expect(parsed.CustomObject.enableActivities).to.equal('true');
    expect(parsed.CustomObject.enableBulkApi).to.equal('true');
    expect(parsed.CustomObject.enableFeeds).to.equal('true');
    expect(parsed.CustomObject.enableHistory).to.equal('true');
    expect(parsed.CustomObject.enableReports).to.equal('true');
    expect(parsed.CustomObject.enableSearch).to.equal('true');
    expect(parsed.CustomObject.enableSharing).to.equal('true');
    expect(parsed.CustomObject.enableStreamingApi).to.equal('true');

  }).timeout(1500);

  it('creates a Number field (18,0) on the Object', async () => {

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

    await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

  }).timeout(1500);

  it('creates a Text field on the Object', async () => {

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

    await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

  }).timeout(1500);

  it('creates a required text field on the Object', async () => {

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

    await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

  }).timeout(1500);

  it('creates a checkbox field on the Object', async () => {

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

    await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

  }).timeout(1500);

  it('creates a textArea field on the Object', async () => {

    const fieldAPI = 'Text_Area_Field__c';
    const fieldLabel = 'My Text Area Field';

    await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t LongTextArea --length 131072`, { cwd: testProjectName });
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

    expect(parsed.CustomField).to.be.an('object');
    expect(parsed.CustomField.type).to.equal('LongTextArea');
    expect(parsed.CustomField.label).to.equal(fieldLabel);
    expect(parsed.CustomField.fullName).to.equal(fieldAPI);
    expect(parsed.CustomField.visibleLines).to.equal('3');

    await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

  }).timeout(1500);

  // it('can build a permset', async () => {
  //   const permSetName = 'MyEventPerm';
  //   const permResult = await exec(`sfdx shane:permset:create -n ${permSetName} -o ${api}`, { cwd: testProjectName });

  //   expect(fs.existsSync(`${testProjectName}/force-app/main/default/permissionsets`)).to.be.true;
  //   expect(fs.existsSync(`${testProjectName}/force-app/main/default/permissionsets/${permSetName}.permissionset-meta.xml`)).to.be.true;

  //   // parse the permset
  //   const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/permissionsets/${permSetName}.permissionset-meta.xml`);

  //   // verify object
  //   expect(parsed.PermissionSet).to.be.an('object');
  //   expect(parsed.PermissionSet.objectPermissions).to.be.an('object');
  //   expect(parsed.PermissionSet.objectPermissions.object).to.equal(api);

  //   expect(parsed.PermissionSet.fieldPermissions).to.be.an('array');
  //   expect(parsed.PermissionSet.fieldPermissions.length).to.equal(3);

  //   // verify all the fields so far.  Required fields, and fileds required because they're indexed, shouldn't be included

  //   expect(parsed.PermissionSet.fieldPermissions).to.deep.include({ readable: 'true', editable: 'true', field: `${api}.Number_Field__c` });
  //   expect(parsed.PermissionSet.fieldPermissions).to.deep.include({ readable: 'true', editable: 'true', field: `${api}.Text_Field__c` });
  //   expect(parsed.PermissionSet.fieldPermissions).to.deep.include({ readable: 'true', editable: 'true', field: `${api}.Checkbox_Field__c` });

  //   expect(parsed.PermissionSet.fieldPermissions).to.not.deep.include({ readable: 'true', editable: 'true', field: `${api}.Required_Text_Field__c` });

  // });

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
