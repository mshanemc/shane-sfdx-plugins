import { exec, exec2JSON } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectThemeActivate';

describe('shane:theme:activate', () => {
    jest.setTimeout(testutils.remoteTimeout);

    beforeEach(async () => {
        await fs.remove(testProjectName);
        await exec(`git clone https://github.com/mshanemc/electron-theme ${testProjectName}`);
        await testutils.orgCreate(testProjectName);
        await exec('sfdx force:source:push', { cwd: testProjectName });
    });

    it('activates the electron theme with --json', async () => {
        const response = await exec2JSON(`sfdx shane:theme:activate -n Electron --json`, { cwd: testProjectName });
        expect(response.status).toBe(0);
    });

    afterEach(async () => {
        await testutils.orgDelete(testProjectName);
        await fs.remove(testProjectName);
    });
});
