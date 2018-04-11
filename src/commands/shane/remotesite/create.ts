import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');
import cli from 'cli-ux'


const chalk = require('chalk');

export default class RemoteSite extends SfdxCommand {

	public static description = 'create a remote site setting in the local source.  Push it when you\'re done';

	public static examples = [
`sfdx force:remotesite:create -n Test -u https://www.google.com
// create a remote site setting in force-app/main/default
`,
`sfdx force:remotesite:create -n Test -u https://www.google.com -d "my description" -t myOtherDirectory/main/default
// create a remote site setting in myOtherDirectory/main/default with a description
`
	];

	public static args = [{ name: 'file' }];

	protected static flagsConfig = {
		url: flags.string({ char: 'u', required: true, description: 'url that you want to allow callouts to' }),
		name: flags.string({ char: 'n', required: true, description: 'name it (Salesforce API compliant name)' }),
		description: flags.string({ char: 'd', default: 'added from sfdx plugin', description: 'optional description so you can remember why you added this and what it\'s for' }),
		target: flags.string({ char: 't', default: 'force-app/main/default', description: 'where to create the folder (if it doesn\'t exist already) and file...defaults to force-app/main/default' })
	};

	// Set this to true if your command requires a project workspace; 'requiresProject' is false by default
	protected static requiresProject = true;

	public async run(): Promise<any> { // tslint:disable-line:no-any

		if (this.flags.name.includes(' ')) {
			this.ux.error(chalk.red('spaces are not allowed in the name'));
		}

		// remove trailing slash if someone entered it
		if (this.flags.target.endsWith('/')){
			this.flags.target = this.flags.target.substring(0, this.flags.target.length -1);
		}

		if (!fs.existsSync(`${this.flags.target}/remoteSiteSettings`)) {
			fs.mkdirSync(`${this.flags.target}/remoteSiteSettings`);
		}

		const settingJSON = {
			'@' : {
				xmlns: 'http://soap.sforce.com/2006/04/metadata'
			},
			url : this.flags.url,
			disableProtocolSecurity : false,
			isActive : true,
			description: this.flags.description
		}

		const options = {
			declaration: {
				include: true,
				encoding: 'UTF-8',
				version: '1.0'
			},
			format: {
				doubleQuotes: true
			}
		}

		const xml = jsToXml.parse('RemoteSiteSetting', settingJSON, options);

		fs.writeFileSync(`${this.flags.target}/remoteSiteSettings/${this.flags.name}.remoteSite-meta.xml`, xml);

		this.ux.log(chalk.green('Remote site created locally'));
	}
}
