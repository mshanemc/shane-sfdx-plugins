/* tslint:disable:no-unused-expression */
import { flags, SfdxCommand } from '@salesforce/command';
import { JsonMap } from '@salesforce/ts-types';
import { ensureCommunity } from '../../../shared/community';

export default class CommunityCreate extends SfdxCommand {
    public static description = 'Create a community using the rest api';
    public static examples = [
        `sfdx shane:communities:create -n MyCommunity -t "Customer Account Portal"
// create a community using the template
`,
        `sfdx shane:communities:create -n MyCommunity -t "Customer Account Portal" -d "this is the description" -p "customers" --async
// create a community using the template, with optional description and path, and don't wait for completion to finish.
`
    ];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            description: 'name of the community to create',
            required: true
        }),
        description: flags.string({ char: 'd', description: 'Description of your community.  Hint: Put it in quotes' }),
        template: flags.string({
            char: 't',
            description: 'template name.  Use sfdx shane:communities:templates to get the list of options',
            required: true
        }),
        prefix: flags.string({ char: 'p', description: 'url path prefix.  Example: customers' }),
        async: flags.boolean({ description: 'do not wait for the community to be created.  Use shane:communities:ensure to check on its completion' })
    };

    // tslint:disable-next-line: no-any
    public async run(): Promise<any> {
        const conn = this.org.getConnection();

        const dataToPass: JsonMap = {
            name: this.flags.name,
            templateName: this.flags.template
        };

        if (this.flags.description) {
            dataToPass.description = this.flags.description;
        }

        if (this.flags.prefix) {
            dataToPass.urlPathPrefix = this.flags.prefix;
        }

        this.ux.startSpinner(`Creating community via rest api`);

        const createResult = <JsonMap>await conn.request({
            body: JSON.stringify(dataToPass),
            method: 'POST',
            url: `${conn.baseUrl()}/connect/communities/`
        });

        // this.ux.logJson(createResult);

        if (this.flags.async) {
            this.ux.log('community creation pending');
            return createResult;
        }

        const foundCommunity = await ensureCommunity(conn, this.flags.name);
        return foundCommunity;
    }
}
