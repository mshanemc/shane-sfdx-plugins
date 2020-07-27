import { flags } from '@salesforce/command';

const replay = flags.integer({ char: 'r', description: 'replay Id to begin from', default: -1 });

export { replay, wait };
