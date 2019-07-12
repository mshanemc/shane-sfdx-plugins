import fs = require('fs-extra');

import { exec } from '../../src/shared/execProm';
import { getParsed } from '../../src/shared/xml2jsAsync';

// pass in a local path to mdapi xml, get back the json equivalent
// tslint:disable-next-line: no-any
export async function getParsedXML(url: string): Promise<any> {
    const xml = await fs.readFile(url);
    return await getParsed(xml);
}

export async function orgCreate(testProjectName: string) {
    const createResult = await exec('sfdx force:org:create -f config/project-scratch-def.json -s -d 1 --json', { cwd: testProjectName });
    return createResult;
}

export async function orgDelete(testProjectName: string) {
    const { stdout } = await exec('sfdx force:config:list --json', { cwd: testProjectName });
    const username = JSON.parse(stdout).result.find(item => item.key === 'defaultusername').value;
    const deleteResult = await exec(`sfdx force:org:delete -u ${username} --json -p`, { cwd: testProjectName });
    return deleteResult;
}

export async function itDeploys(testProjectName: string) {
    await this.orgCreate(testProjectName);

    // push source
    const pushResult = await exec('sfdx force:source:push --json', { cwd: testProjectName });

    const result = JSON.parse(pushResult.stdout);

    // destroy org
    await this.orgDelete(testProjectName);

    return result.status === 0;
}

export const localTimeout = 50000;
export const remoteTimeout = 150000;
