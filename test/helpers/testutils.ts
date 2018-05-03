import fs = require('fs-extra');
import xml2js = require('xml2js');
import util = require('util');

import child_process = require('child_process');

const exec = util.promisify(child_process.exec);

// pass in a local path to mdapi xml, get back the json equivalent
export async function getParsedXML(url: string) {
  const xml = await fs.readFile(url);

  const parser = new xml2js.Parser({ explicitArray: false });
  const parseString = util.promisify(parser.parseString);
  const parsed = await parseString(xml);

  return parsed;
}

export async function itDeploys(testProjectName: string) {
  await exec('sfdx force:org:create -f config/project-scratch-def.json -s -a PluginMochaTesting', { cwd: testProjectName });

  // push source
  const pushResult = await exec('sfdx force:source:push --json', { cwd: testProjectName });

  const result = JSON.parse(pushResult.stdout);

  // destroy org
  await exec('sfdx shane:org:delete', { cwd: testProjectName });

  return result.status === 0;
}
