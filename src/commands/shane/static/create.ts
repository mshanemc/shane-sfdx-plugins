import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');
import cli from 'cli-ux';

import chalk from 'chalk';
import * as options from '../../../shared/js2xmlStandardOptions';

export default class StaticCreate extends SfdxCommand {

  public static description = 'create a static resource locally';

  public static examples = [
`sfdx shane:static:create -n myJSResource -y js
// creates /staticresources/myJSResource.js (empty file) and  /staticresources/myJSResource.resource-meta.xml
`,
`sfdx shane:static:create -n myZipResource -y js -d "my description" -t myOtherDirectory/main/default
// create an empty folder (zips when pushed), the meta.xml, with a description in a non-default directory.
`
  ];

  protected static flagsConfig = {
    name: flags.string({ char: 'n', required: true, description: 'name it (Salesforce API compliant name)' }),
    type: flags.string({ char: 'y', required: true, description: 'choose one of the following: zip, css, js, text, xml', options: ['zip', 'css', 'js', 'text', 'xml'] }),
    description: flags.string({ char: 'd', default: 'added from sfdx plugin', description: 'optional description so you can remember why you added this and what it\'s for' }),
    target: flags.string({ char: 't', default: 'force-app/main/default', description: 'where to create the folder (if it doesn\'t exist already) and file...defaults to force-app/main/default' }),
    public: { type: 'boolean', char: 'p', default: false, description: 'mark the cache control public'	}

    // public: flags.boolean({ char: 'p', default: false, description: 'mark the cache control public' })
  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    let contentType;
    const staticPath = `${this.flags.target}/staticresources`;
    const metaPath = `${this.flags.target}/staticresources/${this.flags.name}.resource-meta.xml`;

    // remove trailing slash if someone entered it
    if (this.flags.target.endsWith('/')) {
      this.flags.target = this.flags.target.substring(0, this.flags.target.length - 1);
    }

    // make /staticresources exist if it doesn't already
    if (!fs.existsSync(staticPath)) {
      fs.mkdirSync(staticPath);
    } else if (fs.existsSync(metaPath)) {
      this.ux.error(chalk.red(`a static resource by that name already exists at ${metaPath}`));
      return;
    }

    switch (this.flags.type) {
      case 'zip':
        // make a folder with the name
        fs.mkdirSync(`${staticPath}/${this.flags.name}`);
        contentType = 'application/zip';
        break;
      case 'css':
        // make a file with that name
        contentType = 'text/css';
        fs.writeFileSync(`${staticPath}/${this.flags.name}.css`, '');
        break;
      case 'js':
        // make a file with that name
        contentType = 'application/javascript';
        fs.writeFileSync(`${staticPath}/${this.flags.name}.js`, '');
        break;
      case 'text':
        // make a file with that name
        contentType = 'text/plain';
        fs.writeFileSync(`${staticPath}/${this.flags.name}.txt`, '');
        break;
      case 'xml':
        // make a file with that name
        contentType = 'application/xml';
        fs.writeFileSync(`${staticPath}/${this.flags.name}.xml`, '');
        break;
      default:
        this.ux.error(`unsupported file type ${this.flags.type}.  Valid are zip, text, js, xml, css`);
    }

    const metaJSON = {
      '@': {
        xmlns: 'http://soap.sforce.com/2006/04/metadata'
      },
      'cacheControl': this.flags.public ? 'Public' : 'Private',
      'contentType': contentType,
      'description': this.flags.description,
      'fullName': this.flags.name
    };

    const xml = jsToXml.parse('StaticResource', metaJSON, options.js2xmlStandardOptions);

    fs.writeFileSync(metaPath, xml);

    if (this.flags.type === 'zip') {
      this.ux.log(chalk.green('Empty Static Resource folder created locally for you to fill with good things'));
    } else {
      this.ux.log(chalk.green('Empty Static Resource created locally'));
    }
  }
}
