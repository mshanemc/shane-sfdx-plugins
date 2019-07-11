import { Connection } from '@salesforce/core';

interface ExternalAppsJSON {
    domain: string;
    communities: any; // tslint:disable-line:no-any
}

export async function getExternalApps(conn: Connection): Promise<ExternalAppsJSON> {
    // get the domain
    const domains = await conn.query('select CnameTarget, Domain from Domain');
    const mainDomain: any = domains.records.find((domain: any) => domain.CnameTarget === null); // tslint:disable-line:no-any
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
}
