import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');

import { removeTrailingSlash } from '../../../shared/flagParsing';

export default class LWCCreate extends SfdxCommand {
    public static description = 'create a lwc locally without need for sfdx project';

    public static examples = [
        `sfdx shane:lwc:create -n someLWC -d modules/namespace
// creates lwc in the given folder path
`
    ];

    protected static flagsConfig = {
        name: flags.string({ char: 'n', required: true, description: 'name it headsDownCamelCase' }),
        directory: flags.directory({
            char: 'd',
            required: true,
            description: "where to create the new lwc's folder",
            parse: input => removeTrailingSlash(input)
        })
    };

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const lwcPath = `${this.flags.directory}/${this.flags.name}`;
        await fs.mkdir(lwcPath);

        await Promise.all([
            fs.writeFile(`${lwcPath}/${this.flags.name}.css`, ''),
            fs.writeFile(`${lwcPath}/${this.flags.name}.html`, htmlFile),
            fs.writeFile(`${lwcPath}/${this.flags.name}.js`, this.getJsFile())
        ]);

        this.ux.log(chalk.green(`Empty LWC created at ${lwcPath}`));
    }

    getJsFile() {
        `import { LightningElement } from 'lwc';

export default class ${this.flags.name.charAt(0).toUpperCase() + this.flags.name.slice(1)} extends LightningElement {

}`;
    }
}

const htmlFile = `<template>

</template>`;
