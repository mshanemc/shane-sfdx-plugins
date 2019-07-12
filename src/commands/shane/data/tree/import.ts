import { flags, SfdxCommand } from '@salesforce/command';
import * as fs from 'fs-extra';

const rowLimit = 200;

export default class DataTreeImport extends SfdxCommand {
    public static description =
        'similr to the original tree:import, but handles more than 200 records at a go, while still preserving relationships.  Takes longer.';
    public static examples = [
        'sfdx shane:data:tree:import -p data/myPlan.json -d data/  // run all the data in the plan, and files mentioned are relative to ./data'
    ];

    protected static flagsConfig = {
        plan: flags.filepath({ char: 'p', required: true, description: 'location of plan file' }),
        filesfolder: flags.directory({ char: 'd', required: true, description: 'folder that the plan lives in' })
    };

    protected static requiresProject = true;
    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        // get each object
        const conn = await this.org.getConnection();
        const plan = await fs.readJSON(this.flags.plan);
        const idLookup = [];
        const output = {};

        for (const planItem of plan) {
            output[planItem.sobject] = { success: 0, failures: [] };
            const currentObjectIdLookupStartingLength = idLookup.length;
            let recordsToAdd = []; // create empty array to hold the records as we accumulate them

            for (const file of planItem.files) {
                const fileContents = await fs.readJSON(`${this.flags.filesfolder}/${file}`);
                recordsToAdd = [
                    ...recordsToAdd,
                    ...fileContents.records.map(record => {
                        if (planItem.saveRefs) {
                            idLookup.push({ ref: record.attributes.referenceId });
                        }
                        delete record.attributes.referenceId;

                        // resolve references?
                        if (planItem.resolveRefs) {
                            for (const key of Object.keys(record)) {
                                if (typeof record[key] === 'string' && record[key].startsWith('@')) {
                                    record[key] = idLookup.find(item => item.ref === record[key].replace('@', '')).id;
                                }
                            }
                        }
                        return record;
                    })
                ];
            }

            this.ux.log(`creating ${recordsToAdd.length} ${planItem.sobject}`);

            let recordCounter = 0;
            while (recordCounter < recordsToAdd.length) {
                const saveResults = await (<SaveResult[]>(<unknown>conn.request({
                    method: 'POST',
                    url: `${conn.baseUrl()}/composite/sobjects`,
                    body: JSON.stringify({ records: recordsToAdd.slice(recordCounter, recordCounter + rowLimit) })
                })));

                saveResults.forEach((saveResult, index: number) => {
                    if (!saveResult.success && !this.flags.json) {
                        this.ux.logJson(saveResult.errors);
                    }

                    if (planItem.saveRefs) {
                        idLookup[index + recordCounter + currentObjectIdLookupStartingLength].id = saveResult.id;
                    }
                });

                output[planItem.sobject].success = output[planItem.sobject].success + saveResults.filter(item => item.success).length;
                output[planItem.sobject].failures = [...output[planItem.sobject].failures, ...saveResults.filter(item => !item.success)];
                recordCounter = recordCounter + rowLimit;
            }
        }
        return output;
    }
}

interface SaveResult {
    id: string;
    success: boolean;
    errors?: [];
}
