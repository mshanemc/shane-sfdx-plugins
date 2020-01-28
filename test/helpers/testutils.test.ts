/* tslint:disable:no-unused-expression */

import { exec } from '../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('./testutils');

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
            expect(createResult.status).toBe(0);
            expect(createResult.result.orgId).toBeTruthy();
        });

        test('deletes the org', async () => {
            const deleteResult = await testutils.orgDelete(testProjectName);
            expect(deleteResult.status).toBe(0);
        });

        afterAll(async () => {
            await fs.remove(testProjectName);
        });
    }
});
