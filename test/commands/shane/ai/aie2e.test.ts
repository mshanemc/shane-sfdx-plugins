/* eslint-disable no-template-curly-in-string */
/* tslint:disable:no-unused-expression */
import { retry } from '@lifeomic/attempt';
import { exec, exec2JSON } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectEndToEndAI';
const EVLPGPackageVersionId = '04t0b000001oXW0';
const herokuAppName = 'int-test-ai-shane-plugin';

describe('shane:ai:tests', () => {
    if (!process.env.LOCALONLY) {
        jest.setTimeout(testutils.remoteTimeout);

        beforeAll(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);
            await testutils.orgCreate(testProjectName);
        });

        it('installs the EVLPG via package', async () => {
            const installResult = await exec2JSON(`sfdx force:package:install --package ${EVLPGPackageVersionId} --wait 20 -r --json`, {
                cwd: testProjectName
            });
            expect(installResult).toEqual(expect.objectContaining({ status: 0 }));
        });

        it('provisions heroku app to org, storing auth', async () => {
            const setupResult = await exec2JSON(`sfdx shane:ai:playground:setupHeroku -k -c -a ${herokuAppName} --json`, {
                cwd: testProjectName
            });
            expect(setupResult).toEqual(expect.objectContaining({ status: 0 }));
        });

        it('can upload, get, delete a dataset', async () => {
            const datasetCreateResult = await exec2JSON(
                'sfdx shane:ai:dataset:upload -n test -f ~/code/campground/df19/electron-super/imageClassification.zip --json',
                { cwd: testProjectName }
            );
            expect(datasetCreateResult).toEqual(expect.objectContaining({ status: 0 }));

            const datasetGetResult = await exec2JSON(`sfdx shane:ai:dataset:get -n ${datasetCreateResult.result.id} --json`, {
                cwd: testProjectName
            });
            // console.log(datasetGetResult);
            expect(datasetGetResult).toEqual(expect.objectContaining({ status: 0 }));

            const datasetDeleteResult = await retry(
                async () => {
                    const delResult = await exec2JSON(`sfdx shane:ai:dataset:delete -n ${datasetCreateResult.result.id} --json`, {
                        cwd: testProjectName
                    });
                    if (delResult.status === 0) {
                        return delResult;
                    }
                    throw new Error(delResult);
                },
                {
                    maxAttempts: 200,
                    async handleTimeout(result) {
                        return result;
                    }
                }
            );
            expect(datasetDeleteResult).toEqual(expect.objectContaining({ status: 0 }));
        });

        afterAll(async () => {
            await testutils.orgDelete(testProjectName);
            // destroy associated heroku app
            await exec(`heroku destroy -a ${herokuAppName} -c ${herokuAppName}`, { cwd: testProjectName });
            await fs.remove(testProjectName);
        });
    }
});
