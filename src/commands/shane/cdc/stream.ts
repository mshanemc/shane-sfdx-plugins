import { flags, SfdxCommand } from '@salesforce/command';
import { StreamingClient } from '@salesforce/core';
// import { Duration } from '@salesforce/kit';
import * as fs from 'fs-extra';
import { CDCEvent } from './../../../shared/typeDefs';

const writeJSONOptions = {
    spaces: 2
};

export default class CDCStream extends SfdxCommand {
    public static examples = [
        'sfdx shane:cdc:stream // get all the change events',
        'sfdx shane:cdc:stream -o Account // get all the change events on a single object',
        'sfdx shane:cdc:stream -d myDir // stream change events to myDir/cdc, organized into folders by object api type'
    ];

    protected static flagsConfig = {
        object: flags.string({ char: 'o', description: 'subscribe to change events for only a single object (api name, including __c)' }),
        dir: flags.directory({ char: 'd', description: 'stream the events to a folder instead of the console' })
    };

    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const streamProcessor = message => {
            this.ux.logJson(message);
            return { completed: false };
        };

        const streamProcessorToFile = (message: CDCEvent) => {
            const filename = `${this.flags.dir}/cdc/records/${message.payload.ChangeEventHeader.entityName}/${message.event.replayId}.json`;
            fs.outputJSON(filename, message, writeJSONOptions, () => {});
            return { completed: false };
        };

        const endpoint = this.flags.object ? `/data/${this.flags.object.replace('__c', '__')}ChangeEvent` : '/data/ChangeEvents';
        // create a client
        const options = new StreamingClient.DefaultOptions(this.org, endpoint, this.flags.dir ? streamProcessorToFile : streamProcessor);
        options.apiVersion = await this.org.retrieveMaxApiVersion();
        // options.subscribeTimeout = new Duration(60 * 100);
        const client = await StreamingClient.create(options);

        await client.handshake();
        await client.subscribe(async () => {
            this.ux.log(`Listening on ${endpoint}... (ctrl-c to exit)`);
        });
    }
}
