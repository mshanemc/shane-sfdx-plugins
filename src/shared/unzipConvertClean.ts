import { UX } from '@salesforce/command';

import { exec } from './execProm';

import fs = require('fs-extra');
import unzipper = require('unzipper');

const retrieveUnzipConvertClean = async (tmpDir, retrieveCommand, target) => {
    const ux = await UX.create();

    process.stdout.write('Starting retrieval...');
    await fs.ensureDirSync(tmpDir);

    await exec(retrieveCommand, { maxBuffer: 1000000 * 1024 });

    process.stdout.write('done.  Unzipping...');

    await extract(tmpDir);

    try {
        // const convertResult = await exec(`sfdx force:mdapi:convert -r ./${tmpDir} -d ${target} --json`);
        await exec(`sfdx force:mdapi:convert -r ./${tmpDir} -d ${target} --json`);
        // process.stdout.write(`done (converted ${JSON.parse(convertResult.stdout).result.length} items).  Cleaning up...`);
        await fs.remove(tmpDir);
    } catch (error) {
        ux.errorJson(error);
        // ux.error('Error from conversion--it may have been too much metadata');
    }

    await fs.remove(tmpDir);
    process.stdout.write('Done!\n');
};

const extract = (location: string) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(`./${location}/unpackaged.zip`)
            .pipe(unzipper.Extract({ path: `${location}` }))
            .on('close', () => {
                process.stdout.write('done.  Converting...');
                resolve();
            })
            .on('error', error => reject(error));
    });
};

export { retrieveUnzipConvertClean };
