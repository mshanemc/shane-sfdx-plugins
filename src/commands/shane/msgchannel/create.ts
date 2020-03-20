import { flags, SfdxCommand } from '@salesforce/command';

import { AnyJson } from '@salesforce/ts-types';
import { writeJSONasXML } from '../../../shared/JSONXMLtools';
import { removeTrailingSlash } from '../../../shared/flagParsing';

import fs = require('fs-extra');

export default class MessageChannelCreate extends SfdxCommand {
    public static description = 'create a lightning message channel locally';

    public static examples = [
        `sfdx shane:msgchannel:create -n wkrp -d "it's a message channel, yo" -f Field1,Field2,Field3
// creates a messageChannel with the given name, description, and fields
`
    ];

    protected static flagsConfig = {
        name: flags.string({ char: 'n', required: true, description: 'name it (Salesforce API compliant name)' }),
        description: flags.string({
            char: 'd',
            default: 'added from sfdx plugin',
            description: "optional description so you can remember why you added this and what it's for"
        }),
        target: flags.directory({
            char: 't',
            default: 'force-app/main/default',
            description: "where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default",
            parse: input => removeTrailingSlash(input)
        }),
        exposed: flags.boolean({ char: 'e', default: false, description: 'accessible outside your namespace (this is PERMANENT!)' }),
        fields: flags.array({ char: 'f', description: 'fields to create on the message channel' })
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        const staticPath = `${this.flags.target}/messageChannels`;
        const metaPath = `${this.flags.target}/messageChannels/${this.flags.name}.messageChannel-meta.xml`;

        // make /staticresources exist if it doesn't already
        if (fs.existsSync(metaPath)) {
            throw new Error(`a channel by that name already exists at ${metaPath}`);
        }
        await fs.ensureDir(staticPath);

        const output: AnyJson = {
            '@': {
                xmlns: 'http://soap.sforce.com/2006/04/metadata'
            },
            description: this.flags.description,
            masterLabel: this.flags.name,
            isExposed: this.flags.exposed
        };

        if (this.flags.fields) {
            output.lightningMessageFields = this.flags.fields.map(fieldName => ({
                fieldName
            }));
        }
        await writeJSONasXML({ path: metaPath, type: 'LightningMessageChannel', json: output });

        this.ux.log(`new messageChannel created at ${metaPath}`);
    }
}
