import { exec2JSON } from '../../src/shared/execProm';
import { getParsed } from '../../src/shared/xml2jsAsync';

import fs = require('fs-extra');

// pass in a local path to mdapi xml, get back the json equivalent
// tslint:disable-next-line: no-any
export async function getParsedXML(url: string): Promise<any> {
    const xml = await fs.readFile(url);
    return getParsed(xml);
}

export async function orgCreate(testProjectName: string) {
    const createResult = await exec2JSON('sfdx force:org:create -f config/project-scratch-def.json -s -d 1 --json', { cwd: testProjectName });
    expect(createResult).toEqual(expect.objectContaining({ status: 0 }));
    return createResult;
}

export async function orgDelete(testProjectName: string) {
    const deleteResult = await exec2JSON(`sfdx shane:org:delete --json`, { cwd: testProjectName });
    expect(deleteResult).toEqual(expect.objectContaining({ status: 0 }));
    return deleteResult;
}

export async function itDeploys(testProjectName: string) {
    await this.orgCreate(testProjectName);

    // push source
    const pushResult = await exec2JSON('sfdx force:source:push --json', { cwd: testProjectName });
    expect(pushResult).toEqual(expect.objectContaining({ status: 0 }));
    if (pushResult.result[0]) {
        expect(pushResult.result[0].error).toBeFalsy();
    }
    // destroy org
    await this.orgDelete(testProjectName);

    return pushResult.status === 0;
}

export const localTimeout = 50000;
export const remoteTimeout = 150000;
