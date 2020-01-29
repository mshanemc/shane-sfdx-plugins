import { execProm } from './execProm';

import fs = require('fs-extra');
import requestPromise = require('request-promise-native');

const testReposSource = `https://raw.githubusercontent.com/mshanemc/deploy-to-sfdx/master/src/server/__tests__/helpers/testRepos.ts`;
const tempDir = 'testProjectSummarize';
const poolsURL = `https://cdo-demo-main-159a7094ef6-15ab9e95e81.secure.force.com/pools/services/apexrest/pools/Production`;

(async () => {
    const getCommandsFromFile = async filepath => {
        const filetext = await fs.readFile(`${filepath}/orgInit.sh`, 'utf8');
        // collect plugin commands (sfdx shane:\S*)\w+

        const matchedCommands = [...new Set([...filetext.matchAll(/(sfdx shane:\S*)\s/g)].map(item => item[0].trim()))];
        return matchedCommands;
    };

    await fs.remove(tempDir);
    // get the pools and turn into repo urls
    const poolsReposAsURLs = JSON.parse(await requestPromise(poolsURL)).map(repo => `https://github.com/${repo.user}/${repo.repo}`);
    // console.log(poolsReposAsURLs);
    // get the test repos and turn into repo urls
    await fs.ensureDir(tempDir);
    const testReposInText = await requestPromise(testReposSource);
    await fs.writeFile(
        `./${tempDir}/testRepos.ts`,
        testReposInText.replace(`import { TestRepo } from '../../lib/types';`, '').replace(`: { [name: string]: TestRepo[] } `, '')
    );
    const { testRepos } = await import(`../../${tempDir}/testRepos`);
    await fs.remove(`${tempDir}/testRepos.ts`);

    const testReposAsURLs = Object.keys(testRepos)
        .map(key => testRepos[key])
        .flat()
        .map(item => `https://github.com/${item.username}/${item.repo}`.toLowerCase());

    // de-dupe
    const uniqueRepoUrls = [...new Set([...poolsReposAsURLs, ...testReposAsURLs])];
    // console.log(uniqueRepoUrls);
    // clone all
    await Promise.all(uniqueRepoUrls.map((repo, index) => execProm(`git clone ${repo} ${tempDir}/repo${index}`)));
    const directories = await fs.readdir(tempDir);
    const commands = [...new Set((await Promise.all(directories.map(dir => getCommandsFromFile(`${tempDir}/${dir}`)))).flat(Infinity))]
        .map(item => item.trim())
        .sort();
    // save in a json file
    // console.log(JSON.stringify(commands));
    await fs.writeJson('commandInventory.json', commands);
    // cleanup
    await fs.remove(tempDir);
})();
