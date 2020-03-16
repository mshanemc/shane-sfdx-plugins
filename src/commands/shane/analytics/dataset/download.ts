import { flags, SfdxCommand } from '@salesforce/command';
import json2csv from 'json2csv';

// import { Transform } from 'Json2csv';
import { WaveDataSetListResponse, WaveDatasetVersion } from '../../../../shared/typeDefs';

import fs = require('fs-extra');
import stream = require('stream');
import util = require('util');

export default class DatasetDownload extends SfdxCommand {
    public static description = 'download a dataset as csv';

    public static examples = [
        'sfdx shane:analytics:dataset:download -n YourDataSetName -t myLocalFolder',
        'sfdx shane:analytics:dataset:download -i 0Fb6A000000gDFxSAM --versionid 0Fc6A000002d8GwSAI -t myLocalFolder -r 10000 -b 5000'
    ];

    protected static flagsConfig = {
        id: flags.id({ char: 'i', description: 'dataset id' }),
        name: flags.string({ char: 'n', description: 'dataset name' }),
        versionid: flags.string({ description: 'specify a version' }),
        target: flags.filepath({ char: 't', description: 'where you want to save the file', default: '.' }),
        rows: flags.number({ char: 'r', default: 1000000000, description: 'how many rows?' }),
        offset: flags.number({ char: 'o', default: 0, description: 'offset for rows' }),
        batchsize: flags.number({ char: 'b', default: 1000000000, description: 'maximum batchsize. Splits query in parts of this size.' })
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

        const baseQuery = `q = load "${this.flags.id}/${this.flags.versionid}"; q = foreach q generate ${fieldNames
            .map(name => `'${name}' as '${name}'`)
            .join(', ')};`;

        // pipe parts for streaming result to file
        const input = new stream.Readable({ objectMode: true, read() {} });
        const outStream = fs.createWriteStream(`${this.flags.target}/${this.flags.name}.csv`, { encoding: 'utf8' });
        const csvTransform = new json2csv.Transform({ fields: fieldNames }, { objectMode: true });
        input.pipe(csvTransform).pipe(outStream);

        let currentOffset = this.flags.offset;
        let moreRows = true;
        while (currentOffset < this.flags.rows && moreRows) {
            // for the last batch, we reduce the currentLimit to the global limit
            let currentLimit = Math.min(this.flags.batchsize, this.flags.rows - currentOffset, this.flags.rows);
            const query = baseQuery + ` q = offset q ${currentOffset}; q = limit q ${currentLimit}`;
            this.ux.log(`query with offset: ${currentOffset} and limit ${currentLimit}`);
            // console.log(query);
            // this.ux.log(query);
            const queryResponse = (await conn.request({
                method: 'POST',
                url: `${conn.baseUrl()}/wave/query`,
                body: JSON.stringify({ query })
            })) as any;

            this.ux.log(`writing ${queryResponse.results.records.length} rows to ${this.flags.target}/${this.flags.name}`);
            moreRows = queryResponse.results.records.length != 0;
            currentOffset += currentLimit;

            queryResponse.results.records.forEach(record => input.push(record));
        }
        input.push(null);
    }
}
