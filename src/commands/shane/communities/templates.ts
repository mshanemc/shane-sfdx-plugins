/* tslint:disable:no-unused-expression */
import { SfdxCommand } from '@salesforce/command';

export default class Templates extends SfdxCommand {
    public static description = 'What templates are available for communities?';
    protected static requiresUsername = true;

    // tslint:disable-next-line: no-any
    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        const templateList = await conn.request(`${conn.baseUrl()}/connect/communities/templates`, {});

        if (!this.flags.json) {
            this.ux.logJson(templateList);
        }

        return templateList;
        // const filteredCommunities = communitiesList.communities
        //     .filter(c => c.siteAsContainerEnabled) // exclude sites without a community
        //     .filter(c => (this.flags.name && this.flags.name.length > 0 && c.name === this.flags.name) || !this.flags.name); // name matches -n OR there is no -n

        // if (filteredCommunities.length === 0) {
        //     let commError = 'No communities found';
        //     if (this.flags.name) {
        //         commError = `No communities matching "${this.flags.name}" in found communities [${communitiesList.communities.map(c => c.name)}]`;
        //     }
        //     throw Error(commError);
        // }

        // const promises = [];
        // this.ux.startSpinner(`Publishing communities via rest api [${filteredCommunities.map(c => c.name)}]...`);

        // for (const c of filteredCommunities) {
        //     const publishUrl = `${conn.baseUrl()}/connect/communities/${c.id}/publish`;
        //     promises.push(
        //         conn.request({
        //             method: 'POST',
        //             url: publishUrl,
        //             body: '{}'
        //         })
        //     );
        // }
        // const publishResults = await Promise.all(promises);

        // this.ux.stopSpinner('done');
        // return publishResults;
    }
}
