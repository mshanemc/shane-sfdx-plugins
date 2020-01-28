import { flags, SfdxCommand } from '@salesforce/command';
import * as purify from 'purify-css';
import * as stripCssComments from 'strip-css-comments';

import { removeTrailingSlash } from '../../../../shared/flagParsing';

import fs = require('fs-extra');

export default class LWCCreate extends SfdxCommand {
    public static description = "take css from existing file(s), extract component-level relevant selectors and save to a LWC's css file";

    public static examples = [
        `sfdx shane:lwc:css:merge -c modules/namespace/myComp -f some/big_file.css
// overwrites modules/namespace/myComp/myComp.css with relevant css selectors from big_file.css
`,

        `sfdx shane:lwc:css:merge -c modules/namespace/myComp -f some/big_file.css -l modules/namespace/myComp/local.css
// overwrites modules/namespace/myComp/myComp.css with relevant css selectors from big_file.css PLUS any relevant selectors from modules/namespace/myComp/local.css
`
    ];

    protected static flagsConfig = {
        file: flags.filepath({ char: 'f', required: true, description: 'file containing all css selectors to select from' }),
        component: flags.directory({
            char: 'c',
            required: true,
            description: 'component directory where template and js live',
            parse: input => removeTrailingSlash(input)
        }),
        localcss: flags.filepath({ char: 'l', description: 'local css file to merge with contents of --file' })
    };

    public async run(): Promise<any> {
        const output = `${this.flags.component}/${this.getComponentName(this.flags.component)}.css`;
        this.ux.log(`will write file to ${output}`);

        const filesGlob = [`${this.flags.component}/*.html`, `${this.flags.component}/*.js`];
        this.ux.logJson(filesGlob);

        const cssGlob = [this.flags.file];

        if (this.flags.localcss) {
            // optionally, add local css if it exists already
            cssGlob.push(this.flags.localcss);
        }

        this.ux.logJson(cssGlob);

        const options = {
            rejected: false,
            info: true
        };

        purify(filesGlob, cssGlob, options, result => {
            const strippedResult = stripCssComments(result);
            fs.writeFileSync(output, strippedResult);
        });
    }

    public getComponentName = componentPath => {
        const pathSplits = componentPath.split('/');
        return pathSplits[pathSplits.length - 1];
    };
}
