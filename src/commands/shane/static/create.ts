import { flags, SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');

import { writeJSONasXML } from '../../../shared/JSONXMLtools';
import { removeTrailingSlash } from '../../../shared/flagParsing';

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
        type: flags.string({
            char: 'y',
            required: true,
            description: 'choose one of the following: zip, css, js, text, xml',
            options: ['zip', 'css', 'js', 'text', 'xml']
        }),
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
        public: flags.boolean({ char: 'p', default: false, description: 'mark the cache control public' })

        // public: { type: 'boolean',  char: 'p', default: false, description: 'mark the cache control public' })
    };

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const staticPath = `${this.flags.target}/staticresources`;
        const metaPath = `${this.flags.target}/staticresources/${this.flags.name}.resource-meta.xml`;

        // make /staticresources exist if it doesn't already
        if (fs.existsSync(metaPath)) {
            throw new Error(`a static resource by that name already exists at ${metaPath}`);
        }
        await fs.ensureDir(staticPath);

        this.flags.type === 'zip'
            ? await fs.mkdir(`${staticPath}/${this.flags.name}`)
            : await fs.writeFile(`${staticPath}/${this.flags.name}.${suffixMap.get(this.flags.type)}`, '');

        await writeJSONasXML({
            path: metaPath,
            type: 'StaticResource',
            json: {
                '@': {
                    xmlns: 'http://soap.sforce.com/2006/04/metadata'
                },
                cacheControl: this.flags.public ? 'Public' : 'Private',
                contentType: contentTypeMap.get(this.flags.type),
                description: this.flags.description,
                fullName: this.flags.name
            }
        });

        this.ux.log(
            this.flags.type === 'zip'
                ? 'Empty Static Resource folder created locally for you to fill with good things'
                : 'Empty Static Resource created locally'
        );
    }
}

const contentTypeMap = new Map([
    ['zip', 'application/zip'],
    ['css', 'text/css'],
    ['js', 'application/javascript'],
    ['text', 'text/plan'],
    ['xml', 'application/xml']
]);

const suffixMap = new Map([
    ['css', '.css'],
    ['js', '.js'],
    ['text', '.txt'],
    ['xml', '.xml']
]);
