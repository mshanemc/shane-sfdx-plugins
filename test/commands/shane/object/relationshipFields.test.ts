/* tslint:disable:no-unused-expression */
import { exec } from '../../../../src/shared/execProm';

import { FieldMeta } from '../../../../src/shared/typeDefs';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectRelationshipFields';
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

    it('makes a lookup field', async () => {
        const fieldAPI = 'Lookup__c';
        const fieldLabel = 'Lookup Field';
        const referenceTo = 'Contact';
        await exec(
            `sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t Lookup --lookupobject ${referenceTo} --relname Tests --rellabel Tests`,
            {
                cwd: testProjectName
            }
        );
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed: FieldMeta = (
            await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)
        ).CustomField;

        // const field:FieldMeta =
        expect(parsed.type).toBe('Lookup');
        expect(parsed.label).toBe(fieldLabel);
        expect(parsed.fullName).toBe(fieldAPI);
        expect(parsed.deleteConstraint).toBe('SetNull');
        expect(parsed.referenceTo).toBe(referenceTo);
    });
    it('makes the first master/detail field', async () => {
        const fieldAPI = 'MD1__c';
        const fieldLabel = 'MD1';
        const referenceTo = 'Account';
        await exec(
            `sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t MasterDetail --lookupobject ${referenceTo} --relname Tests --rellabel Tests`,
            {
                cwd: testProjectName
            }
        );
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed: FieldMeta = (
            await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)
        ).CustomField;

        // const field:FieldMeta =
        expect(parsed.type).toBe('MasterDetail');
        expect(parsed.label).toBe(fieldLabel);
        expect(parsed.fullName).toBe(fieldAPI);
        expect(parsed.reparentableMasterDetail).toBe('false');
        expect(parsed.writeRequiresMasterRead).toBe('false');
        expect(parsed.relationshipOrder).toBe('0');
        expect(parsed.referenceTo).toBe(referenceTo);

        const parsedObj = (await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/${api}.object-meta.xml`))
            .CustomObject;

        expect(parsedObj.externalSharingModel).toBe('ControlledByParent');
        expect(parsedObj.sharingModel).toBe('ControlledByParent');
    });

    it('makes a second master/detail field', async () => {
        const fieldAPI = 'MD2__c';
        const fieldLabel = 'MD2';
        const referenceTo = 'Case';
        await exec(
            `sfdx shane:object:field --object ${api} --api ${fieldAPI} -n "${fieldLabel}" -t MasterDetail --lookupobject ${referenceTo} --relname Tests --rellabel Tests`,
            {
                cwd: testProjectName
            }
        );
        expect(fs.existsSync(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)).toBe(true);

        const parsed: FieldMeta = (
            await testutils.getParsedXML(`${testProjectName}/force-app/main/default/objects/${api}/fields/${fieldAPI}.field-meta.xml`)
        ).CustomField;

        // const field:FieldMeta =
        expect(parsed.type).toBe('MasterDetail');
        expect(parsed.label).toBe(fieldLabel);
        expect(parsed.fullName).toBe(fieldAPI);
        expect(parsed.reparentableMasterDetail).toBe('false');
        expect(parsed.writeRequiresMasterRead).toBe('false');
        expect(parsed.relationshipOrder).toBe('1');
        expect(parsed.referenceTo).toBe(referenceTo);
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
