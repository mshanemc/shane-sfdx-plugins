/* tslint:disable:no-unused-expression */

import fs = require('fs-extra');
import util = require('util');

import child_process = require('child_process');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);
const testProjectName = 'testProjectRemoteSiteSettings';

describe('shane:remotesite:create', () => {
    jest.setTimeout(testutils.localTimeout);

    beforeAll(async () => {
        await fs.remove(testProjectName);
        await exec(`sfdx force:project:create -n ${testProjectName}`);
    });

    it('creates a RemSite from url + name', async () => {
        const testRemSite = 'testRemSite';
        const url = 'https://www.salesforce.com';

        await exec(`sfdx shane:remotesite:create -u ${url} -n ${testRemSite}`, { cwd: testProjectName });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(
            `${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`
        );

        expect(parsed.RemoteSiteSetting.url).toBe(url + '/');
        expect(parsed.RemoteSiteSetting.description).toBe('added from sfdx plugin');
    });

    it('handles description field', async () => {
        const testDescription = 'My Description';
        const testRemSite = 'testRemSite2';
        const url = 'https://www.lightning-platform-workshops.com';

        await exec(`sfdx shane:remotesite:create -u ${url} -n ${testRemSite} -d "${testDescription}"`, { cwd: testProjectName });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(
            `${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`
        );

        expect(parsed.RemoteSiteSetting.url).toBe(url + '/');
        expect(parsed.RemoteSiteSetting.description).toBe(testDescription);
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
