import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import cli from 'cli-ux';

import { ObjectConfig } from '../../../shared/typeDefs';
import { writeJSONasXML } from '../../../shared/JSONXMLtools';
import { removeTrailingSlash } from '../../../shared/flagParsing';

import fs = require('fs-extra');

const typeDefinitions = [
    {
        type: 'custom',
        forbidden: ['highvolume'],
        specificOptions: ['activities', 'search', 'feeds'],
        specificRequired: ['nametype', 'namefieldlabel'],
        ending: '__c'
    },
    {
        type: 'big',
        forbidden: ['highvolume', 'activities', 'sharing', 'search', 'feeds'],
        specificOptions: [],
        ending: '__b'
    },
    {
        type: 'event',
        forbidden: ['activities', 'sharing', 'search', 'feeds'],
        specificOptions: [],
        ending: '__e'
    }
];

export default class ObjectCreate extends SfdxCommand {
    public static description =
        'create an object in local source.  Only __c (limited support), __b (big objects) and events __e are currently supported';

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
        type: flags.string({ char: 't', description: 'type of object', options: typeDefinitions.map(td => td.type) }),

        // attributes on all types
        label: flags.string({ char: 'l', description: 'label for the UI' }),
        api: flags.string({ char: 'a', description: 'api name.  Ends with one of the supported types: [__b, __e]' }),
        plural: flags.string({ char: 'p', description: 'plural label for the UI' }),
        description: flags.string({
            default: 'added from sfdx plugin',
            description: "optional description so you can remember why you added this and what it's for"
        }),

        // type specific attributes
        enterprise: flags.boolean({ description: 'enable bulk/sharing/streaming' }),
        sharingmodel: flags.string({ description: 'sharing model', options: ['Read', 'ReadWrite', 'Private'], default: 'ReadWrite' }),
        activities: flags.boolean({ description: 'the enableActivities flag on an object (invalid for __b, __e)' }),
        search: flags.boolean({ description: 'the enableSearch flag on an object (invalid for __b, __e)' }),
        reports: flags.boolean({ description: 'the enableReports flag on an object (invalid for __b, __e)' }),
        history: flags.boolean({ description: 'the enableHistory flag on an object (invalid for __b, __e)' }),
        feeds: flags.boolean({ description: 'the enableFeeds flag on an object (invalid for __b, __e)' }),
        nametype: flags.string({ description: 'name field type', options: ['Text', 'AutoNumber'] }),
        namefieldlabel: flags.string({ description: 'the label for the name field', default: 'Name' }),
        autonumberformat: flags.string({ description: 'the display format for the autonumbering' }),

        highvolume: flags.boolean({ description: 'high volume, valid only for platform events (__e)' }),

        // general command params
        interactive: flags.boolean({ char: 'i', description: 'fully interactive--ask me every possible question.' }),
        directory: flags.directory({
            char: 'd',
            default: 'force-app/main/default',
            description: "where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default",
            parse: input => removeTrailingSlash(input)
        })
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        const outputJSON = {
            '@': {
                xmlns: 'http://soap.sforce.com/2006/04/metadata'
            },
            deploymentStatus: 'Deployed',
            label: '',
            pluralLabel: ''
        } as ObjectConfig;

        if (!this.flags.type) {
            this.flags.type = await cli.prompt(`Object type [${typeDefinitions.map(td => td.type)}]`, { default: 'custom' });
        }

        if (!this.flags.label) {
            this.flags.label = await cli.prompt('Label for the object?');
        }

        if (!this.flags.plural) {
            this.flags.plural = await cli.prompt('Plural label for the object?', { default: `${this.flags.label}s` });
        }

        if (!this.flags.api) {
            let suffix = '__c';
            if (this.flags.type === 'big') {
                suffix = '__b';
            } else if (this.flags.type === 'event') {
                suffix = '__e';
            }
            this.flags.api = await cli.prompt(`API name (ends with ${suffix}) ?`, {
                default: `${this.flags.label.replace(/ /g, '_')}${suffix}`
            });
        }

        // checks and throws an error if types and params don't mix
        this.validate(this.flags.type);

        if (this.flags.type === 'big') {
            outputJSON.indexes = {
                fullName: `${this.flags.api.replace('__b', '')}Index`,
                label: `${this.flags.label} Index`,
                fields: []
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
                this.flags.highvolume = await cli.confirm('High Volume (y/n)');
            }
            outputJSON.eventType = this.flags.highvolume ? 'HighVolume' : 'StandardVolume';
        }

        // type specific attributes
        if (this.flags.type === 'custom') {
            if (this.flags.interactive && !this.flags.nametype) {
                this.flags.nametype = await cli.prompt('AutoNumber or Text?', { default: 'Text' });
            }
            if (this.flags.interactive && !this.flags.search) {
                this.flags.search = await cli.confirm('enable Search? (y/n)');
            }
            if (this.flags.interactive && !this.flags.feeds) {
                this.flags.feeds = await cli.confirm('enable feeds? (y/n)');
            }
            if (this.flags.interactive && !this.flags.reports) {
                this.flags.reports = await cli.confirm('enable reports? (y/n)');
            }
            if (this.flags.interactive && !this.flags.history) {
                this.flags.history = await cli.confirm('enable history? (y/n)');
            }
            if (this.flags.interactive && !this.flags.activities) {
                this.flags.activities = await cli.confirm('enable activities? (y/n)');
            }
            if (this.flags.interactive && !this.flags.namefieldlabel) {
                this.flags.namefieldlabel = await cli.prompt('What do you want to call the name field?', {
                    default: `${this.flags.label} Name`
                });
            }
            if (this.flags.interactive && !this.flags.sharing) {
                this.flags.sharing = await cli.prompt('Sharing model? [ReadWrite, Read, Private]', { default: 'ReadWrite' });
            }
            if (this.flags.interactive && !this.flags.enterprise) {
                this.flags.enterprise = await cli.confirm('Enable bulk API, sharing, and streaming API? (y/n)');
            }
            if (this.flags.nametype === 'AutoNumber' && !this.flags.autonumberformat) {
                this.flags.autonumberformat = await cli.prompt('Display format', { default: `${this.flags.label}-{0}` });
            }

            outputJSON.nameField = {
                type: this.flags.nametype || 'Text',
                label: this.flags.namefieldlabel
            };

            outputJSON.sharingModel = this.flags.sharingmodel;

            if (this.flags.nametype === 'AutoNumber' && this.flags.autonumberformat) {
                outputJSON.nameField.displayFormat = this.flags.autonumberformat;
            }

            if (this.flags.enterprise) {
                outputJSON.enableSharing = true;
                outputJSON.enableBulkApi = true;
                outputJSON.enableStreamingApi = true;
            }

            if (this.flags.reports) {
                outputJSON.enableReports = true;
            }

            if (this.flags.history) {
                outputJSON.enableHistory = true;
            }

            if (this.flags.activities) {
                outputJSON.enableActivities = true;
            }

            if (this.flags.feeds) {
                outputJSON.enableFeeds = true;
            }

            if (this.flags.search) {
                outputJSON.enableSearch = true;
            }
        }

        const objectsPath = `${this.flags.directory}/objects`;
        const thisObjectFolder = `${objectsPath}/${this.flags.api}`;
        const metaFileLocation = `${thisObjectFolder}/${this.flags.api}.object-meta.xml`;

        if (fs.existsSync(thisObjectFolder)) {
            throw new Error(`Object already exists: ${thisObjectFolder}`);
        }
        await fs.ensureDir(thisObjectFolder);

        fs.ensureDirSync(`${objectsPath}/${this.flags.api}/fields`);
        await writeJSONasXML({
            type: 'CustomObject',
            json: outputJSON,
            path: metaFileLocation
        });
        this.ux.log(`Created ${chalk.green(thisObjectFolder)}.  Add fields with ${chalk.cyan(`sfdx shane:object:field -o ${this.flags.api}`)}.`);
    }

    private validate = typename => {
        const found = typeDefinitions.find(t => t.type === typename);
        if (!found) {
            throw new Error(`invalid type specified (${typename})`);
        }
        found.forbidden.forEach(att => {
            if (this.flags[att]) {
                throw new Error(`${att} is not valid for ${typename}`);
            }
        });
        return true;
    };
}
