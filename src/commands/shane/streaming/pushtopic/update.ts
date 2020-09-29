import { flags, SfdxCommand } from '@salesforce/command';
import { singleRecordQuery } from '../../../../shared/queries';
import { PushTopic } from '../../../../shared/typeDefs';

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
            options: ['All', 'Referenced', 'Select', 'Where']
        }),
        operations: flags.array({
            char: 'o',
            description: 'which operations should produce a notification',
            options: ['create', 'update', 'delete', 'undelete']
        }),
        query: flags.string({
            char: 'q',
            description: 'The SOQL query statement that determines which record changes trigger events to be sent to the channel.'
        })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        const existing = ((await singleRecordQuery({
            conn,
            query: `Select Id, Query, Description, NotifyForOperationUpdate,NotifyForOperationUndelete,NotifyForOperationDelete, NotifyForOperationCreate, NotifyForFields, IsActive, ApiVersion from PushTopic where Name='${this.flags.name}'`
        })) as unknown) as PushTopic;

        existing.Description = this.flags.description || existing.Description;
        existing.Query = this.flags.query || existing.Query;
        existing.ApiVersion = this.flags.apiversion || existing.ApiVersion;
        existing.NotifyForFields = this.flags.notifyforfields || existing.NotifyForFields;
        existing.NotifyForOperationCreate = this.flags.operations ? this.flags.operations.includes('create') : existing.NotifyForOperationCreate;
        existing.NotifyForOperationUpdate = this.flags.operations ? this.flags.operations.includes('update') : existing.NotifyForOperationUpdate;
        existing.NotifyForOperationDelete = this.flags.operations ? this.flags.operations.includes('delete') : existing.NotifyForOperationDelete;
        existing.NotifyForOperationUndelete = this.flags.operations
            ? this.flags.operations.includes('undelete')
            : existing.NotifyForOperationUndelete;
        await conn.sobject('PushTopic').update(existing);

        // tell the user how to subscribe to it
        const subscribeCommand = `sfdx streaming:subscribe -t topic -n ${this.flags.name}`;
        this.ux.log(`Subscribe to your topic via ${subscribeCommand}`);

        return {
            object: existing,
            subscribeCommand
        };
    }
}
