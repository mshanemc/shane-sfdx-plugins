/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import fs = require('fs-extra');
import util = require('util');

import child_process = require('child_process');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);
const testProjectName = 'testProject';

describe('shane:remotesite:create', () => {

  before(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
  });

  it('creates a RemSite from url + name', async () => {

    const testRemSite = 'testRemSite';
    const url = 'https://www.salesforce.com';

    await exec(`sfdx shane:remotesite:create -u ${url} -n ${testRemSite}`, { cwd: testProjectName});
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`);

    expect(parsed.RemoteSiteSetting).to.be.an('object');
    expect(parsed.RemoteSiteSetting.url).to.equal(url + '/');
    expect(parsed.RemoteSiteSetting.description).to.equal('added from sfdx plugin');
  }).timeout(5000);

  it('handles description field', async () => {
    const testDescription = 'My Description';
    const testRemSite = 'testRemSite2';
    const url = 'https://www.lightning-platform-workshops.com';

    await exec(`sfdx shane:remotesite:create -u ${url} -n ${testRemSite} -d "${testDescription}"`, { cwd: testProjectName });
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings`)).to.be.true;
    expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`);

    expect(parsed.RemoteSiteSetting).to.be.an('object');
    expect(parsed.RemoteSiteSetting.url).to.equal(url + '/');
    expect(parsed.RemoteSiteSetting.description).to.equal(testDescription);
  }).timeout(5000);

  it('deploys as valid code', async () => {
    if (process.env.LOCALONLY === 'true') {
      console.log('skipping online-only test');
    } else {
      const deploySuccess = await testutils.itDeploys(testProjectName);
      expect(deploySuccess).to.be.true;
    }
  });

  after( async () => {
    await fs.remove(testProjectName);
  });
});
