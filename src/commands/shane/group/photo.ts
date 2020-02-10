import { flags, SfdxCommand } from '@salesforce/command';
import { singleRecordQuery } from '../../../shared/queries';
import { savePhotoForUserOrGroup } from '../../../shared/userPhoto';

export default class Photo extends SfdxCommand {
    public static description = 'Set the photo for a user by first/last name';

    public static examples = [
        `sfdx shane:group:photo -g AwesomePeople -f ~/Downloads/King.png
// sets the chatter photo for the group named AwesomePeople using the local file
`,
        `sfdx shane:group:photo -b ~/Downloads/King.png -g AwesomePeople
// sets the chatter banner photo for the group named AwesomePeople using the local file
`
    ];

    protected static flagsConfig = {
        group: flags.string({ char: 'g', description: 'the name of the group name you want to set the photo/banner for' }),
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
        const group = await singleRecordQuery({ conn, query: `select id from CollaborationGroup where name = '${this.flags.group}'` });

        this.ux.log(`found group with id ${group.Id}`);

        return savePhotoForUserOrGroup({
            conn,
            userOrGroupId: group.Id,
            filePath: this.flags.file ?? this.flags.banner,
            isBanner: typeof this.flags.banner === 'string',
            isGroup: true
        });
    }
}
