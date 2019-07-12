/* tslint:disable:no-unused-expression */

import fs = require('fs-extra');

import { exec, exec2JSON } from '../../../../src/shared/execProm';
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectGithubPackageInstall';
const username = 'mshanemc';

describe('shane:github:package:install', () => {
    jest.setTimeout(testutils.remoteTimeout);

    if (!process.env.LOCALONLY) {
        beforeAll(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);
            await testutils.orgCreate(testProjectName);
        });

        it('works with the old latestVersion.json format', async () => {
            const repo = 'lightningErrorHandler';
            const results = await exec2JSON(`sfdx shane:github:package:install -g ${username} -r ${repo} --json`, { cwd: testProjectName });
            expect(results.status).toBe(0);
        });

        afterAll(async () => {
            await testutils.orgDelete(testProjectName);
            await fs.remove(testProjectName);
        });
    }
});
