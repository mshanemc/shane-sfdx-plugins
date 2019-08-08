import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');

import * as options from '../../../shared/js2xmlStandardOptions';

export default class LabelAdd extends SfdxCommand {
    public static description = 'create a ContentAsset from a local image file';

    public static examples = [
        `sfdx shane:contentasset:create -f ~/somefile.jpg -n MyContentAsset
// create a contentAsset called MyContentAsset from the local file
`
    ];

    protected static flagsConfig = {
        file: flags.filepath({ required: true, char: 'f', description: 'the file you want to turn into an asset' }),
        name: flags.string({ required: true, char: 'n', description: 'api name for the contentAsset' }),
        language: flags.string({ description: 'language code like en_US', default: 'en_US' }),
        target: flags.directory({
            char: 't',
            default: 'force-app/main/default',
            description: "where to find the contentassets folder (will create if it doesn't exist already)"
        })
    };

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const assetsFolder = `${this.flags.target}/contentassets`;

        await fs.ensureDir(assetsFolder);
        await fs.copyFile(this.flags.file, `${assetsFolder}/${this.flags.name}.asset`);

        const newMeta = {
            masterLabel: this.flags.name,
            relationships: [
                {
                    organization: {
                        access: 'VIEWER'
                    }
                }
            ],
            language: this.flags.language,
            versions: [
                {
                    version: {
                        number: 1,
                        pathOnClient: this.flags.file
                    }
                }
            ]
        };

        const xml = jsToXml.parse('ContentAsset', newMeta, options.js2xmlStandardOptions);
        await fs.writeFile(`${assetsFolder}/${this.flags.name}.asset-meta.xml`, xml);

        this.ux.log(chalk.green(`Added ${`${assetsFolder}/${this.flags.name}.asset`} in local source`));
        return newMeta;
    }
}
