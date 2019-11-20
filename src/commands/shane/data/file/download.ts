import { flags, SfdxCommand } from '@salesforce/command';
import * as fs from 'fs-extra';
import { Record } from '../../../../shared/typeDefs';

interface ContentVersion extends Record {
    Title: string;
    FileExtension: string;
    VersionData: string;
}
interface ContentDocument extends Record {
    LatestPublishedVersionId: string;
}

export default class Upload extends SfdxCommand {
    public static description = 'save a file from the org to the local filesystem';

    public static examples = [
        `sfdx shane:data:file:download -d 0691k000000MXfkAAG -o ./files/
    //save a ContentDocument from the org to the files directory, keeping the existing filename`,
        `sfdx shane:data:file:download -d 0691k000000MXfkAAG -o ./files/King.jpg
    //save a ContentDocument from the org to files/King.jpg`,
        `sfdx shane:data:file:download -d 0691k000000MXfkAAG
    //save a ContentDocument from the org to the current working directory, keeping the existing filename`,
        `sfdx shane:data:file:download -v 0681k000000MXfkAAG -o ./files/King.jpg
    //save a ContentVersion from the org to files/King.jpg`
    ];

    protected static flagsConfig = {
        documentid: flags.id({ char: 'd', description: 'optional ContentDocument ID that should be downloaded' }),
        documentversionid: flags.id({ char: 'v', description: 'optional ContentVersion ID that should be downloaded' }),
        outputpath: flags.filepath({
            char: 'o',
            description:
                'optional output path to save the file, if ommitted will save to current directory, ' +
                'if directory then it will keep the filename and save into that directory'
        })
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (this.flags.documentid && this.flags.documentversionid) {
                reject('Please include either documentid or documentVerionId but not both');
            }
            if (!this.flags.documentid && !this.flags.documentversionid) {
                reject('Please include one of documentid or documentVerionId');
            }

            // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
            const conn = this.org.getConnection();
            // tslint:disable-next-line:prefer-const
            let versionId = this.flags.documentversionid;
            if (this.flags.documentid) {
                versionId = (<ContentDocument>await conn.sobject('ContentDocument').retrieve(this.flags.documentid)).LatestPublishedVersionId;
            }

            const version = <ContentVersion>await conn.sobject('ContentVersion').retrieve(versionId);

            // Output starts are the files stored name and extention
            // tslint:disable-next-line:prefer-const
            let targetFilename = `${version.Title}.${version.FileExtension}`;
            // If output path is specified then assign it
            if (this.flags.outputpath) {
                targetFilename = this.flags.outputpath;
            }
            // Try and test the path to see if it is a directory, if it is then merge it with the stored name
            fs.stat(targetFilename, async (err, fStat) => {
                if (!err && fStat.isDirectory()) {
                    targetFilename = `${this.flags.outputpath}/${version.Title}.${version.FileExtension}`;
                }
                // later down the road we might add the ability to create the necessary folders to realize the path

                this.ux.startSpinner(`Downloading from ContentVersionId: ${versionId} into ${targetFilename}`);

                // Setting encoding to null so that it will be true binary buffer and not mutilated by applying string encoding
                // https://stackoverflow.com/questions/14855015/getting-binary-content-in-node-js-using-request
                // TODO: fix the types to achknowledge passing encoding as a property
                // tslint:disable-next-line:no-any
                const res = <Buffer>(<unknown>await conn.request(<any>{ url: version.VersionData, encoding: null }));
                fs.writeFile(targetFilename, res, wferr => {
                    this.ux.stopSpinner('Done!');
                    if (wferr) {
                        reject(wferr);
                    }
                    resolve();
                });
            });
        });
    }
}
