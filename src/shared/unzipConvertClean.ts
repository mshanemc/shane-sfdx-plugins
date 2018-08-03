import { UX } from '@salesforce/command';
import child_process = require('child_process');
import util = require('util');

const exec = util.promisify(child_process.exec);

export async function retrieveUnzipConvertClean(tmpDir, retrieveCommand, target) {
  const ux = await UX.create();

  process.stdout.write('Starting retrieval...');

  const retrieveResult = await exec(retrieveCommand, { maxBuffer: 1000000 * 1024 });

  if (retrieveResult.stderr) {
    ux.error(retrieveResult.stderr);
    return;
  }

  process.stdout.write('done.  Unzipping...');

  const unzipResult = await exec(`unzip -qqo ./${tmpDir}/unpackaged.zip -d ./${tmpDir}`);
  process.stdout.write('done.  Converting...');

  try {
    const convertResult = await exec(`sfdx force:mdapi:convert -r ./${tmpDir} -d ${target} --json`);
    process.stdout.write(`done (converted ${JSON.parse(convertResult.stdout).result.length} items).  Cleaning up...`);
  } catch (err) {
    ux.errorJson(err);
    ux.error('Error from conversion--it may have been too much metadata');
  }

  await exec(`rm -rf ./${tmpDir}`);
  process.stdout.write('Done!\n');

}
