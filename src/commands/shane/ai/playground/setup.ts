import { flags, SfdxCommand } from '@salesforce/command';
import { PlaygroundSetup } from '../../../../shared/aiPlaygroundSetup';

const envVarKey = 'AI_PLAYGROUND_SETUP_KEY';
const envVarEmail = 'EINSTEIN_EMAIL';

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
            description: `email address you used when you signed up for your einstein.ai account.  Defaults to ${envVarEmail} from the environment`,
            env: process.env[envVarEmail]
        }),
        key: flags.string({
            char: 'k',
            description: `encoding key used to encrypt/decrypt the file.  Defaults to ${envVarKey} from the environment`,
            env: process.env[envVarKey]
        })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        return PlaygroundSetup({
            conn: this.org.getConnection(),
            filepath: this.flags.file,
            email: this.flags.email,
            key: this.flags.key ?? process.env[envVarKey]
        });
    }
}
