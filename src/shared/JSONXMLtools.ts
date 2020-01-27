import { AnyJson } from '@salesforce/ts-types';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');
import { IOptions } from 'js2xmlparser/lib/options';

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
    const xml = jsToXml.parse('ContentAsset', json, options);
    await fs.writeFile(path, xml);
};

interface WriteJSONasXMLInputs {
    path: string;
    json: AnyJson;
    type: string;
    options?: IOptions;
}
export { writeJSONasXML, standardOptions };
