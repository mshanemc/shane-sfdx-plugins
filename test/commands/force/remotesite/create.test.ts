import { expect, test } from '@salesforce/command/dist/test';
import fs = require('fs-extra');
import util = require('util');
import xml2js = require('xml2js');


const exec = util.promisify(require('child_process').exec);

const testProjectName = 'testProject';

before(async () => {
	await exec(`rm -rf ${testProjectName}`);
	await exec(`sfdx force:project:create -n ${testProjectName}`);
});

describe('force:remotesite:create', () => {

	it('creates a RemSite from url + name', async () => {

		const testRemSite = 'testRemSite';
		const url = 'https://www.salesforce.com';

		await exec(`sfdx force:remotesite:create -u ${url} -n ${testRemSite}`, { cwd: testProjectName});
		expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings`)).to.be.true;
		expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`)).to.be.true;

		const xml = await fs.readFile(`${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`);

		const parser = new xml2js.Parser({ explicitArray : false});
		const parseString = util.promisify(parser.parseString);
		const parsed = await parseString(xml);

		expect(parsed.RemoteSiteSetting).to.be.an('object');
		expect(parsed.RemoteSiteSetting.url).to.equal(url);
		expect(parsed.RemoteSiteSetting.description).to.equal('added from sfdx plugin');
	});

	it('handles description field', async () => {
		const testDescription = "My Description";
		const testRemSite = 'testRemSite2';
		const url = 'https://www.lightning-platform-workshops.com';

		await exec(`sfdx force:remotesite:create -u ${url} -n ${testRemSite} -d "${testDescription}"`, { cwd: testProjectName });
		expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings`)).to.be.true;
		expect(fs.existsSync(`${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`)).to.be.true;

		const xml = await fs.readFile(`${testProjectName}/force-app/main/default/remoteSiteSettings/${testRemSite}.remoteSite-meta.xml`);

		const parser = new xml2js.Parser({ explicitArray: false });
		const parseString = util.promisify(parser.parseString);
		const parsed = await parseString(xml);

		expect(parsed.RemoteSiteSetting).to.be.an('object');
		expect(parsed.RemoteSiteSetting.url).to.equal(url);
		expect(parsed.RemoteSiteSetting.description).to.equal(testDescription);
	});

});

after( async() => {
	await exec(`rm -rf ${testProjectName}`);
});
