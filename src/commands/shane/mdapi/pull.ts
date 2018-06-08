import { flags } from '@oclif/command';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import util = require('util');

// source code for packages
import code = require('../../../shared/packageXmls/code_xml');
import all = require('../../../shared/packageXmls/all_xml');
import perms = require('../../../shared/packageXmls/perms_xml');
import schema = require('../../../shared/packageXmls/schema_xml');
import ui = require('../../../shared/packageXmls/ui_xml');

import child_process = require('child_process');

const exec = util.promisify(child_process.exec);

const tmpDir = 'mdapiout';
const pkgDir = 'pkgDirTemp';

export default class Pull extends SfdxCommand {

  public static description = 'gets unpackaged metadata for you';

  public static examples = [
`sfdx shane:mdapi:pull -c -u someOrg
// pulls code kinda stuff from the org and converts/merges it into force-app
`
  ];

  protected static requiresUsername = true;

  protected static flagsConfig = {
    code: flags.boolean({ char: 'c', description: 'Pull apex, VF, Lightning Components, triggers, static resources' }),
    perms: flags.boolean({ char: 'p', description: 'Pull profiles, permsets, roles, groups, customPermissions' }),
    schema: flags.boolean({ char: 's', description: 'Pull objects, fields, list views, recordtypes, valueSets, custom Metadata' }),
    ui: flags.boolean({ char: 'i', description: 'Pull page layouts, tabs, compact layouts, apps, tabs, more' }),
    object: flags.string({ char: 'o', description: 'pull metadata for a single object'}),
    // TODO: automation, security, reporting, i18n
    all: flags.boolean({description: 'Pulls just about everything.  Don\'t use this flag with any other subset of metadata.  Not recommended for really large metatadat orgs because it\'ll overflow stdout' }),
    target: flags.string({ char: 't', default: 'force-app', description: 'where to convert the result to...defaults to force-app' })
  };

  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    fs.ensureDirSync(this.flags.target);
    fs.ensureDirSync(pkgDir);

    // validations
    if (this.flags.schema && this.flags.object) {
      this.ux.error('you can\'t choose a single object AND schema');
    }

    if (this.flags.all) {
      fs.writeFileSync(`./${pkgDir}/package.xml`, all.xml);
      await this.pullUnzipConvert('all');
    } else {
      // it's individual subsets of metadata
      if (this.flags.object) {
        const singleObject = `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
	<types>
		<members>${this.flags.object}</members>
		<name>CustomObject</name>
	</types>
	<version>41.0</version>
</Package>`;

        fs.writeFileSync(`./${pkgDir}/package.xml`, singleObject);
        await this.pullUnzipConvert(this.flags.object);
      }

      if (this.flags.code) {
        fs.writeFileSync(`./${pkgDir}/package.xml`, code.xml);
        await this.pullUnzipConvert('code');
      }

      if (this.flags.perms) {
        fs.writeFileSync(`./${pkgDir}/package.xml`, perms.xml);
        await this.pullUnzipConvert('perms');
      }

      if (this.flags.schema) {
        fs.writeFileSync(`./${pkgDir}/package.xml`, schema.xml);
        await this.pullUnzipConvert('schema');
      }

      if (this.flags.ui) {
        fs.writeFileSync(`./${pkgDir}/package.xml`, ui.xml);
        await this.pullUnzipConvert('ui');
      }

    }

  }

  private async pullUnzipConvert(thing: string) {
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
}
