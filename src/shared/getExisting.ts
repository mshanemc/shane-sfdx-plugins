import { AnyJson } from '@salesforce/ts-types';
import fs = require('fs-extra');

import { getParsed } from './xml2jsAsync';

export async function getExisting(targetFilename: string, subType: string, defaults?: object) {
    // get or create permset
    if (fs.existsSync(targetFilename)) {
        const existing = await getParsed(await fs.readFile(targetFilename));
        return existing[subType];
    } else if (defaults) {
        return defaults;
    } else {
        throw new Error(`Not found: ${targetFilename}`);
    }
}

export function fixExistingDollarSign(existing: AnyJson) {
    if (existing['$']) {
        const temp = existing['$'];
        delete existing['$'];
        existing['@'] = temp;
    }
    return existing;
}
