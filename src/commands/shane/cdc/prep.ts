import { flags, SfdxCommand } from '@salesforce/command';
// import { ux } from 'cli-ux';
import * as fs from 'fs-extra';
import request = require('request-promise-native');
import { CDCEvent } from '../../../shared/typeDefs';

const describes = {};
let conn;
const writeJSONOptions = {
  spaces: 2
};

export default class CDCPrep extends SfdxCommand {
  public static examples = [
    // 'sfdx shane:cdc:stream // get all the change events',
    // 'sfdx shane:cdc:stream -o Account // get all the change events on a single object',
    // 'sfdx shane:cdc:stream -d myDir // stream change events to myDir/cdc, organized into folders by object api type'
  ];

  protected static flagsConfig = {
    dir: flags.directory({char: 'd', required: true, description: 'folder to upload, containing /cdc/records'})
  };

  protected static requiresProject = true;
  protected static requiresUsername = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    // get each object
    conn = await this.org.getConnection();

    const recordsFolder = `${this.flags.dir}/cdc/records`;
    const objectList = await fs.readdir(recordsFolder);

    for (const objectType of objectList) {
      this.ux.log(`prepping object ${objectType}`);
      // build an array from the objects
      let outputArray: SimpleRecord[] = [];

      let cdcItemList = await fs.readdir(`${recordsFolder}/${objectType}`);
      // sort by replayId
      cdcItemList = cdcItemList.sort( (a, b) => parseInt(a, 10) - parseInt(b, 10) );
      for (const cdcItem of cdcItemList) {
        const cdc = await fs.readJSON(`${recordsFolder}/${objectType}/${cdcItem}`);
        outputArray = await cdcToArray(outputArray, cdc);
      }
      await fs.outputJSON(`${this.flags.dir}/cdc/originalIds/${objectType}.json`, outputArray, writeJSONOptions);
    }

  }

}

// converts a cdc item to a insertable record
const cdcToArray = async (outputArray: SimpleRecord[], cdc: CDCEvent) => {
  let modifiedArray: SimpleRecord[] = Array.from(outputArray);
  const cdcRecordIds = cdc.payload.ChangeEventHeader.recordIds;
  // const entityType = cdc.payload.ChangeEventHeader.entityType;
  const changeType = cdc.payload.ChangeEventHeader.changeType;

  if (changeType === 'CREATE') {
    const newRecord = await cdcToRecord(cdc);
    modifiedArray.push(newRecord);
  } else  if (changeType === 'DELETE') {
    modifiedArray = modifiedArray.filter( record => !cdcRecordIds.includes(record.Id));
  } else  if (changeType === 'UPDATE') {
    for (const recordId of cdcRecordIds) {
      const recordKey = modifiedArray.findIndex( record => record.Id === recordId);
      const oldRecord = modifiedArray[recordKey];
      const newRecord = await cdcToRecord(cdc);
      modifiedArray[recordKey] = { ...oldRecord, ...newRecord };
    }
  } else  if (changeType === 'UNDELETE') {
    // NOT HANDLED

  }

  return modifiedArray;
};

const cdcToRecord = async (cdc: CDCEvent) => {
  const recordOutput: SimpleRecord = {
    Id: cdc.payload.ChangeEventHeader.recordIds[0]
  };

  const entityType = cdc.payload.ChangeEventHeader.entityName;
  const describe = await getDescribe(entityType);

  const createableFieldsApiNames = Object.keys(describe.fields)
    .map( key => describe.fields[key])
    .filter( field => field.createable)
    .map( field => field.apiName);

  Object.keys(cdc.payload).forEach( key => {
    if (createableFieldsApiNames.includes(key)) {
      recordOutput[key] = cdc.payload[key];
    }
  });

  return recordOutput;
};

const getDescribe = async (entityType: string) => {
  // get and save for future use
  if (! describes[entityType]) {
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

interface SimpleRecord {
  Id: string;
  OwnerId?: string;
}
