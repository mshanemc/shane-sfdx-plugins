import fs = require('fs-extra');

import { exec2JSON, exec2String } from '../../../../src/shared/execProm';
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectProjectCreate';

describe('shane:project:create', () => {
    jest.setTimeout(testutils.localTimeout);

    beforeAll(async () => {
        await fs.remove(testProjectName);
    });

    it('creates a project with custom command', async () => {
        await exec2String(`sfdx shane:project:create -n ${testProjectName} -g https://github.com/mshanemc/testProjectCeate`, {});
        await hasGoodFolders();
    });

    it('creates a project with custom command and return --json', async () => {
        const results = await exec2JSON(`sfdx shane:project:create --json -n ${testProjectName} -g https://github.com/mshanemc/testProjectCeate`, {});
        expect(results.status).toBe(0);
        await hasGoodFolders();
    });

    const hasGoodFolders = async () => {
        expect(await fs.pathExists(testProjectName)).toBe(true);
        expect(await fs.pathExists(`${testProjectName}/scripts`)).toBe(true);
        expect(await fs.pathExists(`${testProjectName}/assets`)).toBe(true);
        expect(await fs.pathExists(`${testProjectName}/data`)).toBe(true);
        expect(await fs.pathExists(`${testProjectName}/config/userDef`)).toBe(true);
        expect(await fs.pathExists(`${testProjectName}/orgInit.sh`)).toBe(true);
        expect(await fs.pathExists(`${testProjectName}/README.md`)).toBe(true);
        expect(await fs.pathExists(`${testProjectName}/package.json`)).toBe(true);
    };

    afterEach(async () => {
        await fs.remove(testProjectName);
    });
    afterAll(async () => {
        await fs.remove(testProjectName);
    });
});
