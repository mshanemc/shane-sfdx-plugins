import { exec } from 'child_process';
import * as stripcolor from 'strip-color';
import * as util from 'util';

const execProm = util.promisify(exec);

// tslint:disable-next-line: no-any
const exec2JSON = async (cmd: string, options = {}): Promise<any> => {
    try {
        const results = await execProm(cmd, options);
        return JSON.parse(stripcolor(results.stdout));
    } catch (err) {
        // console.log(err);
        return JSON.parse(stripcolor(err.stdout));
    }
};

// tslint:disable-next-line: no-any
const exec2String = async (cmd: string, options = {}): Promise<any> => {
    try {
        const results = await execProm(cmd, options);
        return results.stdout.trim();
    } catch (err) {
        // console.log(err);
        return err.stdout;
    }
};

export { execProm, exec2JSON, exec2String };
export { execProm as exec };
