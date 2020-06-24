import { flags, SfdxCommand } from '@salesforce/command';
import { dump } from 'js-yaml';

import fs = require('fs-extra');

const getRandomInt = (min, max) => {
    const roundedMin = Math.ceil(min);
    const roundedMax = Math.floor(max);
    return Math.floor(Math.random() * (roundedMax - roundedMin)) + roundedMin; // The maximum is exclusive and the minimum is inclusive
};
export default class GithubAction extends SfdxCommand {
    public static description = 'adds an action to test your repo against https://github.com/mshanemc/deploy-to-sfdx using github actions';

    public static examples = [
        `sfdx shane:github:action
// tests against both prod and prerel(gs0) deployers
`
    ];

    protected static requiresProject = true;

    protected static flagsConfig = {
        skipprod: flags.boolean({ char: 'p', description: 'omit the production deployer' }),
        skipprerel: flags.boolean({ char: 'r', description: 'omit the pre-release deployer' })
    };

    public async run(): Promise<any> {
        await fs.outputFile(`.github/workflows/deployer.yml`, dump(this.testyaml(), { indent: 4, noCompatMode: true })); // yaml for github actions
    }

    public testyaml() {
        const production = {
            'runs-on': 'ubuntu-latest',
            name: 'production deployer end-to-end test',
            steps: [
                {
                    name: 'production',
                    id: 'production',
                    uses: 'mshanemc/deployer-check-javascript-action@master'
                }
            ]
        };
        const prerelease = {
            'runs-on': 'ubuntu-latest',
            name: 'prerelease deployer end-to-end test',
            steps: [
                {
                    name: 'prerelease',
                    id: 'prerelease',
                    uses: 'mshanemc/deployer-check-javascript-action@master',
                    with: { 'deployer-url': 'https://deployer-prerelease.herokuapp.com' }
                }
            ]
        };
        const output: any = {
            name: 'deployer-test',
            on: {
                pull_request: null,
                push: { branches: ['master'] },

                // schedule: [{ cron: `"${getRandomInt(0, 60)} ${getRandomInt(0, 24)} * * ${getRandomInt(0, 7)}"` }]
                schedule: [{ cron: `* ${getRandomInt(0, 24)} * * ${getRandomInt(0, 7)}` }]
            },
            jobs: {}
        };
        if (!this.flags.skipprod) {
            output.jobs.production = production;
        }
        if (!this.flags.skipprerel) {
            output.jobs.prerelease = prerelease;
        }
        return output;
    }
}
