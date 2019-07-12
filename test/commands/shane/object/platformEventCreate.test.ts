/* tslint:disable:no-unused-expression */

import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);

const testProjectName = 'testProjectPlatformEventCreate';
const api = 'Hello__e';
const label = 'Hello';
const plural = 'Hellos';

describe('shane:object:create (platform event flavor)', () => {
    jest.setTimeout(testutils.localTimeout);

    beforeAll(async () => {
        await fs.remove(testProjectName);
        await exec(`sfdx force:project:create -n ${testProjectName}`);
    });

    it('creates a platform event with all params supplied', async () => {
        // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path

        await exec(`sfdx shane:object:create --type event --label "${label}" --plural "${plural}" --api ${api}`, { cwd: testProjectName });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

        expect(parsed.CustomObject).toBeTruthy();
        expect(parsed.CustomObject.deploymentStatus).toBe('Deployed');
        expect(parsed.CustomObject.label).toBe(label);
        expect(parsed.CustomObject.pluralLabel).toBe(plural);
        expect(parsed.CustomObject.eventType).toBe('StandardVolume');
    });

    it('creates a Number field (18,0) on the Event', async () => {
        const fieldAPI = 'Number_Field__c';
        const fieldLabel = 'Number Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Number  --scale 0 --precision 18`, {
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

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('creates a Text field on the Event', async () => {
        const fieldAPI = 'Text_Field__c';
        const fieldLabel = 'My Text Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -l 255 -n "${fieldLabel}" -t Text`, { cwd: testProjectName });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField).toBeTruthy();
        expect(parsed.CustomField.type).toBe('Text');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.length).toBe('255');

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('creates a required text field on the Event', async () => {
        const fieldAPI = 'Required_Text_Field__c';
        const fieldLabel = 'My Text Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -l 255 -n "${fieldLabel}" -t Text --required`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField).toBeTruthy();
        expect(parsed.CustomField.type).toBe('Text');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.length).toBe('255');
        expect(parsed.CustomField.required).toBe('true');

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('creates a checkbox field on the Event', async () => {
        const fieldAPI = 'Checkbox_Field__c';
        const fieldLabel = 'My Checkbox Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Checkbox --default true`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField).toBeTruthy();
        expect(parsed.CustomField.type).toBe('Checkbox');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.defaultValue).toBe('true');

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('can build a permset', async () => {
        const permSetName = 'MyEventPerm';
        await exec(`sfdx shane:permset:create -n ${permSetName} -o ${api}`, { cwd: testProjectName });

        expect(fs.existsSync(`${testProjectName}/force-app/main/default/permissionsets`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/permissionsets/${permSetName}.permissionset-meta.xml`)).toBe(true);

        // parse the permset
        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/permissionsets/${permSetName}.permissionset-meta.xml`);

        // verify object
        expect(parsed.PermissionSet).toBeTruthy();
        expect(parsed.PermissionSet.objectPermissions).toBeTruthy();
        expect(parsed.PermissionSet.objectPermissions.object).toBe(api);

        expect(parsed.PermissionSet.fieldPermissions).toHaveLength(3);

        // verify all the fields so far.  Required fields, and fileds required because they're indexed, shouldn't be included
        parsed.PermissionSet.fieldPermissions.forEach(element => {
            expect(element.readable).toBe('true');
            expect(element.editable).toBe('true');
        });

        expect(parsed.PermissionSet.fieldPermissions.find(perm => perm.field === `${api}.Number_Field__c`)).toBeTruthy();
        expect(parsed.PermissionSet.fieldPermissions.find(perm => perm.field === `${api}.Text_Field__c`)).toBeTruthy();
        expect(parsed.PermissionSet.fieldPermissions.find(perm => perm.field === `${api}.Checkbox_Field__c`)).toBeTruthy();
        expect(parsed.PermissionSet.fieldPermissions.find(perm => perm.field === `${api}.Required_Text_Field__c`)).toBeFalsy();
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
