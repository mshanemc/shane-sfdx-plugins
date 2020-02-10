import { flags, SfdxCommand } from '@salesforce/command';
import { CreateResult, ContentVersion } from '../../../../shared/typeDefs';

import localFile2CV = require('../../../../shared/localFile2CV');

const envVarKey = 'AI_PLAYGROUND_SETUP_KEY';
const envVarEmail = 'EINSTEIN_EMAIL';
const FILENAME = 'einstein_platform';

export default class AIPlaygroundSetup extends SfdxCommand {
    public static description = 'upload .pem file from local encrypted copy, setup username and secret key in custom setting';

    public static examples = [
        `sfdx shane:data:file:upload -f ~/Downloads/King.png
    //uploads file from local filesystem as a file
    `,
        `sfdx shane:data:file:upload -f ~/Downloads/King.png -p 0011900000VkJgrAAF
    //uploads file from local filesystem as a file and attaches to a record
    `,
        `sfdx shane:data:file:upload -f ~/Downloads/King.png -p 0011900000VkJgrAAF -c
    //uploads and attaches it to the indicated record, but as a chatter file post
    `,
        `sfdx shane:data:file:upload -f ~/Downloads/King.png -p 0011900000VkJgrAAF -n CustomName -c
    //uploads and attaches it to the indicated record, but as a chatter file post with a name that's not the same name as the local filesystem used
    `
    ];

    protected static flagsConfig = {
        file: flags.filepath({ char: 'f', description: 'encrypted file from local filesystem', required: true }),
        email: flags.email({
            char: 'e',
            description: 'email address you used when you signed up for your einstein.ai account',
            default: process.env[envVarEmail]
        }),
        key: flags.string({ char: 'k', description: `encoding key used to encrypt/decrypt the file.  Defaults to ${envVarKey} from the environment` })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        this.ux.startSpinner('uploading the pem file');
        const CV = (await localFile2CV.file2CV(conn, this.flags.file, FILENAME)) as ContentVersion;
        this.ux.setSpinnerStatus('modifying your custom setting');

        const createResult = (await conn.sobject('einsteinplay__Einstein_Settings__c').create({
            einsteinplay__Einstein_EMail__c: this.flags.email,
            einsteinplay__CertName__c: CV.ContentDocumentId,
            einsteinplay__Secret_Key__c: this.flags.key ?? process.env[envVarKey]
        })) as CreateResult;

        this.ux.stopSpinner(`created custom setting with id ${createResult.id}`);
        return createResult.id;
    }
}
