/* eslint-disable no-template-curly-in-string */
/* tslint:disable:no-unused-expression */
import { exec, exec2JSON } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'mshanemc-heroku-xo-1234567890';
const xdsFolderPath = 'force-app/main/default/dataSources';
const xdsFileLabel = 'myXds';
const xdsFileName = `${xdsFileLabel}.dataSource-meta.xml`;
const xdsFilePath = `${xdsFolderPath}/${xdsFileName}`;

describe('shane:heroku:externalobjects', () => {
    jest.setTimeout(testutils.remoteTimeout * 2); // heroku apps take a long time to deploy

    if (!process.env.LOCALONLY) {
        // create an org
        beforeAll(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);

            await testutils.orgCreate(testProjectName);
            await exec('sfdx shane:profile:whitelist -n Admin', { cwd: testProjectName });
            // await exec('sfdx force:source:push', { cwd: testProjectName });
            // create our test file

            try {
                await exec(`heroku destroy -a ${testProjectName} -c ${testProjectName}`, {
                    cwd: testProjectName,
                    shell: '/bin/bash'
                });
            } catch (error) {
                // it's ok....just wanted to make sure it's not there before trying to create it
            }
        });

        it('sets up a heroku app with deploy', async () => {
            // sfdx shane:heroku:repo:deploy -g mshanemc -r electron-web-app -n `basename "${PWD/mshanemc-/}"` -t ci-tests
            const results = await exec2JSON(`sfdx shane:heroku:repo:deploy -g mshanemc -r heroku-external-objects -n ${testProjectName} --json`, {
                cwd: testProjectName,
                shell: '/bin/bash'
            });

            expect(results).toEqual(expect.objectContaining({ status: 0 }));
        });

        it('configures external objects by creating an external data source', async () => {
            // sfdx shane:heroku:connect -a `basename "${PWD/mshanemc-/}"` -f assets/herokuConnect/electron-web.json
            const results = await exec2JSON(`sfdx shane:heroku:externalobjects -a ${testProjectName} -l ${xdsFileLabel} -c ${xdsFolderPath} --json`, {
                cwd: testProjectName,
                shell: '/bin/bash'
            });
            expect(fs.existsSync(`${testProjectName}/${xdsFilePath}`));
            expect(results).toEqual(expect.objectContaining({ status: 0 }));
        });

        it('deploys the newly created app', async () => {
            const deployResult = await testutils.itDeploys(testProjectName);
            expect(deployResult).toBe(true);
        });

        it('deletes the original heroku app', async () => {
            await exec(`heroku destroy -a ${testProjectName} -c ${testProjectName}`, {
                cwd: testProjectName,
                shell: '/bin/bash'
            });
        });

        it('sets up a 2nd heroku app with deploy', async () => {
            // sfdx shane:heroku:repo:deploy -g mshanemc -r electron-web-app -n `basename "${PWD/mshanemc-/}"` -t ci-tests
            const results = await exec2JSON(`sfdx shane:heroku:repo:deploy -g mshanemc -r heroku-external-objects -n ${testProjectName} --json`, {
                cwd: testProjectName,
                shell: '/bin/bash'
            });

            expect(results).toEqual(expect.objectContaining({ status: 0 }));
        });

        it('updates an external data source with a new heroku app', async () => {
            // sfdx shane:heroku:connect -a `basename "${PWD/mshanemc-/}"` -f assets/herokuConnect/electron-web.json
            const results = await exec2JSON(`sfdx shane:heroku:externalobjects -a ${testProjectName} -f ${xdsFilePath} --json`, {
                cwd: testProjectName,
                shell: '/bin/bash'
            });

            expect(results).toEqual(expect.objectContaining({ status: 0 }));
        });

        it('deploys the modified app', async () => {
            const deployResult = await testutils.itDeploys(testProjectName);
            expect(deployResult).toBe(true);
        });

        afterAll(async () => {
            await testutils.orgDelete(testProjectName);
            await exec(`heroku destroy -a ${testProjectName} -c ${testProjectName}`, {
                cwd: testProjectName,
                shell: '/bin/bash'
            });
            await fs.remove(testProjectName);
        });
    }
});
