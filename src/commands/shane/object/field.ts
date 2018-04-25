import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import cli from 'cli-ux'
import jsToXml = require('js2xmlparser');
import util = require('util');
import xml2js = require('xml2js');

const options = require('../../../shared/js2xmlStandardOptions');


const chalk = require('chalk');
const	SupportedTypes__b = ['Text', 'Number', 'DateTime', 'Lookup', 'LongTextArea'];

export default class FieldCreate extends SfdxCommand {

	public static description = 'create or add fields to an existing object';

	public static examples = [
`sfdx shane:object:field
// without any params, the cli is going to ask you questions to generate your field interactively
`,
`sfdx shane:object:field --api My_Field__c -l 255 -n "My Field" -t Text -o  BigTest__b --noIndex
// create new text field called My Field (My_Field__c) on BigObject BigTest__b
`,
`sfdx shane:object:field --api My_Index_Field__c -l 255 -n "My Index Field" -t Text -o  BigTest__b --indexDirection ASC --indexPosition 1
// create new text field called My Field (My_Field__c) on BigObject BigTest__b, add it to the existing index as the second field
`
	];


	protected static flagsConfig = {
		// name: flags.string({ char: 'n', required: true, description: 'path to existing permset.  If it exists, new perms will be added to it.  If not, then it\'ll be created for you' }),
		object: flags.string({ char: 'o', description: 'API name of an object to add a field to' }),
		name: flags.string({ char: 'n', description: 'Label for the field' }),
		api: flags.string({ char: 'a', description: 'API name for the field' }),
		type: flags.string({ char: 't', description: `field type.  Big Objects: ${SupportedTypes__b.join(',')}`}),
		length: flags.string({ char: 'l', description: 'length (for text fields)' }),
		scale: flags.string({ char: 's', description: 'places right of the decimal' }),
		precision: flags.string({description: 'maximum allowed digits of a number, including whole and decimal places' }),
		required: flags.boolean({ char: 'r', description: 'field is required' }),
		unique: flags.boolean({ char: 'u', description: 'field must be unique' }),
		lookupObject: flags.string({description: 'API name of the object the lookup goes to'}),
		relName: flags.string({ description: 'API name for the lookup relationship' }),
		externalId: flags.boolean({ description: 'use as an external id' }),

		indexPosition: flags.string({ description: 'put in a specific position in the big object index (0 is the first element).  You\'re responsible for dealing with producing a sane array'}),
		indexAppend: flags.boolean({ description: 'put next in the big object index' }),
		indexDirection: flags.string({ description: 'sort direction for the big object index (ASC, DESC)' }),
		noIndex: flags.boolean({description: 'do not add this field to the index'}),

		directory: flags.string({ char: 'd', default: 'force-app/main/default', description: 'Where is this object metadata? defaults to force-app/main/default' }),
	};

	// Set this to true if your command requires a project workspace; 'requiresProject' is false by default
	protected static requiresProject = true;

	public async run(): Promise<any> { // tslint:disable-line:no-any

		if (!this.flags.object) {
			this.flags.object = await cli.prompt('object API name?');
		}

		const objectMetaPath = `${this.flags.directory}/objects/${this.flags.object}/${this.flags.object}.object-meta.xml`
		// does it exist?
		if (!fs.existsSync(objectMetaPath)){
			this.ux.error(chalk.red(`object not found: ${objectMetaPath}`));
			return;
		}

		if (!this.flags.name) {
			this.flags.name = await cli.prompt('Label for your new field?');
		}

		if (!this.flags.api) {
			this.flags.api = await cli.prompt('API name for your new field?');
		}

		// be helpful
		if (!this.flags.api.endsWith('__c')){
			this.flags.api = this.flags.api + '__c';
		}

		const fieldsFolderPath = `${this.flags.directory}/objects/${this.flags.object}/fields`;
		const fieldMetaPath = `${this.flags.directory}/objects/${this.flags.object}/fields/${this.flags.api}.field-meta.xml`;

		if (!fs.existsSync(fieldsFolderPath)){
			fs.mkdirSync(fieldsFolderPath);
		}

		if (fs.existsSync(fieldMetaPath)) {
			this.ux.error(chalk.red(`field already exists ${fieldMetaPath}`));
			return;
		}

		interface fieldMeta {
			label: string;
			type: string;
			fullName: string;
			required?: boolean;
			unique?: boolean;
			externalId?: boolean;
			length?: number;
			scale?: number;
			precision?: number;
			relationshipLabel?: string;
			relationshipName?: string;
			referenceTo?: string;
		}

		while (!SupportedTypes__b.includes(this.flags.type)){
			this.flags.type = await cli.prompt(`Type (${SupportedTypes__b.join(',')})?`);
		}

		// we have at least these two fields now
		const outputJSON = <fieldMeta>{
			label : this.flags.name,
			type : this.flags.type,
			fullName: this.flags.api
		}

		// type specific values
		if (this.flags.type === 'Text'){
			outputJSON.length = this.flags.length || await cli.prompt('Length? (Max 255)');
		}

		if (this.flags.type === 'LongTextArea') {
			outputJSON.length = this.flags.length || await cli.prompt('Length? (Max 131072)');
		}

		if (this.flags.type === 'Lookup') {
			outputJSON.referenceTo = this.flags.lookupObject || await cli.prompt('What object for Lookup field? ex: Account, Something__c')
			outputJSON.relationshipName = this.flags.relName || await cli.prompt('relationship api name?');
			outputJSON.relationshipLabel = outputJSON.relationshipName;
		}

		if (this.flags.type === 'Number') {
			outputJSON.scale = this.flags.scale || await cli.prompt('how many decimal places (scale)?');
			outputJSON.precision = this.flags.precision || await cli.prompt(`how many total digits, including those ${outputJSON.scale} decimal places? (precision, MAX 18)?`);
		}

		// optional stuff
		if (this.flags.required){
			outputJSON.required = true;
		}

		if (this.flags.unique) {
			outputJSON.unique = true;
		}

		if (this.flags.externalId) {
			outputJSON.externalId = true;
		}

		const xml = jsToXml.parse('CustomField', outputJSON, options);

		fs.writeFileSync(fieldMetaPath, xml);

		this.ux.log(chalk.green(`Created ${fieldMetaPath}`));

		// dealing with big object indexes
		if (this.flags.object.includes('__b') && !this.flags.noIndex){
			const parser = new xml2js.Parser({ explicitArray: true });
			const parseString = util.promisify(parser.parseString);
			const filePath = `${this.flags.directory}/objects/${this.flags.object}/${this.flags.object}.object-meta.xml`
			const fileRead = await parseString(fs.readFileSync(filePath));


			const existing = fileRead.CustomObject;

			// this.ux.log(existing.indexes[0].fields);

			existing.indexes[0].fields = existing.indexes[0].fields || [];
			// this.ux.log(existing.indexes[0].fields);

			while (!this.flags.indexPosition && !this.flags.indexAppend && !this.flags.noIndex) {
				const response = await cli.prompt(`where in the big object index? Enter an array key (0 is first.  There are already ${existing.indexes[0].fields.length}) or the word LAST (add to the end) or NO (don't index this field)`);
				if (response === 'NONE') {
					this.flags.noIndex = true;
					// this.flags.indexAppend = true;
				} if (response === 'LAST') {
					this.flags.indexAppend = true;
				} else {
					if (this.flags.indexDirection >= 0) {
						this.flags.indexPosition = response;
					}
				}
			}

			if (this.flags.noIndex){
				return; // we're done.  Just quit!
			}

			// we were told what to do
			while (this.flags.indexDirection !== 'ASC' && this.flags.indexDirection !== 'DESC'){
				this.flags.indexDirection = await cli.prompt('which direction should this index be sorted? (ASC, DESC)');
			}

			// correct @ => $ issue
			if (existing['$']) {
				const temp = existing['$'];
				delete existing['$'];
				existing['@'] = temp;
			}

			const newIndex = {
				name: this.flags.api,
				sortDirection: this.flags.indexDirection
			};


			if (this.flags.indexAppend){
				existing.indexes[0].fields.push(newIndex);
			} else {
				existing.indexes[0].fields.splice(this.flags.indexPosition, 0, newIndex )
			}

			let position = this.flags.indexPosition || existing.indexes[0].fields.length - 1;

			// conver to xml and write out the file
			const xml = jsToXml.parse('CustomObject', existing, options);
			fs.writeFileSync(filePath, xml);

			this.ux.log(chalk.green(`Index for ${this.flags.api} added as [${position}] of ${existing.indexes[0].fields.length}`));

		}

	}

}

