import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import request = require('request-promise-native');
import localFile2CV = require('../../../shared/localFile2CV');
import userIdLookup = require('../../../shared/userIdLookup');

export default class Photo extends SfdxCommand {
    public static description = 'Set the photo for a user by first/last name';

    public static examples = [
        `sfdx shane:user:photo -f ~/Downloads/King.png -g User -l User
// sets the chatter photo for the user named User User using the local file
`,
        `sfdx shane:user:photo -b ~/Downloads/King.png -g User -l User
// sets the chatter banner photo for the user named User User using the local file
`,
        `sfdx shane:user:photo -f ~/Downloads/King.png -b ~/Downloads/OtherPhoto.jpg -g User -l User
// sets the chatter banner photo AND user photo at the same time
`
    ];

    protected static flagsConfig = {
        firstname: flags.string({ char: 'g', description: 'first (given) name of the user--keeping -f for file for consistency' }),
        lastname: flags.string({ char: 'l', required: true, description: 'last name of the user' }),
        file: flags.filepath({ char: 'f', description: 'local path of the photo to use', exclusive: ['banner'] }),
        banner: flags.filepath({ char: 'b', description: 'local path of the chatter banner photo to use', exclusive: ['file'] })
    };

    protected static requiresUsername = true;
    protected static requiresProject = false;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        // potential errors
        if (!this.flags.file && !this.flags.banner) {
            this.ux.error(chalk.red('you have to supply either --banner or --file'));
        }

        const conn = this.org.getConnection();
        const user = await userIdLookup.getUserId(conn, this.flags.lastname, this.flags.firstname);
        this.ux.log(`found user with id ${user.Id}`);

        // still here?  you must be doing an attachment
        const options = {
            method: 'POST',
            uri: `${conn.instanceUrl}/services/data/v42.0/connect/user-profiles/${user.Id}/photo`,
            json: true,
            body: {},
            headers: {
                Authorization: `Bearer ${conn.accessToken}`
            }
        };

        if (this.flags.file) {
            // const photoCV = (await localFile2CV.file2CV(conn, this.flags.file)) as Record;
            const photoCV = await localFile2CV.file2CV(conn, this.flags.file);
            const photoResult = await request({
                ...options,
                uri: `${conn.instanceUrl}/services/data/v42.0/connect/user-profiles/${user.Id}/photo`,
                body: {
                    fileId: photoCV.ContentDocumentId
                }
            });
            return photoResult;
        } else if (this.flags.banner) {
            const bannerCV = await localFile2CV.file2CV(conn, this.flags.banner);
            const bannerResult = await request({
                ...options,
                uri: `${conn.instanceUrl}/services/data/v42.0/connect/user-profiles/${user.Id}/banner-photo`,
                body: {
                    fileId: bannerCV.ContentDocumentId
                }
            });
            return bannerResult;
        }
    }
}
