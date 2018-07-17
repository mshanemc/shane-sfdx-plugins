import { core, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import cli from 'cli-ux';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');
import * as options from '../../../shared/js2xmlStandardOptions';

const typeDefinitions = [
  { type: 'custom',
    forbidden: ['highvolume'],
    specific: ['activities', 'search', 'feeds'],
    ending: '__c'
  },
  {
    type: 'big',
    forbidden: ['highvolume', 'activities'],
    specific: [],
    ending: '__b'
  },
  {
    type: 'event',
    forbidden: ['activities'],
    specific: [],
    ending: '__e'
  }
];

export default class ObjectCreate extends SfdxCommand {

  public static description = 'create an object in local source.  Only __c (limited support), __b (big objects) and events __e are currently supported';

  public static examples = [
`sfdx shane:object:create
// without any params, the cli is going to ask you questions to generate your object interactively
`,
`sfdx shane:object:create --label "Platypus" --plural "Platypi" --api Platypus__b --directory /my/project/path
// label, plural, api name specified so the tool doesn't have to ask you about them.  Creates in a non-default path
`,
`sfdx shane:object:create --label "Platypus" --plural "Platypi" --api Platypus__b --directory /my/project/path
// label, plural, api name specified so the tool doesn't have to ask you about them.  Creates in a non-default path
`,
`sfdx shane:object:create --label "Signal" --plural "Signals" --api Signal__e
// create a platform event
`
  ];

  protected static flagsConfig = {

    type: { type: 'string', char: 't', description: 'type of object', options: typeDefinitions.map(td => td.type)},

    // attributes on all types
    label: { type: 'string',  char: 'l', description: 'label for the UI' },
    api: { type: 'string',  char: 'a', description: 'api name.  Ends with one of the supported types: [__b, __e]' },
    plural: { type: 'string',  char: 'p', description: 'plural label for the UI' },
    description: { type: 'string',  default: 'added from sfdx plugin', description: 'optional description so you can remember why you added this and what it\'s for' },

    // type specific attributes
    activities: { type: 'boolean', description: 'the enableActivities flag on an object (invalid for __b, __e)'},
    search: { type: 'boolean', description: 'the enableSearch flag on an object (invalid for __b, __e)' },
    feeds: { type: 'boolean', description: 'the enableFeeds flag on an object (invalid for __b, __e)' },

    highvolume: { type: 'boolean',  char: 'h', description: 'high volume, valid only for platform events (__e)'},

    // general command params
    interactive: { type: 'boolean', char: 'i', description: 'fully interactive--ask me every possible question.' },
    directory: { type: 'directory',  char: 'd', default: 'force-app/main/default', description: 'where to create the folder (if it doesn\'t exist already) and file...defaults to force-app/main/default' }
  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    interface ObjectConfig {
      '@': {};
      deploymentStatus: string;
      label: string;
      pluralLabel: string;
      indexes?: {};
      eventType?: string;
      description?: string;
    }

    const outputJSON = <ObjectConfig> {
      '@': {
        xmlns: 'http://soap.sforce.com/2006/04/metadata'
      },
      'deploymentStatus': 'Deployed',
      'label' : '',
      'pluralLabel': ''
    };

    // remove trailing slash if someone entered it
    if (this.flags.directory.endsWith('/')) {
      this.flags.directory = this.flags.directory.substring(0, this.flags.directory.length - 1);
    }

    if (!this.flags.type) {
      this.flags.type = await cli.prompt(`Object type [${typeDefinitions.map(td => td.type)}]`);
    }

    if (!this.flags.label) {
      this.flags.label = await cli.prompt('Label for the object?');
    }

    if (!this.flags.plural) {
      this.flags.plural = await cli.prompt('Plural label for the object?', { default: `${this.flags.label}s` } );
    }

    if (!this.flags.api) {
      let suffix = '__c';
      if (this.flags.type === 'big') {
        suffix = '__b';
      } else if (this.flags.type === 'event') {
        suffix = '__e';
      }
      this.flags.api = await cli.prompt(`API name (ends with ${suffix}) ?`, { default: `${this.flags.label.replace(' ', '_')}${suffix}` });
    }

    // checks and throws an error if types and params don't mix
    this.validate(this.flags.type);

    if (this.flags.type === 'big') {
      outputJSON.indexes = {
        fullName : `${this.flags.api.replace('__b', '')}Index`,
        label: `${this.flags.label} Index`,
        fields : []
      };
    }

    outputJSON.label = this.flags.label;
    outputJSON.pluralLabel = this.flags.plural;

    // optional attributes for all types
    if (this.flags.description) {
      outputJSON.description = this.flags.description;
    } else if (this.flags.interactive) {
      outputJSON.description = await cli.prompt('description?  Be nice to your future self!', { required: false });
    }

    // type specific attributes
    if (this.flags.type === 'event') {
      if (this.flags.interactive && !this.flags.highvolume) {
        this.flags.highvolume = await cli.confirm('High Volume (y/n');
      }
      outputJSON.eventType = this.flags.highvolume ? 'HighVolume' : 'StandardVolume';
    }

    const objectsPath = `${this.flags.directory}/objects`;
    const thisObjectFolder = `${this.flags.directory}/objects/${this.flags.api}`;
    const metaFileLocation = `${this.flags.directory}/objects/${this.flags.api}/${this.flags.api}.object-meta.xml`;

    fs.ensureDirSync(objectsPath);

    if (!fs.existsSync(thisObjectFolder)) {
      fs.mkdirSync(thisObjectFolder);
    } else {
      this.ux.error(`Object already exists: ${thisObjectFolder}`);
      return;
    }

    fs.ensureDirSync(`${objectsPath}/${this.flags.api}/fields`);

    const xml = jsToXml.parse('CustomObject', outputJSON, options.js2xmlStandardOptions);

    fs.writeFileSync(metaFileLocation, xml);

    this.ux.log(chalk.green(`Created ${thisObjectFolder}.  Add fields with TBD command`));
  }

  private validate = typename => {
    const found = typeDefinitions.find( t => t.type === typename);
    if (!found) {
      throw new Error(`invalid type specified (${typename})`);
    }
    found.forbidden.forEach( att => {
      if (this.flags[att]) {
        throw new Error (`${att} is not valid for ${typename}`);
      }
    });
    return true;
  }

}
