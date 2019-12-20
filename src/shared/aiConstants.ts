import { ConfigFile } from '@salesforce/core/lib/config/configFile';
import { Crypto } from '@salesforce/core/lib/crypto';

const baseUrl = 'https://api.einstein.ai/v2';
const aiServiceName = 'shane-ai';

class ShaneAIConfig extends ConfigFile<ConfigFile.Options> {
    public async getToken() {
        const crypto = await Crypto.create();
        const tokenEncrypted = this.get('token') as string;
        return crypto.decrypt(tokenEncrypted);
    }

    public async setToken(token) {
        const crypto = await Crypto.create();
        const tokenEncrypted = crypto.encrypt(token);
        this.set('token', tokenEncrypted);
        await this.write();
    }
}

const convertEmailToFilename = (email: string, service?: string) => {
    const newEmail = email
        .replace('@', '_')
        .replace('.', '_')
        .replace('.', '_')
        .replace('.', '_')
        .replace('.', '_');

    return service ? `${service}-${newEmail}` : newEmail;
};

const AITokenRetrieve = async email => {
    const config = await ShaneAIConfig.create({ filename: convertEmailToFilename(email, aiServiceName), isGlobal: true });
    return config.getToken();
};

export { baseUrl, ShaneAIConfig, convertEmailToFilename, AITokenRetrieve, aiServiceName };
