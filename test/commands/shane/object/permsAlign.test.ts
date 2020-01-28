/* tslint:disable:no-unused-expression */
import { exec } from '../../../../src/shared/execProm';
import { getExisting } from '../../../../src/shared/getExisting';
import { setupArray } from '../../../../src/shared/setupArray';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectObjectProfileAlign';

const fieldName = 'Customer__c';
const objectName = 'Delivery__c';
const objectPath = `objects/${objectName}`;
const fieldPath = `${objectPath}/fields/${fieldName}.field-meta.xml`;
const defaultPath = 'force-app/main/default';
const layoutName = `${objectName}-${objectName.replace('__c', '')} Layout`;

const layoutPath = `layouts/${layoutName}.layout-meta.xml`;

const permsetName = 'TestPermSet';
const permsetFullPath = `${testProjectName}/${defaultPath}/permissionsets/${permsetName}.permissionset-meta.xml`;

describe('profile convert (just create a permset from a profile)', () => {
    jest.setTimeout(testutils.localTimeout);

    // get a clean copy of the original repo
    beforeEach(async () => {
        await fs.remove(testProjectName);
        await fs.copy('test/golden-copy-test-repo', testProjectName);
    });

    test('removes a field and verifies not on profile', async () => {
        // object/field exists
        expect(fs.existsSync(`${testProjectName}/${defaultPath}/${objectPath}`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/${defaultPath}/${fieldPath}`)).toBe(true);
        // profile permission exists
        const profilePath = `${testProjectName}/${defaultPath}/profiles/Admin.profile-meta.xml`;

        expect(fs.existsSync(profilePath)).toBe(true);
        const existingProfile = await getExisting(profilePath, 'Profile');
        expect(existingProfile.objectPermissions.find(item => item.object === objectName)).toBeTruthy();
        expect(existingProfile.fieldPermissions.find(item => item.field === `${objectName}.${fieldName}`)).toBeTruthy();
        expect(existingProfile.layoutAssignments.find(item => item.layout === layoutName)).toBeTruthy();

        // remove field
        await fs.remove(`${testProjectName}/${defaultPath}/${fieldPath}`);
        expect(fs.existsSync(`${testProjectName}/${defaultPath}/${fieldPath}`)).toBe(false);

        // run perms align
        await exec(`sfdx shane:object:perms:align`, { cwd: testProjectName });
        // check for field's non-existence
        const modifiedProfile = await getExisting(profilePath, 'Profile');
        expect(modifiedProfile.objectPermissions.find(item => item.object === objectName)).toBeTruthy();
        expect(modifiedProfile.layoutAssignments.find(item => item.layout === layoutName)).toBeTruthy();
        expect(modifiedProfile.fieldPermissions.find(item => item.field === `${objectName}.${fieldName}`)).toBeFalsy();
    });

    test('removes an object and verifies field, object, layout not on profile', async () => {
        // stuff exists
        expect(fs.existsSync(`${testProjectName}/${defaultPath}/${objectPath}`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/${defaultPath}/${fieldPath}`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/${defaultPath}/${layoutPath}`)).toBe(true);

        // profile permission exists
        const profilePath = `${testProjectName}/${defaultPath}/profiles/Admin.profile-meta.xml`;

        expect(fs.existsSync(profilePath)).toBe(true);
        const existingProfile = await getExisting(profilePath, 'Profile');
        expect(existingProfile.objectPermissions.find(obj => obj.object === objectName)).toBeTruthy();
        expect(existingProfile.fieldPermissions.find(field => field.field === `${objectName}.${fieldName}`)).toBeTruthy();
        expect(existingProfile.layoutAssignments.find(item => item.layout === layoutName)).toBeTruthy();

        // remove object
        await fs.remove(`${testProjectName}/${defaultPath}/${objectPath}`);
        expect(fs.existsSync(`${testProjectName}/${defaultPath}/${objectPath}`)).toBe(false);

        // run perms align
        await exec(`sfdx shane:object:perms:align`, { cwd: testProjectName });
        // check for object AND field's non-existence
        const modifiedProfile = await getExisting(profilePath, 'Profile');
        expect(modifiedProfile.objectPermissions.find(item => item.object === objectName)).toBeFalsy();
        expect(modifiedProfile.fieldPermissions.find(item => item.field === `${objectName}.${fieldName}`)).toBeFalsy();
        expect(modifiedProfile.layoutAssignments.find(item => item.layout === layoutName)).toBeFalsy();
    });

    test('creates a permset from an object, then removes a field and verifies not on permset', async () => {
        await exec(`sfdx shane:permset:create -n ${permsetName} -o ${objectName}`, { cwd: testProjectName });

        const existingPermSet = setupArray(setupArray(await getExisting(permsetFullPath, 'PermissionSet'), 'objectPermissions'), 'fieldPermissions');

        expect(fs.existsSync(permsetFullPath)).toBe(true);

        expect(existingPermSet.objectPermissions.find(obj => obj.object === objectName)).toBeTruthy();
        expect(existingPermSet.fieldPermissions.find(field => field.field === `${objectName}.${fieldName}`)).toBeTruthy();

        // remove field
        await fs.remove(`${testProjectName}/${defaultPath}/${fieldPath}`);
        expect(fs.existsSync(`${testProjectName}/${defaultPath}/${fieldPath}`)).toBe(false);
        await exec(`sfdx shane:object:perms:align`, { cwd: testProjectName });

        const modifiedPermset = setupArray(setupArray(await getExisting(permsetFullPath, 'PermissionSet'), 'objectPermissions'), 'fieldPermissions');
        expect(modifiedPermset.objectPermissions.find(item => item.object === objectName)).toBeTruthy();
        expect(modifiedPermset.fieldPermissions.find(item => item.field === `${objectName}.${fieldName}`)).toBeFalsy();

        // remove object
        await fs.remove(`${testProjectName}/${defaultPath}/${objectPath}`);
        expect(fs.existsSync(`${testProjectName}/${defaultPath}/${objectPath}`)).toBe(false);
        await exec(`sfdx shane:object:perms:align`, { cwd: testProjectName });

        const modifiedPermset2 = setupArray(setupArray(await getExisting(permsetFullPath, 'PermissionSet'), 'objectPermissions'), 'fieldPermissions');
        expect(modifiedPermset2.objectPermissions.find(item => item.object === objectName)).toBeFalsy();
        expect(modifiedPermset2.fieldPermissions.find(item => item.field === `${objectName}.${fieldName}`)).toBeFalsy();
    });

    afterAll(async () => {
        await fs.remove(testProjectName); // don't leave a mess
    });
});
