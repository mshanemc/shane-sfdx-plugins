import { SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');

import * as options from '../../../shared/js2xmlStandardOptions';

import chalk from 'chalk';

export default class PowerOfOne extends SfdxCommand {

  public static description = 'add a "power of one" formula field to any object';

  public static examples = [
`sfdx shane:object:powerofone -a Poo -l "Power of One" -o User
// create a field with api name Poo__c and label "Power of One" on the user object with the default description in the default folder
`
  ];

  protected static flagsConfig = {
    object: { type: 'string', char: 'o', required: true, description: 'API name of the object to add the field to' },
    label: { type: 'string', char: 'l', default: 'Power Of One', description: 'label' },
    api: { type: 'string', char: 'a', default: 'Power_Of_One__c', description: 'api name (will include the __c for you if you don\'t add it here' },
    description: { type: 'string', char: 'd', default: 'Power of one is used for formulas, reporting, etc', description: 'optional description so you can remember why you added this and what it\'s for' },
    target: { type: 'string', char: 't', default: 'force-app/main/default', description: 'where to create the folder (if it doesn\'t exist already) and file...defaults to force-app/main/default' }
  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    if (this.flags.api.includes(' ')) {
      this.ux.error(chalk.red('spaces are not allowed in the api name'));
    }

    if (!this.flags.api.includes('__c')) {
      this.flags.api = `${this.flags.api}__c`;
    }

    // remove trailing slash if someone entered it
    if (this.flags.target.endsWith('/')) {
      this.flags.target = this.flags.target.substring(0, this.flags.target.length - 1);
    }

    fs.ensureDirSync(`${this.flags.target}/objects`);
    fs.ensureDirSync(`${this.flags.target}/objects/${this.flags.object}`);
    fs.ensureDirSync(`${this.flags.target}/objects/${this.flags.object}/fields`);

    const fieldJSON = {
      '@': {
        xmlns: 'http://soap.sforce.com/2006/04/metadata'
      },
      fullName: this.flags.api,
      externalId: false,
      formula: 1,
      formulaTreatBlanksAs: 'BlankAsZero',
      label: this.flags.label,
      precision: 18,
      required: false,
      scale: 0,
      type: 'Number',
      unique: false,
      description: this.flags.description
    };

    const xml = jsToXml.parse('CustomField', fieldJSON, options.js2xmlStandardOptions);

    fs.writeFileSync(`${this.flags.target}/objects/${this.flags.object}/fields/${this.flags.api}.field-meta.xml`, xml);

    this.ux.log(`${chalk.green('Power of One field created for you')}.  It's only local...push to deploy.`);
  }
}
