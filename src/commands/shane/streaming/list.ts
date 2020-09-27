import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';

export default class ListStreams extends SfdxCommand {
    public static description = 'What kinds of things can I subscribe to?';

    public static examples = [
        `sfdx streaming:list // list everything`,
        `sfdx streaming:list -t cdc,topic // list CDC and PushTopic but not standard and custom PlatformEvents `
    ];

    protected static flagsConfig = {
        types: flags.array({
            char: 't',
            description: 'optional specify which types to query',
            options: ['cdc', 'event', 'topic'],
            default: ['cdc', 'event', 'topic']
        })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();

        const output = {
            topics: [],
            cdc: [],
            events: []
        };

        const describe = ((await conn.describeGlobal()) as any).sobjects.filter(obj => obj.urls.eventSchema);

        if (this.flags.types.includes('cdc')) {
            const channelChanges = (
                await conn.tooling.query('SELECT Id,DeveloperName,EventChannel,SelectedEntity FROM PlatformEventChannelMember')
            ).records.map(record => record['SelectedEntity']);
            output.cdc = describe
                .filter(obj => obj.name.endsWith('ChangeEvent')) // it is a cdc
                .filter(obj => channelChanges.includes(obj.name)); // it is also in some channel...that is, it's an active CDC object
        }
        if (this.flags.types.includes('event')) {
            const events = describe.filter(obj => !obj.name.endsWith('ChangeEvent'));
            // put the custom events AFTER the standard events
            output.events = [...events.filter(obj => !obj.name.includes('__e')), ...events.filter(obj => obj.name.includes('__e'))];
        }
        if (this.flags.types.includes('topic')) {
            output.topics = (await conn.query(`Select Name, Query, isActive from PushTopic where isActive=true`)).records;
        }

        if (output.events.length > 0) {
            this.ux.log(chalk.blue('PlatformEvents'));
            this.ux.table(output.events, ['name']);
        }
        if (output.topics.length > 0) {
            this.ux.log('');
            this.ux.log('');

            this.ux.log(chalk.blue('PushTopics'));
            this.ux.table(output.topics, ['Name', 'Query', 'IsActive']);
        }
        if (output.cdc.length > 0) {
            this.ux.log('');
            this.ux.log('');
            this.ux.log(chalk.blue('CDC Events'));
            this.ux.table(output.cdc, ['name']);
        }

        return {
            output
        };
    }
}
