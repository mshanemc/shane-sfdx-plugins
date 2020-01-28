import chalk from 'chalk';

export function setupArray(existing, arrayName: string) {
    if (!existing[arrayName]) {
        existing[arrayName] = []; // doesn't exist
    } else if (existing[arrayName] && !Array.isArray(existing[arrayName])) {
        // it's an object and we need to make it an array
        const temp = existing[arrayName];
        existing[arrayName] = [];
        existing[arrayName].push(temp);
    }

    if (!Array.isArray(existing[arrayName])) {
        this.ux.logJson(existing);
        this.ux.error(chalk.red(`${arrayName} is not an array even after I tried to correct it`));
    }

    return existing;
}
