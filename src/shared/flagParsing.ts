// import { flags, SfdxCommand } from '@salesforce/command';

const removeTrailingSlash = (input: string) => {
    return input.endsWith('/') ? input.substring(0, input.length - 1) : input;
};

export { removeTrailingSlash };
