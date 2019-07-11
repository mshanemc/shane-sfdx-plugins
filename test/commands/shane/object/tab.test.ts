/* tslint:disable:no-unused-expression */

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
  jest.setTimeout(testutils.localTimeout);

  beforeAll(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
  });

  it('creates an object with all params supplied for a Text Name', async () => {
    // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path

    await exec(
      `sfdx shane:object:create --type custom --label "${label}" --plural "${plural}" --api ${api} --nametype Text --sharingmodel ReadWrite`,
      { cwd: testProjectName }
    );
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}`)).toBe(true);
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields`)).toBe(true);
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`)).toBe(true);

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

    expect(parsed.CustomObject.deploymentStatus).toBe('Deployed');
    expect(parsed.CustomObject.label).toBe(label);
    expect(parsed.CustomObject.pluralLabel).toBe(plural);
    expect(parsed.CustomObject.eventType).toBeUndefined();
    expect(parsed.CustomObject.sharingModel).toBe('ReadWrite');

    await exec(`sfdx shane:object:tab --object ${api} --icon 1`, { cwd: testProjectName });
    const parsedTab = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/tabs//${api}.tab-meta.xml`);
    expect(parsedTab.CustomTab.customObject).toBe('true');
    expect(parsedTab.CustomTab.motif).toBe('Custom1: Heart');
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
