/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { flags, SfdxCommand } from '@salesforce/command';
import * as moment from 'moment';

import fs = require('fs-extra');
import parse = require('csv-parse');

export default class DateUpdate extends SfdxCommand {
    public static description = 'go through a folder of csv files and modify all the dates relative to a given date';

    public static examples = [
        `sfdx shane:data:dates:update -r 1-1-2020
// move all dates in .csv files in /data by the difference between now and 1-1-2020
`
    ];

    protected static flagsConfig = {
        datafolder: flags.directory({
            char: 'd',
            default: 'data',
            description: 'Where is all this data?'
        }),
        outputfolder: flags.directory({
            char: 'o',
            default: 'data-modified',
            description: 'where to output the modified CSV files'
        }),
        relative: flags.date({
            char: 'r',
            description:
                'the date to adjust all other dates relative to.  example: if "relative" is 8 days ago, then all dates are moved forward 8 days',
            required: true
        })
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        await fs.ensureDir(this.flags.outputfolder);
        for (const dataFileName of await fs.readdir(this.flags.datafolder)) {
            const parser = fs.createReadStream(`${this.flags.datafolder}/${dataFileName}`).pipe(parse());
            const output = fs.createWriteStream(`${this.flags.outputfolder}/${dataFileName}`, { encoding: 'utf-8' });
            for await (const record of parser) {
                this.ux.startSpinner(`starting ${this.flags.datafolder}/${dataFileName}`);
                output.write(
                    `${record
                        .map(field => {
                            if (field && typeof field === 'string') {
                                if (!field.includes('-')) {
                                    return field;
                                }
                                // if (parseInt(field))
                                const csvDate = moment.utc(field, moment.ISO_8601);
                                if (csvDate.isValid()) {
                                    return csvDate.add(moment.utc().diff(moment.utc(this.flags.relative))).format();
                                }
                            }
                            return field;
                        })
                        .join(',')}\n`
                );
            }
            output.end();
            this.ux.stopSpinner(`done: ${this.flags.outputfolder}/${dataFileName}`);
        }
    }
}
