import { flags, SfdxCommand } from '@salesforce/command';
import { singleRecordQuery } from '../../../../shared/queries';

export default class PushTopicUpsert extends SfdxCommand {
    public static description = 'Upsert push topics';

    public static examples = [
        `sfdx streaming:pushtopic:upsert -n myTopic -q "select Id,Name from account"
    // creates or modifies the push topic
    `,
        `sfdx streaming:pushtopic:upsert -n myTopic -q "select Id from account" -f All -o create,update
    // creates or modifies the push topic and sets operations and watches all fields
    `,
        `sfdx streaming:pushtopic:upsert -n myTopic --deactivate -q "select Id from account"
    // deactivate an existing push topic
    `
    ];

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            description: 'name for the push topic',
            required: true
        }),
        description: flags.integer({
            char: 'd',
            description: 'add a description to the push topic'
        }),
        notifyforfields: flags.string({
            char: 'f',
            description: 'Specifies which fields are evaluated to generate a notification',
            options: ['All', 'Referenced', 'Select', 'Where'],
            default: 'Referenced'
        }),
        operations: flags.array({
            char: 'o',
            description: 'which operations should produce a notification',
            options: ['create', 'update', 'delete', 'undelete'],
            default: ['create', 'update', 'delete', 'undelete']
        }),
        query: flags.string({
            char: 'q',
            required: true,
            description: 'The SOQL query statement that determines which record changes trigger events to be sent to the channel.'
        }),
        deactivate: flags.boolean({
            description: 'deactivate the existing topic'
        })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        const builtObject = {
            Query: this.flags.query,
            Name: this.flags.name,
            Description: this.flags.description,
            NotifyForOperationUpdate: this.flags.operations.includes('update'),
            NotifyForOperationUndelete: this.flags.operations.includes('undelete'),
            NotifyForOperationDelete: this.flags.operations.includes('delete'),
            NotifyForOperationCreate: this.flags.operations.includes('create'),
            NotifyForFields: this.flags.notifyforfields,
            IsActive: !this.flags.deactivate,
            ApiVersion: await this.org.retrieveMaxApiVersion()
        };

        let output;

        // verify that the topic doesn't already exist
        try {
            const existing = await singleRecordQuery({ conn, query: `Select Id from PushTopic where Name='${this.flags.name}'` });
            output = await conn.sobject('PushTopic').update({ Id: existing.Id, ...builtObject });
        } catch {
            // there is no existing record, so create
            output = await conn.sobject('PushTopic').create(builtObject);
        }

        // tell the user how to subscribe to it
        const subscribeCommand = `sfdx streaming:subscribe -t topic -n ${this.flags.name}`;
        this.ux.log(`Subscribe to your topic via ${subscribeCommand}`);

        return {
            object: { Id: output.id, ...builtObject },
            subscribeCommand
        };
    }
}
