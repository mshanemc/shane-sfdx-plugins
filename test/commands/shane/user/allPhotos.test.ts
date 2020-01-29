import { exec, exec2JSON } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectUserAllPhotos';
// const filepath = '../test/helpers/shane.png';

describe('shane:user:allphotos', () => {
    jest.setTimeout(testutils.remoteTimeout);

    if (!process.env.LOCALONLY) {
        beforeAll(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);
            await testutils.orgCreate(testProjectName);
        });

        it(`runs with standard public repo`, async () => {
            const setResult = await exec2JSON(`sfdx shane:user:allPhotos --json`, {
                cwd: testProjectName
            });
            expect(setResult).toEqual(expect.objectContaining({ status: 0 }));
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
