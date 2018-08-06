import { SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');

import * as options from '../../../shared/js2xmlStandardOptions';

import chalk from 'chalk';

export default class RemoteSite extends SfdxCommand {

  public static description = 'create a remote site setting in the local source.  Push it when you\'re done';

  public static examples = [
`sfdx shane:remotesite:create -n Test -u https://www.google.com
// create a remote site setting in force-app/main/default
`,
`sfdx shane:remotesite:create -n Test -u https://www.google.com -d "my description" -t myOtherDirectory/main/default
// create a remote site setting in myOtherDirectory/main/default with a description
`
  ];

  protected static flagsConfig = {
    url: { type: 'string',  char: 'u', required: true, description: 'url that you want to allow callouts to' },
    name: { type: 'string',  char: 'n', required: true, description: 'name it (Salesforce API compliant name)' },
    description: { type: 'string',  char: 'd', default: 'added from sfdx plugin', description: 'optional description so you can remember why you added this and what it\'s for' },
    target: { type: 'string',  char: 't', default: 'force-app/main/default', description: 'where to create the folder (if it doesn\'t exist already) and file...defaults to force-app/main/default' }
  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    if (this.flags.name.includes(' ')) {
      this.ux.error(chalk.red('spaces are not allowed in the name'));
    }

    // remove trailing slash if someone entered it
    if (this.flags.target.endsWith('/')) {
      this.flags.target = this.flags.target.substring(0, this.flags.target.length - 1);
    }

    fs.ensureDirSync(`${this.flags.target}/remoteSiteSettings`);

    const settingJSON = {
      '@' : {
        xmlns: 'http://soap.sforce.com/2006/04/metadata'
      },
      'url' : this.flags.url,
      'disableProtocolSecurity' : false,
      'isActive' : true,
      'description': this.flags.description
    };

    const xml = jsToXml.parse('RemoteSiteSetting', settingJSON, options.js2xmlStandardOptions);

    fs.writeFileSync(`${this.flags.target}/remoteSiteSettings/${this.flags.name}.remoteSite-meta.xml`, xml);

    this.ux.log(chalk.green('Remote site created locally'));
  }
}
