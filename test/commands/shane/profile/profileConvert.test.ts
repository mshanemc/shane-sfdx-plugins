/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');

import { getExisting } from './../../../../src/shared/getExisting';

const exec = util.promisify(child_process.exec);

const profileName = 'Admin';
const newPermSetName = 'TestNewPerm';
const goldenSourceRepo = './test/repos/profileTestRepo';
const testProjectName = 'testProject';

const newPermsetPath = `${testProjectName}/force-app/main/default/permissionsets/${newPermSetName}.permissionset-meta.xml`;
const originalProfilePath = `${testProjectName}/force-app/main/default/profiles/${profileName}.profile-meta.xml`;

describe('profile convert (just create a permset from a profile)', () => {

  before( () => {
  });

  // get a clean copy of the original repo
  beforeEach( () => {
    fs.emptyDirSync(testProjectName);
    fs.copySync(goldenSourceRepo, testProjectName);
  });

  it('does a simple convert of the Admin profile', async () => {

    expect(fs.existsSync(goldenSourceRepo)).to.be.true;
    expect(fs.existsSync(testProjectName)).to.be.true;

    await exec(`sfdx shane:profile:convert -p ${profileName} -n ${newPermSetName}`, { cwd: testProjectName });
    expect(fs.existsSync(newPermsetPath)).to.be.true;
    expect(fs.existsSync(originalProfilePath)).to.be.true;
    const newPermSet = await getExisting(newPermsetPath, 'PermissionSet');

    expect(newPermSet.applicationVisibilities).to.be.an('array');
    expect(newPermSet.classAccesses).to.be.an('array');
    expect(newPermSet.objectPermissions).to.be.an('array');
    expect(newPermSet.pageAccesses).to.be.an('array');
    expect(newPermSet.recordTypeVisibilities).to.be.an('array');
    expect(newPermSet.tabSettings).to.be.an('array');

  }).timeout(1500);

  it('does a simple convert of the Admin profile and makes a skinny clone', async () => {
    await exec(`sfdx shane:profile:convert -p ${profileName} -n ${newPermSetName} -c`, { cwd: testProjectName });
    expect(fs.existsSync(newPermsetPath)).to.be.true;
    expect(fs.existsSync(originalProfilePath)).to.be.true;

    const skinnyPath = `${testProjectName}/force-app/main/default/profiles/${profileName}_Skinny.profile-meta.xml`;
    expect(fs.existsSync(skinnyPath)).to.be.true;

    // TODO: Verify skinnyness
    const skinnyProfile = await getExisting(skinnyPath, 'Profile');

    expect(skinnyProfile).to.have.property('applicationVisibilities');
    expect(skinnyProfile.applicationVisibilities).to.be.an('array');

    expect(skinnyProfile).to.have.property('classAccesses');
    expect(skinnyProfile.classAccesses).to.be.an('array');

    expect(skinnyProfile).to.have.property('objectPermissions');
    expect(skinnyProfile.objectPermissions).to.be.an('array');

    expect(skinnyProfile).to.have.property('pageAccesses');
    expect(skinnyProfile.pageAccesses).to.be.an('array');

    expect(skinnyProfile).to.have.property('recordTypeVisibilities');
    expect(skinnyProfile.recordTypeVisibilities).to.be.an('array');

    expect(skinnyProfile).to.have.property('tabVisibilities');
    expect(skinnyProfile.tabVisibilities).to.be.an('array');

    expect(skinnyProfile.userPermissions).to.be.an('array');

  }).timeout(1500);

  it('modifies the original profile', async () => {
    await exec(`sfdx shane:profile:convert -p ${profileName} -n ${newPermSetName} -e`, { cwd: testProjectName });
    expect(fs.existsSync(newPermsetPath)).to.be.true;
    expect(fs.existsSync(originalProfilePath)).to.be.true;

    // TODO: Verify skinnyness
    const editedProfile = await getExisting(originalProfilePath, 'Profile');

    expect(editedProfile).to.not.have.property('applicationVisibilities');
    expect(editedProfile).to.not.have.property('classAccesses');
    expect(editedProfile).to.not.have.property('objectPermissions');
    expect(editedProfile).to.not.have.property('pageAccesses');
    expect(editedProfile).to.not.have.property('recordTypeVisibilities');
    expect(editedProfile).to.not.have.property('tabVisibilities');

    expect(editedProfile.userPermissions).to.be.an('array');

  }).timeout(1500);

  after( () => {
    fs.emptyDirSync(testProjectName); // don't leave a mess
  });

});
