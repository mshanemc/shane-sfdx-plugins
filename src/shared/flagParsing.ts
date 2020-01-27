// import { flags, SfdxCommand } from '@salesforce/command';

export const removeTrailingSlash = (input: string) => {
    return input.endsWith('/') ? (input = input.substring(0, input.length - 1)) : input;
};
