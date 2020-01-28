/* tslint:disable:no-unused-expression */
import { exec } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectStaticResourceCreate';

// comment
describe('shane:static:create', () => {
    jest.setTimeout(testutils.localTimeout);

    beforeAll(async () => {
        await fs.remove(testProjectName);
        await exec(`sfdx force:project:create -n ${testProjectName}`);
    });

    it('creates a static css', async () => {
        const name = 'NewStatic';

        await exec(`sfdx shane:static:create -n ${name} -y css`, { cwd: testProjectName });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/staticresources`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/staticresources/${name}.resource-meta.xml`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/staticresources/${name}.css`)).toBe(true);

        // const xml = await fs.readFile(`${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/staticresources/${name}.resource-meta.xml`);

        expect(parsed.StaticResource.contentType).toBe('text/css');
        expect(parsed.StaticResource.fullName).toBe(name);
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
