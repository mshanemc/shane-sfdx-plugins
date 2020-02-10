import { flags, SfdxCommand } from '@salesforce/command';
import { savePhotoForUserOrGroup } from '../../../shared/userPhoto';

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

    public async run(): Promise<any> {
        // potential errors
        if (!this.flags.file && !this.flags.banner) {
            throw new Error('you have to supply either --banner or --file');
        }

        const conn = this.org.getConnection();
        const user = await userIdLookup.getUserId(conn, this.flags.lastname, this.flags.firstname);
        this.ux.log(`found user with id ${user.Id}`);

        return savePhotoForUserOrGroup({
            conn,
            userOrGroupId: user.Id,
            filePath: this.flags.file ?? this.flags.banner,
            isBanner: typeof this.flags.banner === 'string'
        });
    }
}
