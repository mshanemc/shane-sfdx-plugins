import { flags, SfdxCommand } from '@salesforce/command';
import { StreamingClient } from '@salesforce/core';

export default class Org extends SfdxCommand {
    public static examples = [];

    protected static flagsConfig = {
        type: flags.string({
            char: 't',
            description: 'the type of thing you want to subscribe to',
            options: ['event', 'topic', 'cdc'],
            default: 'event'
        }),
        name: flags.string({
            char: 'n',
            description: 'name of the topic/event/dataEvent'
        }),
        replay: flags.integer({
            char: 'r',
            description: 'replay Id to begin from',
            default: -1
        })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const streamProcessor = message => {
            this.ux.logJson(message);
            return { completed: false };
        };

        const endpoint = `/${this.flags.type === 'cdc' ? 'data' : this.flags.type}/${this.flags.name}`;

        const options = new StreamingClient.DefaultOptions(this.org, endpoint, streamProcessor);
        options.apiVersion = await this.org.retrieveMaxApiVersion();
        const client = await StreamingClient.create(options);
        client.replay(this.flags.replay);

        await client.handshake();
        await client.subscribe(async () => {
            this.ux.log(`Listening on ${endpoint}... (ctrl-c to exit)`);
        });
    }
}
