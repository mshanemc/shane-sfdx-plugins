import { flags, SfdxCommand } from '@salesforce/command';
import { singleRecordQuery } from '../../../../shared/queries';
import { PushTopic } from '../../../../shared/typeDefs';

export default class PushTopicUpsert extends SfdxCommand {
    public static description = 'deactivate push topics';

    public static examples = [`sfdx streaming:pushtopic:deactivate -n myTopic`];

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
        const existing = ((await singleRecordQuery({
            conn,
            query: `Select Id from PushTopic where Name='${this.flags.name}'`
        })) as unknown) as PushTopic;

        existing.IsActive = false;
        const output = await conn.sobject('PushTopic').update(existing);

        this.ux.log(`Deactivated`);

        return {
            output
        };
    }
}
