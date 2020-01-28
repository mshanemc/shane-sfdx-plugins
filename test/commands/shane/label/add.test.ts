/* tslint:disable:no-unused-expression */

import { exec } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'testProjectLabelAdd';

describe('shane:label:add', () => {
    jest.setTimeout(testutils.localTimeout);

    beforeAll(async () => {
        await fs.remove(testProjectName);
        await exec(`sfdx force:project:create -n ${testProjectName}`);
    });

    test('creates reasonable defaults from just text', async () => {
        // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path
        const text =
            "Let's get crazy. Little trees and bushes grow however makes them happy. The little tiny Tim easels will let you down. You better get your coat out, this is going to be a cold painting. Let's put a touch more of the magic here. Have fun with it.";

        await exec(`sfdx shane:label:add -t "${text}"`, { cwd: testProjectName });

        expect(fs.existsSync(`${testProjectName}/force-app/main/default/labels/CustomLabels.labels-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/labels/CustomLabels.labels-meta.xml`);

        expect(parsed.CustomLabels).toBeTruthy();
        expect(parsed.CustomLabels.labels).toBeTruthy();
        expect(parsed.CustomLabels.labels.value).toBe(text);
        expect(parsed.CustomLabels.labels.protected).toBe('false');
        expect(parsed.CustomLabels.labels.language).toBe('en_US');
    });

    test('adds to an existing labels file', async () => {
        // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path
        const text =
            "Today's your lucky day. Look around, kiddo - it's all yours. You are now the owner of this fine establishment. Free? Oh ladies, cover your ears. No... not free. Look, hey... this is a squeaky clean, highly profitable (at least potentially), local institution. Look the bottom with favor by the chamber of commerce, better business bureau at three-hundred and twelve thousand dollars, it's a steal.";

        await exec(`sfdx shane:label:add -t "${text}"`, { cwd: testProjectName });

        expect(fs.existsSync(`${testProjectName}/force-app/main/default/labels/CustomLabels.labels-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/labels/CustomLabels.labels-meta.xml`);

        expect(parsed.CustomLabels.labels).toHaveLength(2);
        expect(parsed.CustomLabels.labels[1]).toBeTruthy();
        expect(parsed.CustomLabels.labels[1].value).toBe(text);
        expect(parsed.CustomLabels.labels[1].protected).toBe('false');
        expect(parsed.CustomLabels.labels[1].language).toBe('en_US');
    });

    test('handles all the options', async () => {
        // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path
        const text =
            "A tiara... a white gold tiara for a newborn baby. Yeah... you know, I think she got that at Gertrude Zachary's in Nob Hill. I mean that thing must have cost like what... five or six hundred dollars? I think I'm going to return it. Well, maybe I can explain.";

        await exec(
            `sfdx shane:label:add -t "${text}" --bundle customBundle --name Test --description test --language es_MX --categories "Good,Bad,Ugly" --protected`,
            { cwd: testProjectName }
        );

        expect(fs.existsSync(`${testProjectName}/force-app/main/default/labels/customBundle.labels-meta.xml`)).toBe(true);

        const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/labels/customBundle.labels-meta.xml`);

        expect(parsed.CustomLabels.labels).toBeTruthy();
        expect(parsed.CustomLabels.labels.value).toBe(text);
        expect(parsed.CustomLabels.labels.protected).toBe('true');
        expect(parsed.CustomLabels.labels.language).toBe('es_MX');
        expect(parsed.CustomLabels.labels.shortDescription).toBe('test');
        expect(parsed.CustomLabels.labels.fullName).toBe('Test');
    });

    test('deploys as valid code', async () => {
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
