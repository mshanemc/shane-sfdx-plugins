/* tslint:disable:no-unused-expression */
import { exec } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectContentAssetCreate';

// comment
describe('shane:contentasset:create', () => {
    jest.setTimeout(testutils.localTimeout);

    beforeAll(async () => {
        await fs.remove(testProjectName);
        await exec(`sfdx force:project:create -n ${testProjectName}`);
    });

    it('creates a new asset with name', async () => {
        const name = 'ShanePhoto';

        await exec(`sfdx shane:contentasset:create -n ${name} -f ../test/helpers/shane.png`, { cwd: testProjectName });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/contentassets`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/contentassets/${name}.asset-meta.xml`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/contentassets/${name}.asset`)).toBe(true);
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
