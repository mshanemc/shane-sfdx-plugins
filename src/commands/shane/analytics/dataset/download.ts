import { flags, SfdxCommand } from '@salesforce/command';
import json2csv from 'json2csv';

// import { Transform } from 'Json2csv';
import { WaveDataSetListResponse, WaveDatasetVersion } from '../../../../shared/typeDefs';

import fs = require('fs-extra');
import stream = require('stream');
import util = require('util');

const pipeline = util.promisify(stream.pipeline);

export default class DatasetDownload extends SfdxCommand {
    public static description = 'download a dataset as csv';

    public static examples = [
        'sfdx shane:analytics:dataset:download -n YourDataSetName -t myLocalFolder',
        'sfdx shane:analytics:dataset:download -i 0Fb6A000000gDFxSAM --versionid 0Fc6A000002d8GwSAI -t myLocalFolder -r 100'
    ];

    protected static flagsConfig = {
        id: flags.id({ char: 'i', description: 'dataset id' }),
        name: flags.string({ char: 'n', description: 'dataset name' }),
        versionid: flags.string({ description: 'specify a version' }),
        target: flags.filepath({ char: 't', description: 'where you want to save the file', default: '.' }),
        rows: flags.number({ char: 'r', default: 1000000000, description: 'how many rows?' })
    };

    protected static requiresUsername = true;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();

        if ((!this.flags.id && !this.flags.name) || (this.flags.id && this.flags.name)) {
            throw new Error('you must specify either ID or name (not both).  Use shane:analytics:dataset:list for options');
        }

        const results = ((await conn.request({
            method: 'GET',
            url: `${conn.baseUrl()}/wave/datasets/`
        })) as unknown) as WaveDataSetListResponse;
        const matched = results.datasets.find(item => item.name === this.flags.name || item.id === this.flags.id);
        if (matched) {
            this.flags.id = matched.id;
            this.flags.name = matched.name;
            if (!this.flags.versionid) {
                this.flags.versionid = matched.currentVersionId;
            }
        } else {
            throw new Error(`Did not find that dataset ${this.flags.name || this.flags.id}. Use shane:analytics:dataset:list for options`);
        }

        // get the requested datasetVersion
        const datasetVersion = ((await conn.request({
            method: 'GET',
            url: `${conn.baseUrl()}/wave/datasets/${this.flags.id}/versions/${this.flags.versionid}`
        })) as unknown) as WaveDatasetVersion;

        const fieldsFromDates = datasetVersion.xmdMain.dates.map(d => d.fields);

        const fieldNames = [
            ...datasetVersion.xmdMain.dimensions.map(dim => dim.field),
            ...datasetVersion.xmdMain.measures.map(measure => measure.field)
        ].filter(fieldname => {
            if (!fieldname) return false; // fieldname has to be present
            if (fieldsFromDates.map(d => d.fullField).includes(fieldname)) {
                this.ux.log(`found matching fieldname: ${fieldname}`);
                return true; // it's the original field
            }
            let returnValue = true;
            fieldsFromDates.forEach(d => {
                if (Object.values(d).includes(fieldname)) {
                    returnValue = false; // it's one of the derived fields
                }
            });
            returnValue
                ? this.ux.log(`not part of fieldsFromDates: ${fieldname}`)
                : this.ux.log(`rejecting fieldname: ${fieldname} because contained in fieldsFromDates`);
            return returnValue;
        });
        // this.ux.logJson(fieldNames);

        const query = `q = load "${this.flags.id}/${this.flags.versionid}"; q = foreach q generate ${fieldNames
            .map(name => `'${name}' as '${name}'`)
            .join(', ')}; q = limit q ${this.flags.rows}`;
        // console.log(query);
        // this.ux.log(query);

        const queryResponse = (await conn.request({
            method: 'POST',
            url: `${conn.baseUrl()}/wave/query`,
            body: JSON.stringify({ query })
        })) as any;

        this.ux.log(`writing ${queryResponse.results.records.length} rows to ${this.flags.target}/${this.flags.name}`);

        const input = new stream.Readable({ objectMode: true, read() {} });

        queryResponse.results.records.forEach(record => input.push(record));
        input.push(null);

        await pipeline(
            input,
            new json2csv.Transform({ fields: fieldNames }, { objectMode: true }),
            fs.createWriteStream(`${this.flags.target}/${this.flags.name}.csv`, { encoding: 'utf8' })
        );
    }
}
