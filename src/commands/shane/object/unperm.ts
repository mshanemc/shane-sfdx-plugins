import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');

import { fixExistingDollarSign, getExisting } from '../../../shared/getExisting';
import { setupArray } from '../../../shared/setupArray';

import * as options from '../../../shared/js2xmlStandardOptions';

export default class UnPerm extends SfdxCommand {

  public static description = 'remove references to an object from profiles/permsets (all or a specific one)';

  public static examples = [
`sfdx shane:object:unperm -o OpportunitySplit
// go through all the profiles/permsets in force-app/main/default and remove the object, field, recordtypes and layout assignments (profile only) for the named object
`
  ];

  protected static flagsConfig = {
    object: flags.string({ char: 'o', required: true, description: 'remove all references to an object from profiles or permsets' }),
    directory: flags.directory({ char: 'd', default: 'force-app/main/default', description: 'Where is all this metadata? defaults to force-app/main/default' }),
    specific: flags.string({ char: 's', description: 'specify a profile or permset by name to only remove it from that one' })
  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const profileDirectory = `${this.flags.directory}/profiles`;
    const permsetDirectory = `${this.flags.directory}/permissionsets`;

    if (!this.flags.specific) {
      // just do all of them
      const profiles = fs.readdirSync(profileDirectory);
      const permsets = fs.readdirSync(permsetDirectory);

      for (const p of profiles) {
        const targetFilename = `${profileDirectory}/${p}`;
        await this.removePerms(targetFilename, 'Profile');
      }

      for (const p of permsets) {
        const targetFilename = `${permsetDirectory}/${p}`;
        await this.removePerms(targetFilename, 'PermissionSet');
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
  }

  public async removePerms(targetFilename: string, metadataType: string): Promise<any> { // tslint:disable-line:no-any

    let existing = await getExisting(targetFilename, metadataType);

    existing = setupArray(existing, 'objectPermissions');
    existing = setupArray(existing, 'fieldPermissions');
    existing = setupArray(existing, 'layoutAssignments');
    existing = setupArray(existing, 'recordTypes');
    existing = setupArray(existing, 'tabSettings');
    // this.ux.logJson(existing.objectPermissions);
    // this.ux.logJson(existing.fieldPermissions);

    const objectBefore = existing.objectPermissions.length;
    const fieldBefore = existing.fieldPermissions.length;
    const layoutBefore = existing.layoutAssignments.length;
    const recordTypeBefore = existing.recordTypeVisibilities.length;

    existing.objectPermissions = existing.objectPermissions.filter( item => item.object !== this.flags.object);
    existing.fieldPermissions = existing.fieldPermissions.filter( item => !item.field.startsWith(`${this.flags.object}.`));
    existing.layoutAssignments = existing.layoutAssignments.filter( item => !item.layout.startsWith(`${this.flags.object}-`));
    existing.recordTypeVisibilities = existing.recordTypeVisibilities.filter( item => !item.recordType.startsWith(`${this.flags.object}.`));
    existing.tabSettings = existing.tabSettings.filter( item => item.tab !== this.flags.object && item.tab !== `standard-${this.flags.object}`);
    existing.tabVisibilities = existing.tabVisibilities.filter( item => item.tab !== this.flags.object && item.tab !== `standard-${this.flags.object}`);

    existing = await fixExistingDollarSign(existing);

    const outputXML = jsToXml.parse(metadataType, existing, options.js2xmlStandardOptions);
    fs.writeFileSync(targetFilename, outputXML);
    this.ux.log(`removed ${objectBefore - existing.objectPermissions.length} objects, ${recordTypeBefore - existing.recordTypeVisibilities.length} recordTypes, ${layoutBefore - existing.layoutAssignments.length} layout, ${fieldBefore - existing.fieldPermissions.length} fields from ${this.flags.object} ${chalk.blue(targetFilename)}`);

  }
}
