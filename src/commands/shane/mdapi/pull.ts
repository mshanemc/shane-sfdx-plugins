import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import util = require('util');

// source code for packages
import code = require('../../../shared/packageXmls/code_xml');
import all = require('../../../shared/packageXmls/all_xml');
import perms = require('../../../shared/packageXmls/perms_xml');
import schema = require('../../../shared/packageXmls/schema_xml');
import ui = require('../../../shared/packageXmls/ui_xml');

const exec = util.promisify(require('child_process').exec);

const tmpDir = 'mdapiout';
const pkgDir = 'pkgDirTemp';

export default class Pull extends SfdxCommand {

	public static description = 'gets unpackaged metadata for you';

	public static examples = [
		`sfdx force:mdapi:pull -c -u someOrg
		// pulls code kinda stuff from the org and converts/merges it into force-app
		`
	];

	protected static requiresUsername = true;

	protected static flagsConfig = {
		code: flags.boolean({ char: 'c', description: 'Pull apex, VF, Lightning Components, triggers, static resources' }),
		perms: flags.boolean({ char: 'p', description: 'Pull profiles, permsets, roles, groups, customPermissions' }),
		schema: flags.boolean({ char: 's', description: 'Pull objects, fields, recordtypes, valueSets, custom Metadata' }),
		ui: flags.boolean({ char: 'i', description: 'Pull page layouts, tabs, list views, compact layouts, apps, tabs, more' }),
		// TODO: automation, security, reporting, i18n
		all: flags.boolean({description: 'Pulls just about everything.  Don\'t use this flag with any other subset of metadata.  Not recommended for really large metatadat orgs because it\'ll overflow stdout' }),
		target: flags.string({ char: 't', default: 'force-app', description: 'where to convert the result to...defaults to force-app' })
	};

	protected static requiresProject = true;

	async pullUnzipConvert(thing:string){
		process.stdout.write(`Starting retrieval for ${thing}...`);

		const retrieveResult = await exec(`sfdx force:mdapi:retrieve -s -k ${pkgDir}/package.xml -r ./${tmpDir} -w 30 -u ${this.org.getUsername()}`, { maxBuffer: 1000000 * 1024 });

		if (retrieveResult.stderr) {
			this.ux.error(retrieveResult.stderr);
			return;
		}

		await exec(`rm -rf ./${pkgDir}`);
		process.stdout.write('done.  Unzipping...');


		const unzipResult = await exec(`unzip -qqo ./${tmpDir}/unpackaged.zip -d ./${tmpDir}`);
		process.stdout.write('done.  Converting...');

		try {
			const convertResult = await exec(`sfdx force:mdapi:convert -r ./${tmpDir} -d ${this.flags.target} --json`);
			process.stdout.write('done.  Cleaning up...');
		} catch (err) {
			this.ux.errorJson(err);
			this.ux.error('Converting failed--it may have been too much metadata');
		}

		await exec(`rm -rf ./${tmpDir}`);
		process.stdout.write('Done!\n');
	}

	public async run(): Promise<any> { // tslint:disable-line:no-any

		if (!fs.existsSync(this.flags.target)) {
			fs.mkdirSync(this.flags.target);
		}

		if (this.flags.all){
			if (!fs.existsSync(pkgDir)) {
				fs.mkdirSync(pkgDir);
			}
			fs.writeFileSync(`./${pkgDir}/package.xml`, all.xml);
			await this.pullUnzipConvert('all');
		} else {
			// it's individual subsets of metadata

			if (this.flags.code) {
				if (!fs.existsSync(pkgDir)) {
					fs.mkdirSync(pkgDir);
				}
				fs.writeFileSync(`./${pkgDir}/package.xml`, code.xml);
				await this.pullUnzipConvert('code');
			}

			if (this.flags.perms) {
				if (!fs.existsSync(pkgDir)) {
					fs.mkdirSync(pkgDir);
				}
				fs.writeFileSync(`./${pkgDir}/package.xml`, perms.xml);
				await this.pullUnzipConvert('perms');
			}

			if (this.flags.schema) {
				if (!fs.existsSync(pkgDir)) {
					fs.mkdirSync(pkgDir);
				}
				fs.writeFileSync(`./${pkgDir}/package.xml`, schema.xml);
				await this.pullUnzipConvert('schema');
			}

			if (this.flags.ui) {
				if (!fs.existsSync(pkgDir)) {
					fs.mkdirSync(pkgDir);
				}
				fs.writeFileSync(`./${pkgDir}/package.xml`, ui.xml);
				await this.pullUnzipConvert('ui');
			}

		}
	}
}
