import chalk from 'chalk';

export function setupArray(existing, arrayName: string) {
    if (!existing[arrayName]) {
        existing[arrayName] = []; // doesn't exist
    } else if (existing[arrayName] && !(existing[arrayName] instanceof Array)) {
        // it's an object and we need to make it an array
        const temp = existing[arrayName];
        existing[arrayName] = [];
        existing[arrayName].push(temp);
    }

    if (!(existing[arrayName] instanceof Array)) {
        this.ux.logJson(existing);
        this.ux.error(chalk.red(`${arrayName} is not an array even after I tried to correct it`));
    }

    return existing;
}
