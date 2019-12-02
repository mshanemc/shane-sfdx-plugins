/* tslint:disable:no-unused-expression */
import fs = require('fs-extra');

import { exec, exec2JSON } from '../../../../src/shared/execProm';
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectGithubDeployButton';
const fakeRepo = 'https://github.com/mshanemc/fakeRepo';
const originalDeployerURL = 'https://hosted-scratch.herokuapp.com';

describe('shane:github:src:install', () => {
    jest.setTimeout(testutils.remoteTimeout);

    beforeEach(async () => {
        await fs.remove(testProjectName);
        await exec(`sfdx shane:project:create -n ${testProjectName} -g ${fakeRepo}`);
    });

    it('verifies no button', async () => {
        // const repo = 'lightningErrorHandler';
        const readme = await fs.readFile(`${testProjectName}/README.md`, 'utf-8');
        expect(readme.includes('launchButton')).toBe(false);
        expect(readme.includes(fakeRepo)).toBe(false);
    });

    it('creates a button where there is not one', async () => {
        // const repo = 'lightningErrorHandler';
        const stdout = await exec2JSON(`sfdx shane:github:deploybutton --json`, { cwd: testProjectName });
        expect(stdout.status).toBe(0);
        const readme = await fs.readFile(`${testProjectName}/README.md`, 'utf-8');
        expect(readme.includes('launchButton')).toBe(true);
        // expect(readme.includes(fakeRepo)).toBe(true);
        expect(readme.includes(`${originalDeployerURL}/launch?template=${fakeRepo}`));
    });

    it('creates a button with a custom deployer url', async () => {
        // const repo = 'lightningErrorHandler';
        const customDeployer = 'https://hosted-scratch-dev.herokuapp.com';
        const stdout = await exec2JSON(`sfdx shane:github:deploybutton --deployer ${customDeployer} --json`, { cwd: testProjectName });
        expect(stdout.status).toBe(0);
        const readme = await fs.readFile(`${testProjectName}/README.md`, 'utf-8');
        expect(readme.includes('launchButton')).toBe(true);
        // expect(readme.includes(fakeRepo)).toBe(true);
        expect(readme.includes(`${customDeployer}/launch?template=${fakeRepo}`));
    });

    it('replaces a button', async () => {
        // const repo = 'lightningErrorHandler';
        const customDeployer = 'https://hosted-scratch-dev.herokuapp.com';
        let stdout = await exec2JSON(`sfdx shane:github:deploybutton --deployer ${customDeployer} --json`, { cwd: testProjectName });
        expect(stdout.status).toBe(0);
        let readme = await fs.readFile(`${testProjectName}/README.md`, 'utf-8');
        expect(readme.includes(`${customDeployer}/launch?template=${fakeRepo}`));

        stdout = await exec2JSON(`sfdx shane:github:deploybutton --json`, { cwd: testProjectName });
        expect(stdout.status).toBe(0);
        readme = await fs.readFile(`${testProjectName}/README.md`, 'utf-8');
        expect(readme.includes(`${originalDeployerURL}/launch?template=${fakeRepo}`));
    });

    afterEach(async () => {
        await fs.remove(testProjectName);
    });
});
