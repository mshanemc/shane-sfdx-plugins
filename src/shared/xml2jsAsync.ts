import xml2js = require('xml2js');

// tslint:disable-next-line: no-any
const getParsed = async (xmlToParse, explicitArray = false): Promise<any> => {
    const parser = new xml2js.Parser({ explicitArray });

    return new Promise((resolve, reject) => {
        // tslint:disable-next-line: no-any
        parser.parseString(xmlToParse, (err, json: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(json);
            }
        });
    });
};

export { getParsed };
