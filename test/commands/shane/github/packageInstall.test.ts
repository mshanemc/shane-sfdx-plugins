/* tslint:disable:no-unused-expression */

import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);
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
            const results = await exec(`sfdx shane:github:package:install -g ${username} -r ${repo} --json`, { cwd: testProjectName });

            // console.log(results);
            expect(results).toBeTruthy();
            expect(results.stdout).toBeTruthy();
            const stdout = JSON.parse(results.stdout);
            // console.log(stdout);
            // console.log(stdout.status);
            expect(stdout.status).toBe(0);
        });

        afterAll(async () => {
            await testutils.orgDelete(testProjectName);
            await fs.remove(testProjectName);
        });
    }
});
