/* tslint:disable:no-unused-expression */
import { flags, SfdxCommand } from '@salesforce/command';
import { CommunitiesRestResult } from '../../../shared/typeDefs';

export default class CommunityPublish extends SfdxCommand {
    public static description = 'Publish a community using a headless browser';

    protected static requiresUsername = true;

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            description: 'name of the community to publish (case sensitive!)'
        })
    };

    public static examples = [
        `sfdx shane:communities:publish
// publishes all the communities in the org
`,
        `sfdx shane:communities:publish -n customer
// finds a community named customer, publishes it.
`
    ];

    // tslint:disable-next-line: no-any
    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        const communitiesList = ((await conn.request(`${conn.baseUrl()}/connect/communities/`)) as unknown) as CommunitiesRestResult;

        const filteredCommunities = communitiesList.communities
            .filter(c => c.siteAsContainerEnabled) // exclude sites without a community
            .filter(c => (this.flags.name && this.flags.name.length > 0 && c.name === this.flags.name) || !this.flags.name); // name matches -n OR there is no -n

        if (filteredCommunities.length === 0) {
            let commError = 'No communities found';
            if (this.flags.name) {
                commError = `No communities matching "${this.flags.name}" in found communities [${communitiesList.communities.map(c => c.name)}]`;
            }
            throw new Error(commError);
        }

        this.ux.startSpinner(`Publishing communities via rest api [${filteredCommunities.map(c => c.name)}]...`);

        const publishResults = await Promise.all(
            filteredCommunities.map(c =>
                conn.request({
                    method: 'POST',
                    url: `${conn.baseUrl()}/connect/communities/${c.id}/publish`,
                    body: '{}'
                })
            )
        );

        this.ux.stopSpinner('done');
        return publishResults;
    }
}
