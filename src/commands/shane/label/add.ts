import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');
import sw = require('stopword');

import { getExisting } from '../../../shared/getExisting';
import { writeJSONasXML } from '../../../shared/JSONXMLtools';
import { setupArray } from '../../../shared/setupArray';
import { CustomLabel } from '../../../shared/typeDefs';

export default class LabelAdd extends SfdxCommand {
    public static description = "create a remote site setting in the local source.  Push it when you're done";

    public static examples = [
        `sfdx shane:label:add -t "This is some Text"
// create a custom label with the displayed text and all the defaults
`
    ];

    protected static flagsConfig = {
        text: flags.string({ required: true, char: 't', description: 'the text you want to turn into a label' }),
        bundle: flags.string({ description: 'label bundle when you want to organize them more', default: 'CustomLabels' }),
        name: flags.string({ char: 'n', description: 'api name for your label' }),
        description: flags.string({ char: 'd', description: 'description for your label' }),
        protected: flags.boolean({ description: 'mark as protected (packaged, subscribers cannot change the label' }),
        categories: flags.array({ description: 'categories to add to your custom label' }),
        language: flags.string({ char: 'l', description: 'language code', default: 'en_US' }),
        target: flags.directory({
            char: 't',
            default: 'force-app/main/default',
            description: "where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default"
        })
    };

    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const labelsFolder = `${this.flags.target}/labels`;
        const targetFilename = `${labelsFolder}/${this.flags.bundle}.labels-meta.xml`;

        await fs.ensureDir(labelsFolder);

        let existing = await getExisting(targetFilename, 'CustomLabels', {
            '@': {
                xmlns: 'http://soap.sforce.com/2006/04/metadata'
            },
            labels: []
        });

        existing = setupArray(existing, 'labels');

        const newLabel: CustomLabel = {
            fullName:
                this.flags.name ??
                sw
                    .removeStopwords(this.flags.text.split(' '))
                    .join(' ')
                    .replace(/[^a-zA-Z0-9]/g, '')
                    .substring(0, 80),
            shortDescription:
                this.flags.description ??
                sw
                    .removeStopwords(this.flags.text.split(' '))
                    .join(' ')
                    .replace(/[^a-zA-Z0-9]/g, '')
                    .substring(0, 80),
            language: this.flags.language,
            protected: this.flags.protected ?? false,
            value: this.flags.text
        };

        if (this.flags.categories) {
            newLabel.categories = this.flags.categories.join(',');
        }

        // verify label doesn't already exist
        if (existing.labels.filter(label => label.fullName === newLabel.fullName).length > 0) {
            throw new Error(`A label with the fullName ${newLabel.fullName} already exists`);
        }

        existing.labels.push(newLabel);

        await writeJSONasXML({
            path: targetFilename,
            type: 'CustomLabels',
            json: existing
        });
        this.ux.log(chalk.green(`Added ${newLabel.fullName} to ${targetFilename} in local source`));

        return existing;
    }
}
