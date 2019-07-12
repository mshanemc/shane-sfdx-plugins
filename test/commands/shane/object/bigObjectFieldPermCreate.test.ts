/* tslint:disable:no-unused-expression */
import fs = require('fs-extra');

import { exec } from '../../../../src/shared/execProm';
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectBigObjectCreate';
const api = 'Platypus__b';
const label = 'Platypus';
const plural = 'Platypi';

describe('shane:object:create (big object flavor)', () => {
    jest.setTimeout(testutils.localTimeout);

    beforeAll(async () => {
        await fs.remove(testProjectName);
        await exec(`sfdx force:project:create -n ${testProjectName}`);
    });

    it('creates a big object with all params supplied', async () => {
        // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path

        await exec(`sfdx shane:object:create --type big --label "${label}" --plural "${plural}" --api ${api}`, { cwd: testProjectName });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

        expect(parsed.CustomObject).toBeTruthy();
        expect(parsed.CustomObject.deploymentStatus).toBe('Deployed');
        expect(parsed.CustomObject.label).toBe(label);
        expect(parsed.CustomObject.pluralLabel).toBe(plural);
        expect(parsed.CustomObject.indexes).toBeTruthy();
        expect(parsed.CustomObject.indexes.fullName).toBe(`${label}Index`);
        expect(parsed.CustomObject.indexes.label).toBe(`${label} Index`);
    });

    it('creates a non indexed Text field on the Big Object', async () => {
        const fieldAPI = 'Non_Indexed_Field__c';
        const fieldLabel = 'My Text Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -l 255 -n "${fieldLabel}" -t Text  --noindex`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField).toBeTruthy();
        expect(parsed.CustomField.type).toBe('Text');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.length).toBe('255');

        const parsedObj = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

        // verify indexing didn't happen
        expect(parsedObj.CustomObject.indexes.fields).toBeUndefined();
    });

    it('creates a non indexed Number field (18,0) on the Big Object', async () => {
        const fieldAPI = 'Number_Field__c';
        const fieldLabel = 'Number Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Number  --noindex --scale 0 --precision 18`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField).toBeTruthy();
        expect(parsed.CustomField.type).toBe('Number');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.precision).toBe('18');
        expect(parsed.CustomField.scale).toBe('0');

        const parsedObj = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

        // verify indexing didn't happen
        expect(parsedObj.CustomObject.indexes.fields).toBeUndefined();
    });

    it('creates a required non indexed Text field on the Big Object', async () => {
        const fieldAPI = 'Required_Non_Indexed_Field__c';
        const fieldLabel = 'My Required Text Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -l 255 -n "${fieldLabel}" -t Text  --noindex --required`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField).toBeTruthy();
        expect(parsed.CustomField.type).toBe('Text');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.required).toBe('true');
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.length).toBe('255');

        const parsedObj = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

        // verify indexing didn't happen
        expect(parsedObj.CustomObject.indexes.fields).toBeUndefined();
    });

    it('creates a indexed Text field on the Big Object', async () => {
        const fieldAPI = 'Indexed_Field__c';
        const fieldLabel = 'My Indexed Text Field';

        await exec(
            `sfdx shane:object:field --object ${api} --api ${fieldAPI} -l 10 -n "${fieldLabel}" -t Text  --indexappend --indexdirection DESC`,
            { cwd: testProjectName }
        );
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField).toBeTruthy();
        expect(parsed.CustomField.type).toBe('Text');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.length).toBe('10');

        const parsedObj = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

        // verify indexing didn't happen
        expect(parsedObj.CustomObject.indexes.fields).toBeTruthy();
        // expect(parsedObj.CustomObject.indexes.fields.length).toBe(1);
        expect(parsedObj.CustomObject.indexes.fields.name).toBe(fieldAPI);
        expect(parsedObj.CustomObject.indexes.fields.sortDirection).toBe('DESC');
    });

    it('appends a second indexed Text field on the Big Object', async () => {
        const fieldAPI = 'Indexed_Field2__c';
        const fieldLabel = 'My Indexed Text Field 2';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -l 10 -n "${fieldLabel}" -t Text  --indexappend --indexdirection ASC`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField).toBeTruthy();
        expect(parsed.CustomField.type).toBe('Text');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.length).toBe('10');

        const parsedObj = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

        // verify indexing didn't happen
        expect(parsedObj.CustomObject.indexes.fields.length).toBe(2);
        expect(parsedObj.CustomObject.indexes.fields[1].name).toBe(fieldAPI);
        expect(parsedObj.CustomObject.indexes.fields[1].sortDirection).toBe('ASC');
    });

    it('adds a third indexed Text field on the Big Object in position 1', async () => {
        const fieldAPI = 'Indexed_Field3__c';
        const fieldLabel = 'My Indexed Text Field 3';

        await exec(
            `sfdx shane:object:field --object ${api} --api ${fieldAPI} -l 10 -n "${fieldLabel}" -t Text  --indexposition 1 --indexdirection ASC`,
            { cwd: testProjectName }
        );
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField).toBeTruthy();
        expect(parsed.CustomField.type).toBe('Text');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.length).toBe('10');

        const parsedObj = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

        // verify indexing didn't happen
        expect(parsedObj.CustomObject.indexes.fields.length).toBe(3);
        expect(parsedObj.CustomObject.indexes.fields[1].name).toBe(fieldAPI);
        expect(parsedObj.CustomObject.indexes.fields[1].sortDirection).toBe('ASC');
    });

    it('creates a big object with all params supplied in separate dir', async () => {
        // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path
        const myDir = 'myDir';

        fs.ensureDirSync(`${testProjectName}/${myDir}`);

        await exec(`sfdx shane:object:create --type big --label "${label}" --plural "${plural}" --api ${api} --directory ${myDir}`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/${myDir}/objects/${api}`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/${myDir}/objects/${api}/fields`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/${myDir}/objects/${api}/${api}.object-meta.xml`)).toBe(true);
    });

    it('can build a permset', async () => {
        const permSetName = 'MyPermSet1';
        await exec(`sfdx shane:permset:create -n ${permSetName} -o ${api}`, { cwd: testProjectName });

        expect(fs.existsSync(`${testProjectName}/force-app/main/default/permissionsets`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/permissionsets/${permSetName}.permissionset-meta.xml`)).toBe(true);

        // parse the permset
        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/permissionsets/${permSetName}.permissionset-meta.xml`);

        // verify object
        expect(parsed.PermissionSet).toBeTruthy();
        expect(parsed.PermissionSet.objectPermissions).toBeTruthy();
        expect(parsed.PermissionSet.objectPermissions.object).toBe(api);

        expect(parsed.PermissionSet.fieldPermissions.length).toBe(2);

        // verify all the fields so far.  Required fields, and fileds required because they're indexed, shouldn't be included
        const trueFields = [`${api}.Non_Indexed_Field__c`, `${api}.Number_Field__c`];
        const falseFields = [
            `${api}.Indexed_Field3__c`,
            `${api}.Indexed_Field2__c`,
            `${api}.Indexed_Field__c`,
            `${api}.Required_Non_Indexed_Field__c`
        ];

        trueFields.forEach(field => {
            const match = parsed.PermissionSet.fieldPermissions.find(item => item.field === field);
            expect(match.readable).toBe('true');
            expect(match.editable).toBe('true');
        });

        falseFields.forEach(field => {
            const match = parsed.PermissionSet.fieldPermissions.find(item => item.field === field);
            expect(match).toBeFalsy();
            // expect(match.editable).toBeFalsy();
        });

        // expect(parsed.PermissionSet.fieldPermissions).to.deep.include({ readable: 'true', editable: 'true', field: `${api}.Non_Indexed_Field__c` });
        // expect(parsed.PermissionSet.fieldPermissions).to.deep.include({ readable: 'true', editable: 'true', field: `${api}.Number_Field__c` });

        // expect(parsed.PermissionSet.fieldPermissions).to.not.include({ readable: 'true', editable: 'true', field: `${api}.Indexed_Field3__c` });
        // expect(parsed.PermissionSet.fieldPermissions).to.not.include({ readable: 'true', editable: 'true', field: `${api}.Indexed_Field2__c` });
        // expect(parsed.PermissionSet.fieldPermissions).to.not.include({ readable: 'true', editable: 'true', field: `${api}.Indexed_Field__c` });
        // expect(parsed.PermissionSet.fieldPermissions).to.not.include({ readable: 'true', editable: 'true', field: `${api}.Required_Non_Indexed_Field__c` });
    });

    it('deploys as valid code', async () => {
        jest.setTimeout(testutils.remoteTimeout);
        if (process.env.LOCALONLY === 'true') {
            console.log('skipping online-only test');
        } else {
            const deploySuccess = await testutils.itDeploys(testProjectName);
            expect(deploySuccess).toBe(true);
        }
    });

    afterAll(async () => {
        await fs.remove(testProjectName);
    });
});
