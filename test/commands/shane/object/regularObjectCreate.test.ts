/* tslint:disable:no-unused-expression */
import { exec } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectRegularObjectCreate';
const api = 'Corgi__c';
const label = 'Corgi';
const plural = 'Corgi';

describe('shane:object:create (regular object flavor)', () => {
    jest.setTimeout(testutils.localTimeout);

    beforeAll(async () => {
        await fs.remove(testProjectName);
        await exec(`sfdx force:project:create -n ${testProjectName}`);
    });

    it('creates an object with all params supplied for a Text Name', async () => {
        // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path

        await exec(
            `sfdx shane:object:create --type custom --label "${label}" --plural "${plural}" --api ${api} --nametype Text --sharingmodel ReadWrite`,
            { cwd: testProjectName }
        );
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);

        expect(parsed.CustomObject.deploymentStatus).toBe('Deployed');
        expect(parsed.CustomObject.label).toBe(label);
        expect(parsed.CustomObject.pluralLabel).toBe(plural);
        expect(parsed.CustomObject.eventType).toBeUndefined();
        expect(parsed.CustomObject.sharingModel).toBe('ReadWrite');
    });

    it('creates an object with all params supplied for a AutoNumber Name field', async () => {
        // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path
        const ANLabel = 'Sneltie';
        const ANPlural = 'Snelties';
        const ANAPI = 'Sneltie__c';

        await exec(
            `sfdx shane:object:create --type custom --label "${ANLabel}" --plural "${ANPlural}" --api ${ANAPI} --nametype AutoNumber --autonumberformat ${ANLabel}-{0} --sharingmodel ReadWrite`,
            { cwd: testProjectName }
        );

        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}/fields`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}/${ANAPI}.object-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${ANAPI}/${ANAPI}.object-meta.xml`);

        expect(parsed.CustomObject.deploymentStatus).toBe('Deployed');
        expect(parsed.CustomObject.label).toBe(ANLabel);
        expect(parsed.CustomObject.pluralLabel).toBe(ANPlural);
        expect(parsed.CustomObject.eventType).toBeUndefined();
        expect(parsed.CustomObject.sharingModel).toBe('ReadWrite');
        expect(parsed.CustomObject.nameField.type).toBe('AutoNumber');
    });

    it('creates an object with all params supplied for a AutoNumber Name field and every option turned on', async () => {
        // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path
        const ANLabel = 'Shark';
        const ANPlural = 'Sharks';
        const ANAPI = 'Shark__c';

        await exec(
            `sfdx shane:object:create --type custom --label "${ANLabel}" --plural "${ANPlural}" --api ${ANAPI} --nametype AutoNumber --autonumberformat ${ANLabel}-{0} --sharingmodel ReadWrite --enterprise --history --activities --search --reports --feeds`,
            { cwd: testProjectName }
        );

        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}/fields`)).toBe(true);
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${ANAPI}/${ANAPI}.object-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${ANAPI}/${ANAPI}.object-meta.xml`);

        expect(parsed.CustomObject.deploymentStatus).toBe('Deployed');
        expect(parsed.CustomObject.label).toBe(ANLabel);
        expect(parsed.CustomObject.pluralLabel).toBe(ANPlural);
        expect(parsed.CustomObject.eventType).toBeUndefined();
        expect(parsed.CustomObject.sharingModel).toBe('ReadWrite');
        expect(parsed.CustomObject.nameField.type).toBe('AutoNumber');

        expect(parsed.CustomObject.enableActivities).toBe('true');
        expect(parsed.CustomObject.enableBulkApi).toBe('true');
        expect(parsed.CustomObject.enableFeeds).toBe('true');
        expect(parsed.CustomObject.enableHistory).toBe('true');
        expect(parsed.CustomObject.enableReports).toBe('true');
        expect(parsed.CustomObject.enableSearch).toBe('true');
        expect(parsed.CustomObject.enableSharing).toBe('true');
        expect(parsed.CustomObject.enableStreamingApi).toBe('true');
    });

    it('creates a Number field (18,0) on the Object', async () => {
        const fieldAPI = 'Number_Field__c';
        const fieldLabel = 'Number Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Number  --scale 0 --precision 18`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField.type).toBe('Number');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.precision).toBe('18');
        expect(parsed.CustomField.scale).toBe('0');

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('creates a Currency field (18,0) on the Object', async () => {
        const fieldAPI = 'Currency_Field__c';
        const fieldLabel = 'Currency Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Currency  --scale 0 --precision 18`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField.type).toBe('Currency');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.precision).toBe('18');
        expect(parsed.CustomField.scale).toBe('0');

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('creates a Text field on the Object', async () => {
        const fieldAPI = 'Text_Field__c';
        const fieldLabel = 'My Text Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -l 255 -n "${fieldLabel}" -t Text`, { cwd: testProjectName });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField.type).toBe('Text');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.length).toBe('255');

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('creates a Email field on the Object', async () => {
        const fieldAPI = 'Email__c';
        const fieldLabel = 'My Email Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Email`, { cwd: testProjectName });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField.type).toBe('Email');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('creates a Phone field on the Object', async () => {
        const fieldAPI = 'Phone__c';
        const fieldLabel = 'My Phone Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Phone`, { cwd: testProjectName });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField.type).toBe('Phone');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('creates a required text field on the Object', async () => {
        const fieldAPI = 'Required_Text_Field__c';
        const fieldLabel = 'My Text Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -l 255 -n "${fieldLabel}" -t Text --required`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField.type).toBe('Text');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.length).toBe('255');
        expect(parsed.CustomField.required).toBe('true');

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('creates a checkbox field on the Object', async () => {
        const fieldAPI = 'Checkbox_Field__c';
        const fieldLabel = 'My Checkbox Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Checkbox --default true`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField.type).toBe('Checkbox');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.defaultValue).toBe('true');

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('creates a textArea field on the Object', async () => {
        const fieldAPI = 'Text_Area_Field__c';
        const fieldLabel = 'My Text Area Field';

        await exec(`sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t LongTextArea --length 131072`, {
            cwd: testProjectName
        });
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField.type).toBe('LongTextArea');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.visibleLines).toBe('3');

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('can create a lookup to Account', async () => {
        const fieldAPI = 'Account__c';
        const fieldLabel = 'Account Lookup';
        const lookupobject = 'Account';
        const relname = 'Kids';
        const rellabel = 'The Kids';
        const deleteconstraint = 'SetNull';
        await exec(
            `sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Lookup --lookupobject ${lookupobject} --relname ${relname} --rellabel "${rellabel}" --deleteconstraint ${deleteconstraint}`,
            {
                cwd: testProjectName
            }
        );

        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`);

        expect(parsed.CustomField.type).toBe('Lookup');
        expect(parsed.CustomField.label).toBe(fieldLabel);
        expect(parsed.CustomField.fullName).toBe(fieldAPI);
        expect(parsed.CustomField.referenceTo).toBe(lookupobject);
        expect(parsed.CustomField.relationshipLabel).toBe(rellabel);
        expect(parsed.CustomField.relationshipName).toBe(relname);
        expect(parsed.CustomField.deleteConstraint).toBe(deleteconstraint);

        await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`);
    });

    it('can create a recordType on the object', async () => {
        const rtLabel = 'MyRecordType';

        await exec(`sfdx shane:object:recordtype --object ${api} --label ${rtLabel}`, {
            cwd: testProjectName
        });

        const createdFile = `${testProjectName}/force-app/main/default/objects/${api}/recordTypes/${rtLabel}.recordType-meta.xml`;
        expect(fs.existsSync(createdFile)).toBe(true);

        const parsed = await testutils.getParsedXML(createdFile);

        expect(parsed.RecordType.active).toBe('true');
        expect(parsed.RecordType.label).toBe(rtLabel);
        expect(parsed.RecordType.fullName).toBe(rtLabel);
    });

    it('can create a recordType on the object with special Label', async () => {
        const rtLabel = 'RT With Spaced Label';
        const rtName = 'RTWithSpacedLabel';

        await exec(`sfdx shane:object:recordtype --object ${api} --label "${rtLabel}"`, {
            cwd: testProjectName
        });

        const createdFile = `${testProjectName}/force-app/main/default/objects/${api}/recordTypes/${rtName}.recordType-meta.xml`;
        expect(fs.existsSync(createdFile)).toBe(true);

        const parsed = await testutils.getParsedXML(createdFile);

        expect(parsed.RecordType.active).toBe('true');
        expect(parsed.RecordType.label).toBe(rtLabel);
        expect(parsed.RecordType.fullName).toBe(rtName);
    });

    it('can build a permset', async () => {
        const rtLabel = 'MyRecordType';
        const rt2Name = 'RTWithSpacedLabel';

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

        expect(parsed.PermissionSet.fieldPermissions).toHaveLength(8);

        // verify all the fields so far.  Required fields, and fileds required because they're indexed, shouldn't be included

        expect(parsed.PermissionSet.fieldPermissions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ readable: 'true', editable: 'true', field: `${api}.Text_Field__c` }),
                expect.objectContaining({ readable: 'true', editable: 'true', field: `${api}.Email__c` }),
                expect.objectContaining({ readable: 'true', editable: 'true', field: `${api}.Email__c` }),
                expect.objectContaining({ readable: 'true', editable: 'true', field: `${api}.Text_Area_Field__c` }),
                expect.objectContaining({ readable: 'true', editable: 'true', field: `${api}.Phone__c` }),
                expect.objectContaining({ readable: 'true', editable: 'true', field: `${api}.Checkbox_Field__c` }),
                expect.objectContaining({ readable: 'true', editable: 'true', field: `${api}.Account__c` })
            ])
        );

        expect(parsed.PermissionSet.fieldPermissions).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    readable: 'true',
                    editable: 'true',
                    field: `${api}.Required_Text_Field__c`
                })
            ])
        );

        expect(parsed.PermissionSet.recordTypeVisibilities).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    recordType: `${api}.${rtLabel}`,
                    visible: 'true'
                }),
                expect.objectContaining({
                    recordType: `${api}.${rt2Name}`,
                    visible: 'true'
                })
            ])
        );
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
