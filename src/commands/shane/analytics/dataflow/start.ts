import { flags, SfdxCommand } from '@salesforce/command';

import { WaveDataFlowListResponse } from '../../../../shared/typeDefs';

export default class DataFlowStart extends SfdxCommand {
    public static description = 'start an analytics dataflow by name/label/id';

    public static examples = [
        `sfdx shane:analytics:dataflow:start -n MyDataFlowName
// enqueue a job for the the analytics dataflow with name/label MyDataFlowName (will not wait for completion of the dataflow)
`
    ];

    protected static flagsConfig = {
        name: flags.string({ char: 'n', description: 'name or label of the analytics app (will match either)' }),
        id: flags.id({ char: 'i', description: 'the id of the dataflow' })
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const conn = this.org.getConnection();

        const dataflowsListResult = <WaveDataFlowListResponse>(<unknown>await conn.request({
            url: `${conn.baseUrl()}/wave/dataflows`
        }));

        // match the dataflow from the list
        const foundDataflow = dataflowsListResult.dataflows.find(
            df => df.name === this.flags.name || df.label === this.flags.name || df.id === this.flags.id
        );

        if (!foundDataflow) {
            throw new Error(`no dataflow by that name/label/id exists.  dataflows: ${dataflowsListResult.dataflows.map(df => df.name).join(',')}`);
        }

        this.ux.log(`found dataflow with id ${foundDataflow.id} label ${foundDataflow.label} name ${foundDataflow.name}`);

        const startResult = await conn.request({
            method: 'POST',
            url: `${conn.baseUrl()}/wave/dataflowjobs`,
            body: JSON.stringify({
                dataflowId: foundDataflow.id,
                command: 'Start'
            })
        });

        if (!this.flags.json) {
            this.ux.logJson(startResult);
        }

        return startResult;
    }
}
