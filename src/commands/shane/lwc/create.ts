import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');

export default class LWCCreate extends SfdxCommand {

  public static description = 'create a lwc locally without need for sfdx project';

  public static examples = [
`sfdx shane:lwc:create -n someLWC -d modules/namespace
// creates lwc in the given folder path
` ];

  protected static flagsConfig = {
    name: flags.string({char: 'n', required: true, description: 'name it headsDownCamelCase' }),
    directory: flags.directory({char: 'd', required: true, description: 'where to create the new lwc\'s folder'})
  };

  public async run(): Promise<any> { // tslint:disable-line:no-any

    // remove trailing slash if someone entered it
    if (this.flags.directory.endsWith('/')) {
      this.flags.directory = this.flags.directory.substring(0, this.flags.directory.length - 1);
    }

    const lwcPath = `${this.flags.directory}/${this.flags.name}`;
    await fs.mkdir(lwcPath);

    await fs.writeFile(`${lwcPath}/${this.flags.name}.css`, '');
    await fs.writeFile(`${lwcPath}/${this.flags.name}.html`,
`<template>

</template>`);
    await fs.writeFile(`${lwcPath}/${this.flags.name}.js`,

`import { LightningElement } from 'lwc';

export default class ${this.flags.name.charAt(0).toUpperCase() + this.flags.name.slice(1)} extends LightningElement {

}`);

    this.ux.log(chalk.green(`Empty LWC created at ${lwcPath}`));
  }
}
