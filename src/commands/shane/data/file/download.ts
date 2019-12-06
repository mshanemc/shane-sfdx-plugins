import { flags, SfdxCommand } from '@salesforce/command';
import * as fs from 'fs-extra';
import { singleRecordQuery } from '../../../../shared/queries';
import { Record } from '../../../../shared/typeDefs';

interface ContentVersion extends Record {
    Title: string;
    FileExtension: string;
    VersionData: string;
}
interface ContentDocument extends Record {
    LatestPublishedVersionId: string;
}

export default class DataFileDownload extends SfdxCommand {
    public static description = 'save a file from the org to the local filesystem';

    public static examples = [
        `sfdx shane:data:file:download -i 0691k000000MXfkAAG -o ./files/
    //save a ContentDocument from the org to the files directory, keeping the existing filename`,
        `sfdx shane:data:file:download -i 0691k000000MXfkAAG -o ./files/King.jpg
    //save a ContentDocument from the org to files/King.jpg`,
        `sfdx shane:data:file:download -i 0691k000000MXfkAAG
    //save a ContentDocument from the org to the current working directory, keeping the existing filename`,
        `sfdx shane:data:file:download -i 0681k000000MXfkAAG -o ./files/King.jpg
    //save a ContentVersion from the org to files/King.jpg`
    ];

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            description: 'name of the file in Salesforce that you want to download',
            exclusive: ['id']
        }),
        id: flags.id({
            char: 'i',
            description: 'optional ContentDocument ID or ContentVersion ID that should be downloaded',
            exclusive: ['name']
        }),
        filename: flags.string({
            char: 'f',
            description: 'optional filename.  Defaults to the filename of the contentVersion to download'
        }),
        directory: flags.directory({
            char: 'o',
            description:
                'optional output path to save the file, if ommitted will save to current directory, ' +
                'if directory then it will keep the filename and save into that directory',
            parse: input => input.replace(/\/$/, ''),
            default: '.'
        })
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();
        // tslint:disable-next-line:prefer-const
        let versionId: string;
        if (this.flags.id) {
            if (this.flags.id.startsWith('068')) {
                versionId = this.flags.id;
            } else if (this.flags.id.startsWith('069')) {
                versionId = (<ContentDocument>await conn.sobject('ContentDocument').retrieve(this.flags.id)).LatestPublishedVersionId;
            } else {
                throw new Error('Id should start with 068 (ContentVersion) or 069 (ContentDocument)');
            }
        } else if (this.flags.name) {
            versionId = (<ContentDocument>await singleRecordQuery({
                conn,
                query: `select id, LatestPublishedVersionId from ContentDocument where title='${this.flags.name}'`
            })).LatestPublishedVersionId;
        } else {
            throw new Error('Please include one of: name, id');
        }

        const version = <ContentVersion>await conn.sobject('ContentVersion').retrieve(versionId);

        // Output starts are the files stored name and extension
        // tslint:disable-next-line:prefer-const
        let targetFilename = this.flags.filename || `${version.Title}.${version.FileExtension}`;
        // If output path is specified then assign it
        if (this.flags.directory) {
            await fs.ensureDir(this.flags.directory);
        }
        // Try and test the path to see if it is a directory, if it is then merge it with the stored name

        this.ux.startSpinner(`Downloading from ContentVersionId: ${versionId} into ${targetFilename}`);

        // Setting encoding to null so that it will be true binary buffer and not mutilated by applying string encoding
        // https://stackoverflow.com/questions/14855015/getting-binary-content-in-node-js-using-request
        // TODO: fix the types to acknowledge passing encoding as a property
        // tslint:disable-next-line:no-any
        const res = <Buffer>(<unknown>await conn.request(<any>{ url: version.VersionData, encoding: null }));
        // const res = <Buffer>(<unknown>await conn.request(version.VersionData, { encoding: null }));
        await fs.writeFile(`${this.flags.directory}/${targetFilename}`, res);
        this.ux.stopSpinner('Done!');
        // so programmatic users will know where it ended up going
        return {
            path: `${this.flags.directory}/${targetFilename}`
        };
    }
}
