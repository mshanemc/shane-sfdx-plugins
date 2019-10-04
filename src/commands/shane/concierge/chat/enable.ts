import { flags, SfdxCommand } from '@salesforce/command';
import { QueryResult } from '../../../../shared/typeDefs';

export default class ConcerigeChatEnable extends SfdxCommand {
    public static description = 'Modify custom settings to enable live agent chat for Concierge';
    public static examples = [];
    protected static requiresUsername = true;
    protected static requiresProject = true;

    protected static flagsConfig = {
        verbose: flags.builtin()
    };

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        const version = await this.org.retrieveMaxApiVersion();

        const button: QueryResult = await conn.query('select id from liveChatButton');
        const deployment: QueryResult = await conn.query('select id from LiveChatDeployment');
        const embedded: QueryResult = await conn.tooling.query('select id, LiveAgentContentUrl, LiveAgentChatUrl from EmbeddedServiceLiveAgent');

        const settings = {
            cncrgdemo__Button_Id__c: button.records[0].Id.substr(0, 15),
            cncrgdemo__Chat__c: embedded.records[0].LiveAgentChatUrl,
            cncrgdemo__Deployment_Id__c: deployment.records[0].Id.substr(0, 15),
            cncrgdemo__Deployment_URL__c: `${embedded.records[0].LiveAgentContentUrl}/g/js/${version}/deployment.js`,
            cncrgdemo__Org_Id__c: this.org.getOrgId().substr(0, 15)
        };

        const createResult = await conn.sobject('cncrgdemo__Live_Agent__c').create(settings);
        if (this.flags.verbose && !this.flags.json) {
            this.ux.logJson(settings);
            this.ux.logJson(createResult);
        }
        return createResult;
    }
}
