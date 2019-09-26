import { flags, SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');

import jsToXml = require('js2xmlparser');
import { fixExistingDollarSign, getExisting } from '../../../shared/getExisting';

import * as options from '../../../shared/js2xmlStandardOptions';

export default class XMLModify extends SfdxCommand {
    public static description = 'modify local xml files with data from org to work around hardcoded metadata issues';

    protected static flagsConfig = {
        samlfile: flags.filepath({
            char: 'f',
            description: 'full path to the samlssoconfig file.  Will be modified by this process',
            required: true
        }),
        label: flags.string({ char: 'l', description: 'masterLabel of the cert whose Id you need', required: true }),
        verbose: flags.builtin()
    };

    protected static requiresProject = true;
    protected static requiresUsername = true;

    // tslint:disable-next-line: no-any
    public async run(): Promise<any> {
        // convert to json
        let parsed = await getExisting(this.flags.samlfile, 'SamlSsoConfig');

        if (this.flags.verbose && !this.flags.json) {
            this.ux.logJson(parsed);
        }
        const conn = this.org.getConnection();

        const queryResult = await conn.tooling.query(`select id from Certificate where MasterLabel='${this.flags.label}'`);
        if (this.flags.verbose && !this.flags.json) {
            this.ux.logJson(queryResult);
        }

        // query org using tooling api
        parsed.requestSigningCertId = queryResult.records[0]['Id'].substr(0, 15);
        parsed = await fixExistingDollarSign(parsed);

        const newXML = jsToXml.parse('SamlSsoConfig', parsed, options.js2xmlStandardOptions);
        if (this.flags.verbose) {
            this.ux.log(newXML);
        }
        await fs.writeFile(this.flags.samlfile, newXML);
        this.ux.log(`changed requestSigningCertId in ${this.flags.samlfile} to ${queryResult.records[0]['Id']}`);
    }
}
