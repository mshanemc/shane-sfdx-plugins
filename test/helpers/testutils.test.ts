/* tslint:disable:no-unused-expression */

import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');

import testutils = require('./testutils');

const exec = util.promisify(child_process.exec);

const testProjectName = 'testProjectTestUtilities';

describe('tests testUtils', () => {
    jest.setTimeout(testutils.remoteTimeout);

    if (!process.env.LOCALONLY) {
        beforeAll(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);
        });

        test('creates an org', async () => {
            const createResult = await testutils.orgCreate(testProjectName);
            expect(JSON.parse(createResult.stdout).status).toBe(0);
            expect(JSON.parse(createResult.stdout).result.orgId).toBeTruthy();
        });

        test('deletes the org', async () => {
            const deleteResult = await testutils.orgDelete(testProjectName);
            expect(JSON.parse(deleteResult.stdout).status).toBe(0);
        });

        afterAll(async () => {
            await fs.remove(testProjectName);
        });
    }
});
