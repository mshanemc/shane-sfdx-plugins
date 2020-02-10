import { UX } from '@salesforce/command';

import { exec } from './execProm';

import fs = require('fs-extra');
import unzipper = require('unzipper');

const retrieveUnzipConvertClean = async (tmpDir, retrieveCommand, target) => {
    const ux = await UX.create();

    ux.startSpinner('Starting retrieval');
    await fs.ensureDirSync(tmpDir);
    await exec(retrieveCommand, { maxBuffer: 1000000 * 1024 });

    ux.setSpinnerStatus('Unzipping');
    await extract(tmpDir, ux);

    await exec(`sfdx force:mdapi:convert -r ./${tmpDir} -d ${target} --json`);

    ux.setSpinnerStatus('Cleaning up');
    await fs.remove(tmpDir);
    ux.stopSpinner();
};

const extract = (location: string, ux: UX) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(`./${location}/unpackaged.zip`)
            .pipe(unzipper.Extract({ path: `${location}` }))
            .on('close', () => {
                ux.setSpinnerStatus('Converting');
                resolve();
            })
            .on('error', error => reject(error));
    });
};

export { retrieveUnzipConvertClean };
