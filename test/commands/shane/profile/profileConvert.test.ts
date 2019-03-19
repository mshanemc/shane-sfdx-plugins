/* tslint:disable:no-unused-expression */
import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');
import testutils = require('../../../helpers/testutils');

import { getExisting } from '../../../../src/shared/getExisting';

const exec = util.promisify(child_process.exec);

const profileName = 'Admin';
const newPermSetName = 'TestNewPerm';
const goldenSourceRepo = './test/repos/profileTestRepo';
const testProjectName = 'testProjectProfileConvert';

const newPermsetPath = `${testProjectName}/force-app/main/default/permissionsets/${newPermSetName}.permissionset-meta.xml`;
const originalProfilePath = `${testProjectName}/force-app/main/default/profiles/${profileName}.profile-meta.xml`;

describe('profile convert (just create a permset from a profile)', () => {

  jest.setTimeout(testutils.localTimeout);

  // get a clean copy of the original repo
  beforeEach( () => {
    fs.emptyDirSync(testProjectName);
    fs.copySync(goldenSourceRepo, testProjectName);
  });

  test('does a simple convert of the Admin profile', async () => {

    expect(fs.existsSync(goldenSourceRepo)).toBe(true);
    expect(fs.existsSync(testProjectName)).toBe(true);

    await exec(`sfdx shane:profile:convert -p ${profileName} -n ${newPermSetName}`, { cwd: testProjectName });
    expect(fs.existsSync(newPermsetPath)).toBe(true);
    expect(fs.existsSync(originalProfilePath)).toBe(true);
    const newPermSet = await getExisting(newPermsetPath, 'PermissionSet');

    expect(Array.isArray(newPermSet.applicationVisibilities)).toBe(true);
    expect(Array.isArray(newPermSet.classAccesses)).toBe(true);
    expect(Array.isArray(newPermSet.objectPermissions)).toBe(true);
    expect(Array.isArray(newPermSet.pageAccesses)).toBe(true);
    expect(Array.isArray(newPermSet.recordTypeVisibilities)).toBe(true);
    expect(Array.isArray(newPermSet.tabSettings)).toBe(true);

    newPermSet.tabSettings.map(ts => {
      expect(['Available', 'Visible', 'None']).toContain(ts.visibility);
    });
  });

  test('does a simple convert of the Admin profile and makes a skinny clone', async () => {
    await exec(`sfdx shane:profile:convert -p ${profileName} -n ${newPermSetName} -c`, { cwd: testProjectName });
    expect(fs.existsSync(newPermsetPath)).toBe(true);
    expect(fs.existsSync(originalProfilePath)).toBe(true);

    const skinnyPath = `${testProjectName}/force-app/main/default/profiles/${profileName}_Skinny.profile-meta.xml`;
    expect(fs.existsSync(skinnyPath)).toBe(true);

    // TODO: Verify skinnyness
    const skinnyProfile = await getExisting(skinnyPath, 'Profile');

    expect(skinnyProfile).toHaveProperty('applicationVisibilities');
    expect(Array.isArray(skinnyProfile.applicationVisibilities)).toBe(true);

    expect(skinnyProfile).toHaveProperty('classAccesses');
    expect(Array.isArray(skinnyProfile.classAccesses)).toBe(true);

    expect(skinnyProfile).toHaveProperty('objectPermissions');
    expect(Array.isArray(skinnyProfile.objectPermissions)).toBe(true);

    expect(skinnyProfile).toHaveProperty('pageAccesses');
    expect(Array.isArray(skinnyProfile.pageAccesses)).toBe(true);

    expect(skinnyProfile).toHaveProperty('recordTypeVisibilities');
    expect(Array.isArray(skinnyProfile.recordTypeVisibilities)).toBe(true);

    expect(skinnyProfile).toHaveProperty('tabVisibilities');
    expect(Array.isArray(skinnyProfile.tabVisibilities)).toBe(true);

    expect(Array.isArray(skinnyProfile.userPermissions)).toBe(true);

  });

  test('modifies the original profile', async () => {
    await exec(`sfdx shane:profile:convert -p ${profileName} -n ${newPermSetName} -e`, { cwd: testProjectName });
    expect(fs.existsSync(newPermsetPath)).toBe(true);
    expect(fs.existsSync(originalProfilePath)).toBe(true);

    // TODO: Verify skinnyness
    const editedProfile = await getExisting(originalProfilePath, 'Profile');

    expect(editedProfile.applicationVisibilities).toBeUndefined();
    expect(editedProfile.classAccesses).toBeUndefined();
    expect(editedProfile.objectPermissions ).toBeUndefined();
    expect(editedProfile.pageAccesses).toBeUndefined();
    expect(editedProfile.recordTypeVisibilities).toBeUndefined();
    expect(editedProfile.tabVisibilities).toBeUndefined();

    expect(Array.isArray(editedProfile.userPermissions)).toBe(true);

  });

  afterEach( async () => {
    // jest.setTimeout(testutils.remoteTimeout);
    // if (process.env.LOCALONLY === 'true') {
    //   console.log('skipping online-only test');
    // } else {
    //   const deploySuccess = await testutils.itDeploys(testProjectName);
    //   expect(deploySuccess).toBe(true);
    // }
  });

  afterAll( () => {
    fs.emptyDirSync(testProjectName); // don't leave a mess
  });

});
