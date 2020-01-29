import { exec, exec2JSON, exec2String } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectDataIdQuery';
// const filepath = '../test/helpers/shane.png';

describe('shane:data:id:query', () => {
    jest.setTimeout(testutils.remoteTimeout);

    if (!process.env.LOCALONLY) {
        beforeAll(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);
            await testutils.orgCreate(testProjectName);
        });

        it(`fails on unspecific query`, async () => {
            const setResult = await exec2JSON(`sfdx shane:data:id:query -o User -w "Lastname = 'User'" --json`, {
                cwd: testProjectName
            });
            expect(setResult).toEqual(expect.objectContaining({ status: 1 }));
        });

        it(`works on good query`, async () => {
            const setResult = await exec2JSON(`sfdx shane:data:id:query -o User -w "Lastname = 'User' and Firstname = 'User'" --json`, {
                cwd: testProjectName
            });
            expect(setResult).toEqual(expect.objectContaining({ status: 0 }));
        });

        it(`not json gives just an id`, async () => {
            const setResult = await exec2String(`sfdx shane:data:id:query -o User -w "Lastname = 'User' and Firstname = 'User'"`, {
                cwd: testProjectName
            });
            expect(setResult.startsWith('005')).toBe(true);
            expect(setResult.length).toEqual(18);
        });

        // it(`sets another user's banner photo`, async () => {
        //     const setResult = await exec2JSON(`sfdx shane:user:photo -g Integration -l User -b ${filepath} --json`, {
        //         cwd: testProjectName
        //     });
        //     expect(setResult).toEqual(expect.objectContaining({ status: 0 }));
        // });

        // it(`gets error on not very specific request`, async () => {
        //     const setResult = await exec2JSON(`sfdx shane:user:photo -l User -f ${filepath} --json`, {
        //         cwd: testProjectName
        //     });
        //     expect(setResult).toEqual(expect.objectContaining({ status: 1 }));
        // });

        afterAll(async () => {
            await testutils.orgDelete(testProjectName);
            await fs.remove(testProjectName);
        });
    }
});
