import { IOptions } from 'js2xmlparser/lib/options';

export const js2xmlStandardOptions: IOptions = {
    declaration: {
        include: true,
        encoding: 'UTF-8',
        version: '1.0'
    },
    format: {
        doubleQuotes: true
    }
};
