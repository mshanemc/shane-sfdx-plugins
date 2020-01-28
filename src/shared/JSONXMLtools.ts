// eslint-disable-next-line unicorn/filename-case
import { JsonMap } from '@salesforce/ts-types';
import { IOptions } from 'js2xmlparser/lib/options';
import { ObjectConfig, FieldMeta } from './typeDefs';

import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');

const standardOptions: IOptions = {
    declaration: {
        include: true,
        encoding: 'UTF-8',
        version: '1.0'
    },
    format: {
        doubleQuotes: true
    }
};

const writeJSONasXML = async ({ path, json, type, options = standardOptions }: WriteJSONasXMLInputs) => {
    const xml = jsToXml.parse(type, fixExistingDollarSign(json), options);
    await fs.writeFile(path, xml);
};

interface WriteJSONasXMLInputs {
    path: string;
    json: JsonMap | ObjectConfig | FieldMeta;
    type: string;
    options?: IOptions;
}

const fixExistingDollarSign = (existing: WriteJSONasXMLInputs['json']) => {
    const existingCopy = { ...existing } as any;
    if (existingCopy.$) {
        const temp = existingCopy.$;
        delete existingCopy.$;
        existingCopy['@'] = temp;
    }
    return existingCopy;
};

export { writeJSONasXML, standardOptions, fixExistingDollarSign };
