/* tslint:disable:no-unused-expression */
import fs = require('fs-extra');

import { exec, exec2JSON, exec2String } from '../../../../src/shared/execProm';
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectFileUpload';

describe('shane:data:file:upload', () => {
    if (!process.env.LOCALONLY) {
        jest.setTimeout(testutils.remoteTimeout);

        beforeAll(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);
            await testutils.orgCreate(testProjectName);
        });

        it('uploads a file simply', async () => {
            const results = await exec2String('sfdx shane:data:file:upload -f sfdx-project.json', { cwd: testProjectName });
            expect(results).toContain('created file with content document id');
        });

        it('uploads a file simply with json', async () => {
            const results = await exec2JSON('sfdx shane:data:file:upload -f sfdx-project.json --json', { cwd: testProjectName });
            expect(results.status).toBe(0);
        });

        it('uploads a file with a name', async () => {
            const results = await exec2String('sfdx shane:data:file:upload -f sfdx-project.json -n "sfdx project json file"', {
                cwd: testProjectName
            });
            expect(results).toContain('created file with content document id');
        });

        it('uploads a file with a name --json', async () => {
            const results = await exec2JSON('sfdx shane:data:file:upload -f sfdx-project.json -n "sfdx project json file" --json', {
                cwd: testProjectName
            });
            expect(results.status).toBe(0);
        });

        it('uploads a file with a name attached to a record', async () => {
            const newAcct = await exec2JSON('sfdx force:data:record:create -s Account -v "Name=Acme2" --json', { cwd: testProjectName });
            const results = await exec2String(
                `sfdx shane:data:file:upload -f sfdx-project.json -n "sfdx project json file" -p ${newAcct.result.id}`,
                {
                    cwd: testProjectName
                }
            );
            expect(results).toContain('created regular file attachment on record');
        });

        it('uploads a file with a name attached to a record in chatter', async () => {
            const newAcct = await exec2JSON('sfdx force:data:record:create -s Account -v "Name=Acme2" --json', { cwd: testProjectName });
            const results = await exec2String(
                `sfdx shane:data:file:upload -f sfdx-project.json -n "sfdx project json file" -c -p ${newAcct.result.id}`,
                { cwd: testProjectName }
            );
            expect(results).toContain('created chatter file attachment on record');
        });

        it('fails chatter without a parentid', async () => {
            const err = await exec2JSON('sfdx shane:data:file:upload -f sfdx-project.json -n "sfdx project json file" -c --json', {
                cwd: testProjectName
            });
            expect(err.message).toContain('--parentid= must also be provided when using --chatter=');
        });

        afterAll(async () => {
            await testutils.orgDelete(testProjectName);
            await fs.remove(testProjectName);
        });
    }
});
