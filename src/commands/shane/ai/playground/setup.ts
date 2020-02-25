import { flags, SfdxCommand } from '@salesforce/command';
import { PlaygroundSetup } from '../../../../shared/ai/aiPlaygroundSetup';

const envVarKey = 'AI_PLAYGROUND_SETUP_KEY';
const envVarEmail = 'EINSTEIN_EMAIL';

export default class AIPlaygroundSetup extends SfdxCommand {
    public static description = 'upload .pem file from local encrypted copy, setup username and secret key in custom setting';

    public static examples = [`sfdx shane:ai:playground:setup -f my.pem -e shane.mclaughlin@salesforce.com -k yay9HVn68GzXrqhT0HWkoQ==`];

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
