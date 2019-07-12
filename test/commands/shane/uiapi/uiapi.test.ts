/* tslint:disable:no-unused-expression */

import fs = require('fs-extra');

import { exec, exec2JSON } from '../../../../src/shared/execProm';
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectUIAPI';
const maxBuffer = 1000 * 1024;

describe('shane:uiapi', () => {
    jest.setTimeout(testutils.remoteTimeout);
    let recordId: string;
    let recordIds: string[];

    if (!process.env.LOCALONLY) {
        beforeAll(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);
            // set up an org
            const configFileLocation = `${testProjectName}/config/project-scratch-def.json`;
            const config = fs.readJSONSync(configFileLocation);
            config.hasSampleData = true;
            fs.writeJSONSync(configFileLocation, config);

            await testutils.orgCreate(testProjectName);

            const stdout = await exec2JSON('sfdx force:data:soql:query -q "select id from account" --json', { cwd: testProjectName });
            const accounts = stdout.result.records;
            expect(accounts[0]).toHaveProperty('Id');

            recordId = accounts[0].Id;
            recordIds = accounts.map(account => account.Id);

            expect(typeof recordId).toBe('string');
            expect(recordIds).toHaveLength(accounts.length);
        });

        it('tests recordui with single recordId', async () => {
            const jsonOut = await exec2JSON(`sfdx shane:uiapi:recordui -r ${recordId} --json`, { cwd: testProjectName, maxBuffer });
            const output = jsonOut.result;

            looksValidSingleRecordUI(output);
        });

        it('tests recordui with single and multiple layouts', async () => {
            const jsonOut = await exec2JSON(`sfdx shane:uiapi:recordui -r ${recordId} --json -l Compact`, { cwd: testProjectName, maxBuffer });
            const output = jsonOut.result;

            looksValidSingleRecordUI(output);
        });

        it('tests recordui with single recordid and single mode', async () => {
            const jsonOut = await exec2JSON(`sfdx shane:uiapi:recordui -r ${recordId} --json -m View`, { cwd: testProjectName, maxBuffer });
            const output = jsonOut.result;

            looksValidSingleRecordUI(output);
        });

        it('tests recordui with single recordid and single mode and layout', async () => {
            const jsonOut = await exec2JSON(`sfdx shane:uiapi:recordui -r ${recordId} --json -m View -l Full`, { cwd: testProjectName, maxBuffer });
            const output = jsonOut.result;

            looksValidSingleRecordUI(output);
        });

        it('tests recordui with single recordid and multiple modes and layouts', async () => {
            const jsonOut = await exec2JSON(`sfdx shane:uiapi:recordui -r ${recordId} --json -m View,Create,Edit -l Full,Compact`, {
                cwd: testProjectName,
                maxBuffer
            });
            const output = jsonOut.result;

            looksValidSingleRecordUI(output);
        });

        it('tests recordui with single recordid and multiple modes', async () => {
            const jsonOut = await exec2JSON(`sfdx shane:uiapi:recordui -r ${recordId} --json -m Create`, { cwd: testProjectName, maxBuffer });
            const output = jsonOut.result;

            looksValidSingleRecordUI(output);
        });

        it('tests recordui with list of recordIds', async () => {
            const jsonOut = await exec2JSON(`sfdx shane:uiapi:recordui -r ${recordIds.join(',')} --json`, { cwd: testProjectName, maxBuffer });
            const output = jsonOut.result;
            looksValidMultipleRecordUI(output);
        });

        it('tests recordui with list of recordIds and layout', async () => {
            const jsonOut = await exec2JSON(`sfdx shane:uiapi:recordui -r ${recordIds.join(',')} --json -l Full`, {
                cwd: testProjectName,
                maxBuffer
            });
            const output = jsonOut.result;
            looksValidMultipleRecordUI(output);
        });

        it('tests recordui with list of recordIds and mode', async () => {
            const jsonOut = await exec2JSON(`sfdx shane:uiapi:recordui -r ${recordIds.join(',')} --json -m Create`, {
                cwd: testProjectName,
                maxBuffer
            });
            const output = jsonOut.result;
            looksValidMultipleRecordUI(output);
        });

        it('tests objectinfo', async () => {
            const apiName = 'Account';
            const jsonOut = await exec2JSON(`sfdx shane:uiapi:objectinfo -o ${apiName} --json`, { cwd: testProjectName, maxBuffer });
            const output = jsonOut.result;
            expect(output).toHaveProperty('apiName');
            expect(output.apiName).toBe('Account');
            expect(output).toHaveProperty('eTag');
            expect(output).toHaveProperty('fields');
        });

        it('tests getrecord', async () => {
            const jsonOut = await exec2JSON(`sfdx shane:uiapi:record -r ${recordId} -f Account.Name --json`, { cwd: testProjectName, maxBuffer });
            const output = jsonOut.result;
            looksValidRecord(output);
        });

        it('tests getrecord with optional fields', async () => {
            const jsonOut = await exec2JSON(
                `sfdx shane:uiapi:record -r ${recordId} -f Account.Name --optionalfields Account.AnnualRevenue,AccountAccount.Number --json`,
                { cwd: testProjectName, maxBuffer }
            );
            const output = jsonOut.result;
            looksValidRecord(output);
        });

        const looksValidRecord = output => {
            expect(typeof output.eTag).toBe('string');
            expect(output.apiName).toBe('Account');
            expect(output.fields).toHaveProperty('Name');
        };

        const looksValidSingleRecordUI = output => {
            expect(typeof output.eTag).toBe('string');
            expect(output.records).toHaveProperty(recordId);
            expect(output.objectInfos).toHaveProperty('Account');
        };

        const looksValidMultipleRecordUI = output => {
            expect(typeof output.eTag).toBe('string');
            recordIds.forEach(id => {
                expect(output.records).toHaveProperty(id);
            });
            expect(output.objectInfos).toHaveProperty('Account');
        };

        afterAll(async () => {
            await testutils.orgDelete(testProjectName);
            await fs.remove(testProjectName);
        });
    }
});
