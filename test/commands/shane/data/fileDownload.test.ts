/* tslint:disable:no-unused-expression */
import fs = require('fs-extra');

import { exec, exec2JSON, exec2String } from '../../../../src/shared/execProm';
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectFileDownload';
const fileContents = 'hello, world';

describe('shane:data:file:download', () => {
    if (!process.env.LOCALONLY) {
        jest.setTimeout(testutils.remoteTimeout);

        beforeAll(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);
            await testutils.orgCreate(testProjectName);
            // write a simple text file to local
            await fs.writeFile(`${testProjectName}/hello.txt`, fileContents);
            await exec('sfdx shane:data:file:upload -f hello.txt', { cwd: testProjectName });
            await fs.remove(`${testProjectName}/hello.txt`);
        });

        it('downloads by name to default location', async () => {
            await exec2String('sfdx shane:data:file:download -n "hello"', { cwd: testProjectName });
            const file = await fs.readFile(`${testProjectName}/hello.txt`);
            expect(file.toString()).toBe(fileContents);
        });

        it('downloads by name to a directory that exists', async () => {
            const testDir = 'myDir';
            await fs.ensureDir(`${testProjectName}/${testDir}`);
            await exec2String(`sfdx shane:data:file:download -n "hello" -o ${testDir}`, { cwd: testProjectName });
            const file = await fs.readFile(`${testProjectName}/${testDir}/hello.txt`);
            expect(file.toString()).toBe(fileContents);
            await fs.remove(`${testProjectName}/${testDir}`);
        });

        it('downloads by name to a directory that does not exist', async () => {
            const testDir = 'myDir';
            await exec2String(`sfdx shane:data:file:download -n "hello" -o ${testDir}`, { cwd: testProjectName });
            const file = await fs.readFile(`${testProjectName}/${testDir}/hello.txt`);
            expect(file.toString()).toBe(fileContents);
            await fs.remove(`${testProjectName}/${testDir}`);
        });

        it('downloads by name to alternate location', async () => {
            await exec2String('sfdx shane:data:file:download -n "hello" -f hello2.txt', { cwd: testProjectName });
            const file = await fs.readFile(`${testProjectName}/hello2.txt`);
            expect(file.toString()).toBe(fileContents);
        });

        it('downloads by name to default location via json', async () => {
            const result = await exec2JSON('sfdx shane:data:file:download -n "hello" --json', { cwd: testProjectName });
            expect(result.status).toBe(0);
            const file = await fs.readFile(`${testProjectName}/hello.txt`);
            expect(file.toString()).toBe(fileContents);
        });

        it('downloads by name to alternate location via json', async () => {
            await exec2String('sfdx shane:data:file:download -n "hello" -f hello2.txt --json', { cwd: testProjectName });
            const file = await fs.readFile(`${testProjectName}/hello2.txt`);
            expect(file.toString()).toBe(fileContents);
        });

        it('downloads by contentDocumentId to default location', async () => {
            const CD = await exec2JSON(
                `sfdx force:data:soql:query -q "select id,LatestPublishedVersionId from ContentDocument where title='hello'" --json`,
                {
                    cwd: testProjectName
                }
            );
            expect(CD.status).toBe(0);
            const result = await exec2JSON(`sfdx shane:data:file:download -i ${CD.result.records[0].Id} --json`, { cwd: testProjectName });
            expect(result.status).toBe(0);

            const file = await fs.readFile(`${testProjectName}/hello.txt`);
            expect(file.toString()).toBe(fileContents);
        });

        it('downloads by contentVersionId to default location', async () => {
            const CD = await exec2JSON(
                `sfdx force:data:soql:query -q "select id,LatestPublishedVersionId from ContentDocument where title='hello'" --json`,
                {
                    cwd: testProjectName
                }
            );
            expect(CD.status).toBe(0);
            expect(CD.result.records[0].LatestPublishedVersionId.startsWith('068')).toBe(true);

            await exec2String(`sfdx shane:data:file:download -i ${CD.result.records[0].LatestPublishedVersionId}`, { cwd: testProjectName });
            const file = await fs.readFile(`${testProjectName}/hello.txt`);
            expect(file.toString()).toBe(fileContents);
        });

        afterEach(async () => {
            await fs.remove(`${testProjectName}/hello.txt`);
            expect(fs.existsSync(`${testProjectName}/hello.txt`)).toBe(false);
            await fs.remove(`${testProjectName}/hello2.txt`);
            expect(fs.existsSync(`${testProjectName}/hello2.txt`)).toBe(false);
        });

        afterAll(async () => {
            await testutils.orgDelete(testProjectName);
            await fs.remove(testProjectName);
        });
    }
});
