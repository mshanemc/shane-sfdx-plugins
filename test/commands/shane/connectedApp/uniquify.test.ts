import { exec, exec2JSON } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectConnectedAppUniquify';

const filePath = 'force-app/main/default/connectedApps/test.connectedApp-meta.xml';
describe('shane:connectedapp:uniquify', () => {
    jest.setTimeout(testutils.remoteTimeout);

    beforeAll(async () => {
        await fs.remove(testProjectName);
        await exec(`sfdx force:project:create -n ${testProjectName}`);
        await fs.ensureDir(`${testProjectName}/force-app/main/default/connectedApps`);
        // write the connected app into new folder
        await fs.copy('test/commands/shane/connectedApp/connectedAppExample.xml', `${testProjectName}/${filePath}`);
    });

    it(`modifies app id`, async () => {
        const setResult = await exec2JSON(`sfdx shane:connectedapp:uniquify -a ${filePath} -p 5h4n3 --json`, {
            cwd: testProjectName
        });
        expect(setResult).toEqual(expect.objectContaining({ status: 0 }));
    });

    it(`pushes`, async () => {
        const pushResult = await testutils.itDeploys(testProjectName);
        expect(pushResult).toEqual(true);
    });

    afterAll(async () => {
        await fs.remove(testProjectName);
    });
});
