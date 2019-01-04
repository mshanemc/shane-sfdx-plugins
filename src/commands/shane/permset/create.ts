import { SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');
import util = require('util');
import xml2js = require('xml2js');

import { fixExistingDollarSign, getExisting } from '../../../shared/getExisting';
import { setupArray } from '../../../shared/setupArray';

import * as options from '../../../shared/js2xmlStandardOptions';


export default class PermSetCreate extends SfdxCommand {

  public static description = 'create or add stuff to a permset with maximum access';

  public static examples = [
`sfdx shane:permset:create -n MyPermSet1 -o Something__c -f Some_Field__c
// create a permset in force-app/main/default for the object/field.  If MyPermSet1 doesn't exist, it will be created.
`,
`sfdx shane:permset:create -n MyPermSet1 -o Something__c
// create a permset in force-app/main/default for every field on Something__c.
`,
`sfdx shane:permset:create -n MyPermSet1
// create a permset in force-app/main/default for every field on every object!
`,
`sfdx shane:permset:create -n MyPermSet1 -t
// create a permset in force-app/main/default for every field on every object.  If there's a tab for any of those objects, add that tab to the permset, too
`
  ];

  protected static flagsConfig = {
    name: { type: 'string',  char: 'n', required: true, description: 'path to existing permset.  If it exists, new perms will be added to it.  If not, then it\'ll be created for you'},
    object: { type: 'string',  char: 'o', description: 'API name of an object to add perms for.  If blank, then you mean ALL the objects and ALL their fields and ALL their tabs' },
    field: { type: 'string',  char: 'f', description: 'API name of an field to add perms for.  Required --object If blank, then you mean all the fields', dependsOn: ['object']},
    directory: { type: 'string',  char: 'd', default: 'force-app/main/default', description: 'Where is all this metadata? defaults to force-app/main/default' },
    tab: { type: 'boolean',  char: 't', description: 'also add the tab for the specified object (or all objects if there is no specified objects)' }

  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    // validations
    if (this.flags.field && ! this.flags.object) {
      this.ux.error(chalk.red('If you say a field, you have to say the object'));
    }

    const targetFilename = `${this.flags.directory}/permissionsets/${this.flags.name}.permissionset-meta.xml`;
    const targetLocationObjects = `${this.flags.directory}/objects`;

    if (this.flags.field && !fs.existsSync(`${targetLocationObjects}/${this.flags.object}/fields/${this.flags.field}.field-meta.xml`)) {
      this.ux.error(`Field does not exist: ${this.flags.fields}`);
      return;
    }

    let existing = await getExisting(targetFilename, 'PermissionSet', {
      '@': {
        xmlns: 'http://soap.sforce.com/2006/04/metadata'
      },
      hasActivationRequired: 'false',
      label: this.flags.name
    });

    let objectList = [];

    if (!this.flags.object) {
      const files = fs.readdirSync(targetLocationObjects);
      objectList = objectList.concat(files);
    } else {
      objectList.push(this.flags.object);
    }

    this.ux.log(`Object list is ${objectList}`);

    // do the objects
    for (const obj of objectList) {
      if (fs.existsSync(`${targetLocationObjects}/${obj}`)) {

        existing = this.addObjectPerms(existing, obj);

        if (this.flags.field) {
          existing = await this.addFieldPerms(existing, this.flags.object, this.flags.field);
        } else { // all the fields
          existing = await this.addAllFieldPermissions(existing, obj);
        }

        if (this.flags.tab && fs.existsSync(`${this.flags.directory}/tabs/${obj}.tab-meta.xml`)) {
          // we're doing tabs, and there is one, so add it to the permset
          existing = this.addTab(existing, obj);
        }
      } else {
        this.ux.error(chalk.red(`Couldn\'t find that object in ${targetLocationObjects}/${this.flags.object}`));
      }
    }

    existing = await fixExistingDollarSign(existing);

    fs.ensureDirSync(`${this.flags.directory}/permissionsets`);

    // conver to xml and write out the file
    const xml = jsToXml.parse('PermissionSet', existing, options.js2xmlStandardOptions);
    fs.writeFileSync(targetFilename, xml);

    this.ux.log(chalk.green(`Permissions added in ${targetFilename}`));
    return existing; // for someone who wants the JSON?
  }

  // public async getExisting(targetFilename: string, name: string, ) {
  //   // get or create permset
  //   if (fs.existsSync(targetFilename)) {
  //     const parser = new xml2js.Parser({ explicitArray: false });
  //     const parseString = util.promisify(parser.parseString);
  //     const existing = await parseString(fs.readFileSync(targetFilename));
  //     return existing.PermissionSet;
  //   } else {
  //     const existing = {
  //       '@': {
  //         xmlns: 'http://soap.sforce.com/2006/04/metadata'
  //       },
  //       'hasActivationRequired': 'false',
  //       'label': name
  //     };
  //     return existing;
  //   }
  // }

  public addObjectPerms(existing, objectName: string) { // tslint:disable-line:no-any
    // make sure it the parent level objectPermissions[] exists

    existing = setupArray(existing, 'objectPermissions');

    if (existing.objectPermissions.find(e => {
      return e.object === objectName;
    })) {
      this.ux.log(`Object Permission already exists: ${objectName}.  Nothing to add.`);
      return existing;
    } else if (objectName.endsWith('__c')) {
      this.ux.log(`Added regular object perms for ${objectName}`);
      existing.objectPermissions.push({
        allowCreate: 'true',
        allowDelete: 'true',
        allowEdit: 'true',
        allowRead: 'true',
        modifyAllRecords: 'true',
        object: objectName,
        viewAllRecords: 'true'
      });
    } else if (objectName.endsWith('__e')) {
      this.ux.log(`Added object perms for platform event ${objectName}`);
      existing.objectPermissions.push({
        allowCreate: 'true',
        allowRead: 'true',
        object: objectName
      });
    } else if (objectName.endsWith('__b')) {
      this.ux.log(`Added object perms for big object ${objectName}`);
      existing.objectPermissions.push({
        allowCreate: 'true',
        allowRead: 'true',
        object: objectName
      });
    }
    return existing;

  }

  public async addFieldPerms(existing, objectName: string, fieldName: string) { // tslint:disable-line:no-any
    // make sure it the parent level objectPermissions[] exists
    const targetLocationObjects = `${this.flags.directory}/objects`;

    existing = setupArray(existing, 'fieldPermissions');

    if (existing.fieldPermissions.find(e => {
      return e.field === `${objectName}.${fieldName}`;
    })) {
      this.ux.log(`Field Permission already exists: ${objectName}.${fieldName}.  Nothing to add.`);
      return existing;
    } else {

      // get the field
      if (fs.existsSync(`${targetLocationObjects}/${objectName}/fields/${fieldName}.field-meta.xml`)) {
        const parser = new xml2js.Parser({ explicitArray: false });
        const parseString = util.promisify(parser.parseString);
        const fieldJSON = await parseString(fs.readFileSync(`${targetLocationObjects}/${objectName}/fields/${fieldName}.field-meta.xml`));

        this.ux.logJson(fieldJSON);

        // Is it required at the DB level?
        if (fieldJSON.CustomField.required === 'true' || fieldJSON.CustomField.type === 'MasterDetail' || !fieldJSON.CustomField.type || fieldJSON.CustomField.fullName === 'OwnerId') {
          this.ux.log(`required field ${objectName}/${fieldName} needs no permissions `);
        } else if (fieldJSON.CustomField.type === 'Summary' || fieldJSON.CustomField.type === 'AutoNumber' || fieldJSON.CustomField.formula) {
          // these are read-only types
          existing.fieldPermissions.push(
            {
              readable: 'true',
              field: `${objectName}.${fieldName}`
            }
          );
          this.ux.log(`Read-only permission added for field ${objectName}/${fieldName} `);

        } else {
          existing.fieldPermissions.push(
            {
              readable: 'true',
              editable: 'true',
              field: `${objectName}.${fieldName}`
            }
          );
          this.ux.log(`Read/Edit permission added for field ${objectName}/${fieldName} `);

        }
      } else {
        throw new Error(`field not found: ${objectName}/${fieldName}`);
      }

      return existing;
    }
  }

  // add field permissions
  public async addAllFieldPermissions(existing, objectName: string) {
    // get all the fields for that object
    this.ux.log(`------ going to add all fields for ${objectName}`);
    const fieldsLocation = `${this.flags.directory}/objects/${objectName}/fields`;

    if (!fs.existsSync(fieldsLocation)) {
      this.ux.warn(chalk.yellow(`there is no fields folder at ${fieldsLocation}`));
      return existing;
    }

    const fields = fs.readdirSync(fieldsLocation);

    // iterate through the field builder thing
    for (const fieldFileName of fields) {
      existing = await this.addFieldPerms(existing, objectName, fieldFileName.split('.')[0]);
    }

    return existing;
  }

  public addTab(existing, objectName: string) {
    // only __c and __x

    // this.ux.log(`doing tab for ${objectName}`);

    if ( ! ( objectName.includes('__c') || objectName.includes('__x') ) ) {
      this.ux.warn(chalk.yellow(`Tab for this object type is not supported: ${objectName}`));
      return existing;
    }

    existing = setupArray(existing, 'tabSettings');

    existing.tabSettings.push({
      tab: objectName,
      visibility: 'Visible'
    });

    this.ux.log(`added tab permission for ${objectName}`);

    // this.ux.log('existing, after all modification is');
    // this.ux.logJson(existing);
    return existing;
  }

}
