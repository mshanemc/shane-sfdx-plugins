import { exec } from 'child_process';
import * as util from 'util';

const execProm = util.promisify(exec);

export { execProm };
export { execProm as exec };
