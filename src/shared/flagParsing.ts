// import { flags, SfdxCommand } from '@salesforce/command';

const removeTrailingSlash = (input: string) => {
    return input.endsWith('/') ? input.substring(0, input.length - 1) : input;
};

const herokuAppNameValidator = (input: string) => {
    if (input.includes(' ')) {
        throw new Error('app name cannot contain spaces');
    }
    if (input.toLowerCase() !== input) {
        throw new Error('app name can only contain lowercase letters');
    }
    if (input.length > 30) {
        throw new Error('app name cannot be more than 30 characters');
    }
    return input;
};

export { removeTrailingSlash, herokuAppNameValidator };
