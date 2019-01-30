/* tslint:disable:no-unused-expression */

import { expect } from 'chai';
import child_process = require('child_process');
import fs = require('fs-extra');
import util = require('util');

import testutils = require('../../../helpers/testutils');

const exec = util.promisify(child_process.exec);
const testProjectName = 'testLabelAdd';

describe('shane:label:add', () => {

  before(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
  });

  it('creates reasonable defaults from just text', async () => {

    // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path
    const text = "Let's get crazy. Little trees and bushes grow however makes them happy. The little tiny Tim easels will let you down. You better get your coat out, this is going to be a cold painting. Let's put a touch more of the magic here. Have fun with it.";

    await exec(`sfdx shane:label:add -t "${text}"`, { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/labels/CustomLabels.labels-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/labels/CustomLabels.labels-meta.xml`);

    expect(parsed.CustomLabels).to.be.an('object');
    expect(parsed.CustomLabels.labels).to.be.an('object');
    expect(parsed.CustomLabels.labels.value).to.equal(text);
    expect(parsed.CustomLabels.labels.protected).to.equal('false');
    expect(parsed.CustomLabels.labels.language).to.equal('en_US');

  }).timeout(5000);

  it('adds to an existing labels file', async () => {

    // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path
    const text = "Today's your lucky day. Look around, kiddo - it's all yours. You are now the owner of this fine establishment. Free? Oh ladies, cover your ears. No... not free. Look, hey... this is a squeaky clean, highly profitable (at least potentially), local institution. Look the bottom with favor by the chamber of commerce, better business bureau at three-hundred and twelve thousand dollars, it's a steal.";

    await exec(`sfdx shane:label:add -t "${text}"`, { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/labels/CustomLabels.labels-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/labels/CustomLabels.labels-meta.xml`);

    expect(parsed.CustomLabels.labels).to.be.an('array').with.length(2);
    expect(parsed.CustomLabels.labels[1]).to.be.an('object');
    expect(parsed.CustomLabels.labels[1].value).to.equal(text);
    expect(parsed.CustomLabels.labels[1].protected).to.equal('false');
    expect(parsed.CustomLabels.labels[1].language).to.equal('en_US');

  }).timeout(5000);

  it('handles all the options', async () => {

    // `sfdx shane:object:create --label "Platypus" --plural "${plural}" --api Platypus__b --directory /my / project / path
    const text = "A tiara... a white gold tiara for a newborn baby. Yeah... you know, I think she got that at Gertrude Zachary's in Nob Hill. I mean that thing must have cost like what... five or six hundred dollars? I think I'm going to return it. Well, maybe I can explain.";

    await exec(`sfdx shane:label:add -t "${text}" --bundle customBundle --name Test --description test --language es_MX --categories "Good,Bad,Ugly" --protected` , { cwd: testProjectName });

    expect(fs.existsSync(`${testProjectName}/force-app/main/default/labels/customBundle.labels-meta.xml`)).to.be.true;

    const parsed = await testutils.getParsedXML(`${testProjectName}/force-app/main/default/labels/customBundle.labels-meta.xml`);

    expect(parsed.CustomLabels.labels).to.be.an('object');
    expect(parsed.CustomLabels.labels.value).to.equal(text);
    expect(parsed.CustomLabels.labels.protected).to.equal('true');
    expect(parsed.CustomLabels.labels.language).to.equal('es_MX');
    expect(parsed.CustomLabels.labels.shortDescription).to.equal('test');
    expect(parsed.CustomLabels.labels.fullName).to.equal('Test');

  }).timeout(5000);

  it('deploys as valid code', async () => {
    if (process.env.LOCALONLY === 'true') {
      console.log('skipping online-only test');
    } else {
      const deploySuccess = await testutils.itDeploys(testProjectName);
      expect(deploySuccess).to.be.true;
    }
  });

  after(async () => {
    await fs.remove(testProjectName);
  });
});
