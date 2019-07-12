/* tslint:disable:no-unused-expression */
import fs = require('fs-extra');

import { exec } from '../../../../src/shared/execProm';
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectGithubSrcInstall';
const username = 'mshanemc';

describe('shane:github:src:install', () => {
    jest.setTimeout(testutils.remoteTimeout);

    if (!process.env.LOCALONLY) {
        beforeEach(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);
            await testutils.orgCreate(testProjectName);
        });

        it('works with specified src folder', async () => {
            const repo = 'lightningErrorHandler';

            const results = await exec(`sfdx shane:github:src:install -g ${username} -r ${repo} -p src --json`, { cwd: testProjectName });

            // console.log(results);
            expect(results).toBeTruthy();
            expect(results.stdout).toBeTruthy();
            const stdout = JSON.parse(results.stdout);
            // console.log(stdout);
            // console.log(stdout.status);
            expect(stdout.status).toBe(0);
        });

        it('works with sfdx src format', async () => {
            const repo = 'DF17integrationWorkshops';
            const results = await exec(`sfdx shane:github:src:install -g ${username} -r ${repo} -p force-app -c --json`, { cwd: testProjectName });

            expect(results).toBeTruthy();
            expect(results.stdout).toBeTruthy();
            const stdout = JSON.parse(results.stdout);
            // console.log(stdout);
            // console.log(stdout.status);
            expect(stdout.status).toBe(0);
        });

        afterEach(async () => {
            await testutils.orgDelete(testProjectName);
            await fs.remove(testProjectName);
        });
    }
});
