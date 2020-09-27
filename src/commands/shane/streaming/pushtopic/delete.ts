import { flags, SfdxCommand } from '@salesforce/command';
import { singleRecordQuery } from '../../../../shared/queries';

export default class PushTopicDelete extends SfdxCommand {
    public static description = 'Delete a push topic';

    public static examples = [`sfdx streaming:pushtopic:delete -n myTopic`];

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            description: 'name for the push topic',
            required: true
        })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        // verify that the topic doesn't already exist
        const existing = await singleRecordQuery({ conn, query: `Select id from PushTopic where Name='${this.flags.name}'` });
        const output = await conn.sobject('PushTopic').destroy(existing.Id);
        this.ux.log(`Deleted`);
        return output;
    }
}
