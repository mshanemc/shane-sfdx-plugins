import { flags } from '@salesforce/command';

const replay = flags.integer({ char: 'r', description: 'replay Id to begin from', default: -1 });
const dir = flags.directory({ char: 'd', description: 'stream the events to a folder instead of the console' });

export { replay, dir };
