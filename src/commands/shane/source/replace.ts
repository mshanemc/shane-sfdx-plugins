import { flags, SfdxCommand } from '@salesforce/command';
import { replaceInFile } from 'replace-in-file';

import fs = require('fs-extra');

export default class SourceReplace extends SfdxCommand {
    public static description = 'replace a string in a file with another';

    protected static flagsConfig = {
        file: flags.filepath({
            char: 'f',
            description: 'file to modify',
            required: true
        }),
        old: flags.string({
            char: 'o',
            description: 'the text you want to change',
            required: true
        }),
        new: flags.string({
            char: 'n',
            description: 'the text you want it changed to',
            required: true
        })
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        if (!fs.existsSync(this.flags.file)) {
            throw new Error(`file doesn't exist ${this.flags.file}`);
        }
        const results = await replaceInFile({
            files: this.flags.file,
            from: this.flags.old,
            to: this.flags.new
        });
        return results;
    }
}
