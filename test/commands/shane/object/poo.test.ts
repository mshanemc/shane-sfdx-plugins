/* tslint:disable:no-unused-expression */

import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);

const testProjectName = 'testProjectPoo';
const api = 'Corgi__c';
const label = 'Corgi';
const plural = 'Corgi';

describe('shane:object:powerofone', () => {

  jest.setTimeout(testutils.localTimeout);

  beforeAll(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
  });

  it('creates an object with all params supplied for a Text Name', async () => {

    // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path

    await exec(`sfdx shane:object:create --type custom --label "${label}" --plural "${plural}" --api ${api} --nametype Text --sharingmodel ReadWrite`, { cwd: testProjectName });
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}`)).toBe(true);
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields`)).toBe(true);
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`)).toBe(true);

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

    expect(parsed.CustomObject.deploymentStatus).toBe('Deployed');
    expect(parsed.CustomObject.label).toBe(label);
    expect(parsed.CustomObject.pluralLabel).toBe(plural);
    expect(parsed.CustomObject.eventType).toBeUndefined();
    expect(parsed.CustomObject.sharingModel).toBe('ReadWrite');
  });

  it('adds poo on custom object', async () => {

    const apiname = 'Power_Of_One__c';
    const fieldLabel = 'Power Of One';

    await exec(`sfdx shane:object:powerofone -o ${api}`, { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}`)).toBe(true);
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields`)).toBe(true);
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${apiname}.field-meta.xml`)).toBe(true);

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${apiname}.field-meta.xml`);

    expect(parsed.CustomField).toBeTruthy();
    expect(parsed.CustomField.unique).toBe('false');
    expect(parsed.CustomField.type).toBe('Number');
    expect(parsed.CustomField.precision).toBe('18');
    expect(parsed.CustomField.fullName).toBe(apiname);
    expect(parsed.CustomField.label).toBe(fieldLabel);
  });

  it('adds poo on standard object that is not local', async () => {

    const apiname = 'Power_Of_One__c';
    const fieldLabel = 'Power Of One';

    await exec('sfdx shane:object:powerofone -o Account', { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Account`)).toBe(true);
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Account/fields`)).toBe(true);
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Account/fields/${apiname}.field-meta.xml`)).toBe(true);

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/Account/fields/${apiname}.field-meta.xml`);

    expect(parsed.CustomField).toBeTruthy();
    expect(parsed.CustomField.unique).toBe('false');
    expect(parsed.CustomField.type).toBe('Number');
    expect(parsed.CustomField.precision).toBe('18');
    expect(parsed.CustomField.fullName).toBe(apiname);
    expect(parsed.CustomField.label).toBe(fieldLabel);
  });

  it('adds poo on standard object with custom name/label and apply __c', async () => {

    const apiname = 'Poo';
    const fieldLabel = 'The Poo field';

    await exec(`sfdx shane:object:powerofone -o Case -l "${fieldLabel}" -a "${apiname}"`, { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Case`)).toBe(true);
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Case/fields`)).toBe(true);
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/Case/fields/${apiname}__c.field-meta.xml`)).toBe(true);

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/Case/fields/${apiname}__c.field-meta.xml`);

    expect(parsed.CustomField).toBeTruthy();
    expect(parsed.CustomField.unique).toBe('false');
    expect(parsed.CustomField.type).toBe('Number');
    expect(parsed.CustomField.precision).toBe('18');
    expect(parsed.CustomField.fullName).toBe(`${apiname}__c`);
    expect(parsed.CustomField.label).toBe(fieldLabel);
  });

  it('deploys as valid code', async () => {
    jest.setTimeout(testutils.remoteTimeout);
    if (process.env.LOCALONLY === 'true') {
      console.log('skipping online-only test');
    } else {
      const deploySuccess = await testutils.itDeploys(testProjectName);
      expect(deploySuccess).toBe(true);
    }
  });

  afterAll(async () => {
    await fs.remove(testProjectName);
  });
});
