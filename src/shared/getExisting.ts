import fs = require('fs-extra');
import util = require('util');
import xml2js = require('xml2js');

// const options = require('../../../../shared/js2xmlStandardOptions');

export async function getExisting(targetFilename: string, subType: string, defaults?: object) {
  // get or create permset
  if (fs.existsSync(targetFilename)) {
    const parser = new xml2js.Parser({ explicitArray: false });
    const parseString = util.promisify(parser.parseString);
    const existing = await parseString(fs.readFileSync(targetFilename));
    return existing[subType];
  } else if (defaults) {
    return defaults;
  } else {
    throw new Error(`Not found: ${targetFilename}`);
  }
}

export async function fixExistingDollarSign(existing: object) {
  if (existing['$']) {
    const temp = existing['$'];
    delete existing['$'];
    existing['@'] = temp;
  }
  return existing;
}
