import { exec, exec2JSON } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectGroupPhoto';
const groupName = 'Platypi';
const filepath = '../test/helpers/shane.png';

describe('shane:user:photo', () => {
    jest.setTimeout(testutils.remoteTimeout);

    if (!process.env.LOCALONLY) {
        beforeAll(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);
            await testutils.orgCreate(testProjectName);
            await exec(
                `sfdx force:data:record:create -s CollaborationGroup -v "Name='${groupName}' CollaborationType=Public Description='We translate anything you pay us to.  Any language, we can make it happen.  No fictional languages (Klingon, Pig Latin, Elvish, etc), please.' InformationTitle='How Translation Works' InformationBody='πώς λειτουργεί η μετάφραση'"`,
                {
                    cwd: testProjectName
                }
            );
        });

        it(`sets the group's main photo`, async () => {
            const setResult = await exec2JSON(`sfdx shane:group:photo -g ${groupName} -f ${filepath} --json`, {
                cwd: testProjectName
            });
            expect(setResult).toEqual(expect.objectContaining({ status: 0 }));
        });

        it(`sets the group's banner photo`, async () => {
            const setResult = await exec2JSON(`sfdx shane:group:photo -g ${groupName} -b ${filepath} --json`, {
                cwd: testProjectName
            });
            expect(setResult).toEqual(expect.objectContaining({ status: 0 }));
        });

        afterAll(async () => {
            await testutils.orgDelete(testProjectName);
            await fs.remove(testProjectName);
        });
    }
});
