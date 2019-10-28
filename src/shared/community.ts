import { Connection } from '@salesforce/core';
import { Duration, sleep } from '@salesforce/kit';
import { JsonMap } from '@salesforce/ts-types';
import { CommunitiesRestResult } from './typeDefs';

interface ExternalAppsJSON {
    domain: string;
    communities: any; // tslint:disable-line:no-any
}

const ensureCommunity = async (conn: Connection, name: string): Promise<JsonMap> => {
    let tries = 0;
    let foundCommunity: JsonMap;

    while (!foundCommunity) {
        const communitiesList = <CommunitiesRestResult>(<unknown>await conn.request(`${conn.baseUrl()}/connect/communities/`));
        foundCommunity = communitiesList.communities.find(c => c.name === name);
        await sleep(Duration.seconds(5));
        tries++;
    }
    if (tries > 100) {
        throw new Error('Community not found');
    }
    return foundCommunity;
};

const getExternalApps = async (conn: Connection): Promise<ExternalAppsJSON> => {
    // get the domain
    const domains = await conn.query('select CnameTarget, Domain from Domain');
    // tslint:disable-next-line:no-any
    const mainDomain: any = domains.records.find((domain: any) => domain.CnameTarget === null);
    const output: ExternalAppsJSON = {
        domain: mainDomain.Domain,
        communities: {}
    };
    // get the networks

    const networks = await conn.query('select id, Name, status, UrlPathPrefix from Network where UrlPathPrefix != null');

    // tslint:disable-next-line:no-any
    networks.records.forEach((network: any) => {
        output.communities[network.UrlPathPrefix] = network.Name;
    });

    return output;
};

export { getExternalApps, ensureCommunity };
