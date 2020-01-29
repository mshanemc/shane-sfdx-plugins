import { flags, SfdxCommand } from '@salesforce/command';
import { URL } from 'url';

import { exec } from '../../../shared/execProm';
import { QueryResult } from '../../../shared/typeDefs';
import { savePhotoForUserOrGroup } from '../../../shared/userPhoto';

import fs = require('fs-extra');

const tempRepo = 'tempRepo';
const photoRepo = 'https://github.com/mshanemc/badProfilePhotos';

export default class AllPhotos extends SfdxCommand {
    public static description = 'set the chatter photos of anyone who has not set theirs already to encourage them to do so';

    public static examples = ['sfdx shane:user:allphotos -u someAlias'];

    protected static flagsConfig = {
        repo: flags.url({
            char: 'r',
            default: new URL(photoRepo),
            description: 'optional alternate repo of photos, which contains a folder of photos named /img'
        }),
        folder: flags.directory({ char: 'f', description: 'optional local folder of photos.  Overrides --repo' })
    };

    protected static requiresUsername = true;

    protected static requiresProject = false;

    public async run(): Promise<any> {
        const conn = this.org.getConnection();
        let folderPath = this.flags.folder;
        // get our bad profile photos
        if (!this.flags.folder) {
            folderPath = `${tempRepo}/img`;
            await exec(`git clone ${this.flags.repo} ${tempRepo} --single-branch`);
        }

        const [users, photos] = await Promise.all([
            (conn.query(
                "select id, FirstName, LastName, FullPhotoUrl from user where fullPhotoUrl like '%/profilephoto/005/F%'"
            ) as unknown) as QueryResult,
            fs.readdir(folderPath)
        ]);

        const saveResults = await Promise.all(
            users.records.map((user, index) =>
                savePhotoForUserOrGroup({
                    conn,
                    userOrGroupId: user.Id,
                    filePath: `${tempRepo}/img/${photos[index % photos.length]}`
                })
            )
        );

        if (!this.flags.json) {
            this.ux.logJson(saveResults);
        }
        return saveResults;
    }
}
