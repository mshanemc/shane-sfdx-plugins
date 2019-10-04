import { flags, SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');

import jsToXml = require('js2xmlparser');

import { exec } from '../../../shared/execProm';
import * as options from '../../../shared/js2xmlStandardOptions';

export default class CertUpload extends SfdxCommand {
    public static description = 'upload a cert to an org using local file or string';

    protected static flagsConfig = {
        file: flags.filepath({
            char: 'f',
            description: 'full path to the cert file'
        }),
        cert: flags.string({ char: 'c', description: 'string containing the full cert' }),
        exportable: flags.boolean({
            char: 'e',
            description: 'set the cert so that it can be exported.  Only use if you really know what you are doing'
        }),
        name: flags.string({ char: 'n', description: 'masterLabel of the cert', required: true }),
        verbose: flags.builtin()
    };

    protected static requiresProject = true;
    protected static requiresUsername = true;

    // tslint:disable-next-line: no-any
    public async run(): Promise<any> {
        // convert to json
        const path = 'certTemp/main/default/certificates/';
        await fs.ensureDir(path);
        if (this.flags.file) {
            this.flags.cert = await fs.readFile(this.flags.file);
        }
        if (!this.flags.cert) {
            throw new Error('you have to specify either the file or the cert');
        }
        await fs.writeFile(`${path}/${this.flags.name}.crt`, this.flags.cert);
        const certDate = await exec(`openssl x509 -enddate -noout -in ${this.flags.file}`);
        const properDate = new Date(Date.parse(certDate.stdout.trim().replace('notAfter=', '')));

        console.log(properDate.toISOString());

        const output = {
            caSigned: false,
            encryptedWithPlatformEncryption: false,
            keySize: 2048,
            expirationDate: properDate.toISOString(),
            masterLabel: this.flags.name,
            privateKeyExportable: !!this.flags.exportable
        };
        if (this.flags.verbose) {
            this.ux.logJson(output);
        }
        const newXML = jsToXml.parse('Certificate', output, options.js2xmlStandardOptions);
        if (this.flags.verbose) {
            this.ux.log(newXML);
        }
        await fs.writeFile(`${path}/${this.flags.name}.crt-meta.xml`, newXML);

        // await fs.remove('certTemp');
    }
}
