import { flags, SfdxCommand } from '@salesforce/command';
import {StreamingClient } from '@salesforce/core';
import { Duration } from '@salesforce/kit';

export default class CDCStream extends SfdxCommand {

  protected static flagsConfig = {
    object: flags.string({char: 'o', description: 'subscribe to change events for only a single object (api name, including __c)'})
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const streamProcessor = message => {
      this.ux.logJson(message);
      return { completed: false };
    };

    const endpoint = this.flags.object ? `/data/${this.flags.object.replace('__c', '__')}ChangeEvent` : '/data/ChangeEvents';
    // create a client
    const options = new StreamingClient.DefaultOptions(this.org, endpoint, streamProcessor);
    options.apiVersion = await this.org.retrieveMaxApiVersion();
    options.subscribeTimeout = new Duration(60 * 100);
    const client = await StreamingClient.create(options);

    await client.handshake();
    await client.subscribe(async () => {
      this.ux.log(`Listening on ${endpoint}... (ctrl-c to exit)`);
    });
  }

}
