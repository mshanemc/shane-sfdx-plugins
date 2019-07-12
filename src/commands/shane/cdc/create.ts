import { flags, SfdxCommand } from '@salesforce/command';
import { ux } from 'cli-ux';
import * as fs from 'fs-extra';
import request = require('request-promise-native');

let conn;
// const writeJSONOptions = {
//   spaces: 2
// };
const describes = [];

export default class CDCCreate extends SfdxCommand {
    public static examples = [
        // 'sfdx shane:cdc:stream // get all the change events',
        // 'sfdx shane:cdc:stream -o Account // get all the change events on a single object',
        // 'sfdx shane:cdc:stream -d myDir // stream change events to myDir/cdc, organized into folders by object api type'
    ];

    protected static flagsConfig = {
        // TODO: provide an insertion order
        // TODO: batch size
        batchsize: flags.integer({ default: 200, description: 'how many records to insert in a batch', max: 200, min: 1 }),
        dir: flags.directory({ char: 'd', required: true, description: 'folder to upload, containing /cdc/records' })
    };

    protected static requiresProject = true;
    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        // get each object
        conn = await this.org.getConnection();

        const originalsFolder = `${this.flags.dir}/cdc/originalIds`;
        const objectList = await fs.readdir(originalsFolder);
        const idMap = {};

        for (const objectType of objectList) {
            this.ux.log(`doing object ${objectType}`);

            // read the JSON into memory
            const originals = await fs.readJSON(`${originalsFolder}/${objectType}`);

            let batchesCompleted = 0;

            // break into batchs
            while (batchesCompleted * this.flags.batchsize < originals.length) {
                const start = batchesCompleted * this.flags.batchsize;
                const end = start + this.flags.batchsize - 1;
                this.ux.log(`starting batch rows ${start} to ${end}`);
                const currentBatch = await idCorrection(originals.slice(start, end), objectType.replace('.json', ''), idMap);

                // create via jsforce
                const createResults = await conn.sobject(objectType).create(currentBatch);

                // create the idmap for this object
                for (const [index, result] of createResults.entries()) {
                    if (result.success) {
                        idMap[originals[start + index].Id] = result.id;
                    }
                }
                batchesCompleted++;
            }
        }
    }
}

const idCorrection = async (currentBatch, entityType, idMap) => {
    const describe = await getDescribe(entityType);

    for (const record of currentBatch) {
        for (const fieldKey of Object.keys(record)) {
            if (describe.fields[fieldKey].reference) {
                if (idMap[record.fieldKey]) {
                    record[fieldKey] = idMap[record[fieldKey]];
                } else {
                    ux.warn(` omitting field ${fieldKey} because no id in idmap found for ${[record.fieldKey]}`);
                    delete record.fieldKey;
                }
            }
        }
    }

    return currentBatch;
};

const getDescribe = async (entityType: string) => {
    // get and save for future use
    if (!describes[entityType]) {
        const apiVersion = await conn.retrieveMaxApiVersion();
        const uri = `${conn.instanceUrl}/services/data/v${apiVersion}/ui-api/object-info/${entityType}`;

        const result = await request({
            method: 'get',
            uri,
            headers: {
                Authorization: `Bearer ${conn.accessToken}`
            },
            json: true
        });
        // save for future use
        describes[entityType] = result;
    }

    return describes[entityType];
};
