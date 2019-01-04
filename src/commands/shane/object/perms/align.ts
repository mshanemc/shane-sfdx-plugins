import { SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');
import * as _ from 'lodash';

import { fixExistingDollarSign, getExisting } from '../../../../shared/getExisting';
import { setupArray } from '../../../../shared/setupArray';

import * as options from '../../../../shared/js2xmlStandardOptions';

export default class PermAlign extends SfdxCommand {

  public static description = 'align profiles with ';

  public static examples = [
`sfdx shane:object:perms:align
// go through all the profiles/permsets in force-app/main/default and remove references to stuff that isn't in local source
`
  ];

  protected static flagsConfig = {
    directory: { type: 'string', char: 'd', default: 'force-app/main/default', description: 'Where is all this metadata?' }
  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const profileDirectory = `${this.flags.directory}/profiles`;
    const permsetDirectory = `${this.flags.directory}/permissionsets`;

    if (!this.flags.specific) {
      // just do all of them

      if (fs.existsSync(profileDirectory)) {
        const profiles = fs.readdirSync(profileDirectory);
        for (const p of profiles) {
          const targetFilename = `${profileDirectory}/${p}`;
          await this.removePerms(targetFilename, 'Profile');
        }
      } else {
        this.ux.warn('no profiles found');
      }

      if (fs.existsSync(permsetDirectory)) {
        const permsets = fs.readdirSync(permsetDirectory);
        for (const p of permsets) {
          const targetFilename = `${permsetDirectory}/${p}`;
          await this.removePerms(targetFilename, 'PermissionSet');
        }
      } else {
        this.ux.warn('no perm sets found');
      }

    } else if (this.flags.specific) {
      // ok, what kind is it and does it exist?
      if (fs.existsSync(`${profileDirectory}/${this.flags.specific}`)) {
        await this.removePerms(this.flags.specific, 'Profile');
      } else if (fs.existsSync(`${permsetDirectory}/${this.flags.specific}`)) {
        await this.removePerms(this.flags.specific, 'PermissionSet');
      } else {
        throw new Error(`not found: ${this.flags.specific}`);
      }
    }
    this.ux.log(chalk.green('Done!'));

  }

  public checkTab(tabName: string, tabs: string[], objects: string[]): boolean { // tslint:disable-line:no-any {
    const tabFileName = tabName + '.tab-meta.xml';
    if (tabs.includes(tabFileName)) {
      return true; // the tab is there locally, so include it in the profile
    } else if (objects.includes(tabName.replace('standard-', ''))) {
      return true; // the object is there locally, so include the tab
    } else {
      return false;
    }
  }

  public async removePerms(targetFilename: string, metadataType: string): Promise<any> { // tslint:disable-line:no-any

    let existing = await getExisting(targetFilename, metadataType);

    const thingsToAlign = ['objectPermissions', 'fieldPermissions', 'layoutAssignments', 'recordTypes', 'tabSettings', 'tabVisibilities', 'profileActionOverrides', 'applicationVisibilities', 'externalDataSourceAccesses'];

    const objDir = `${this.flags.directory}/objects`;
    const objects = fs.existsSync(objDir) ? fs.readdirSync(objDir) : [];
    const layouts = fs.existsSync(`${this.flags.directory}/layouts`) ? fs.readdirSync(`${this.flags.directory}/layouts`) : [];
    const tabs = fs.existsSync(`${this.flags.directory}/tabs`) ? fs.readdirSync(`${this.flags.directory}/tabs`) : [];
    const dataSources = fs.existsSync(`${this.flags.directory}/dataSources`) ? fs.readdirSync(`${this.flags.directory}/dataSources`) : [];
    const applications = fs.existsSync(`${this.flags.directory}/applications`) ? fs.readdirSync(`${this.flags.directory}/applications`) : [];

    for (const mdType of thingsToAlign) {
      existing = setupArray(existing, mdType);
    }

    // objects exist as folders, so they don't have file extensions, just the object name
    existing.objectPermissions = _.filter(existing.objectPermissions, item => {
      if (objects.includes(item.object)) {
        return true;
      } else {
        this.ux.log(`${chalk.cyan(targetFilename)}: removing object perm for ${item.object}`);
        return false;
      }
    });

    // the object exists locally, and if so, the field does, too.
    existing.fieldPermissions = _.filter(existing.fieldPermissions, item => {
      const objectName = item.field.split('.')[0];
      const fieldName = item.field.split('.')[1] + '.field-meta.xml';
      if  (objects.includes(objectName) && fs.readdirSync(`${objDir}/${objectName}/fields`).includes(fieldName)) {
        return true;
      } else {
        this.ux.log(`${chalk.cyan(targetFilename)}: removing field perm for ${item.field}`);
        return false;
      }
    });

    // the object exists AND so does the specified layout
    existing.layoutAssignments = _.filter(existing.layoutAssignments, item => {
      const objectName = item.layout.split('-')[0];
      if (objects.includes(objectName) && layouts.includes(item.layout + '.layout-meta.xml')) {
        return true;
      } else {
        this.ux.log(`${chalk.cyan(targetFilename)}: removing layout assignment for ${item.layout}`);
        return false;
      }
    });

    existing.recordTypeVisibilities = _.filter(existing.recordTypeVisibilities, item => {
      const objectName = item.recordType.split('.')[0];
      const recordTypeName = item.recordType.split('.')[1] + '.recordType-meta.xml';
      if (objects.includes(objectName) && fs.readdirSync(`${objDir}/${objectName}/recordTypes`).includes(recordTypeName)) {
        return true;
      } else {
        this.ux.log(`${chalk.cyan(targetFilename)}: removing recordTypeVisibility for ${item.recordType}`);
        return false;
      }
    });

    existing.tabSettings = _.filter(existing.tabSettings, item => {
      const tabName = item.tab + '.tab-meta.xml';
      if (tabs.includes(tabName)) {
        return true; // the tab is there locally, so include it in the profile
      } else if (objects.includes(item.tab.replace('standard-', ''))) {
        return true; // the object is there locally, so include the tab
      } else {
        this.ux.log(`${chalk.cyan(targetFilename)}: removing tab ${item.tab}`);
        return false;
      }
    });

    existing.tabVisibilities = _.filter(existing.tabVisibilities, item => this.checkTab(item.tab, tabs, objects));
    existing.tabVisibilities = _.filter(existing.tabVisibilities, item => this.checkTab(item.tab, tabs, objects));

    existing.externalDataSourceAccesses = _.filter(existing.externalDataSourceAccesses, item => {
      if ( dataSources.includes(item.externalDataSource + '.dataSource-meta.xml') ) {
        return true;
      } else {
        this.ux.log(`${chalk.cyan(targetFilename)}: removing external data source ${item.externalDataSource}`);
        return false;
      }
    });

    existing.applicationVisibilities = _.filter(existing.applicationVisibilities, item => {
      if (applications.includes(item.application + '.app-meta.xml')) {
        return true;
      } else {
        this.ux.log(`${chalk.cyan(targetFilename)}: removing app ${item.application}`);
        return false;
      }
    });

    // remove empty stuff
    for (const mdType of thingsToAlign) {
      if (existing[mdType].length === 0 ) {
        delete existing[mdType];
      }
    }

    existing = await fixExistingDollarSign(existing);
    // this.ux.logJson(existing);

    const outputXML = jsToXml.parse(metadataType, existing, options.js2xmlStandardOptions);
    fs.writeFileSync(targetFilename, outputXML);
    // this.ux.log(`removed ${objectBefore - existing.objectPermissions.length} objects, ${recordTypeBefore - existing.recordTypeVisibilities.length} recordTypes, ${layoutBefore - existing.layoutAssignments.length} layout, ${fieldBefore - existing.fieldPermissions.length} fields from ${this.flags.object} ${chalk.cyan(targetFilename)}`);
  }
}
