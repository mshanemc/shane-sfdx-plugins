import { flags, SfdxCommand } from '@salesforce/command';
import { singleRecordQuery } from './../../../../shared/queries';

export default class IdQuery extends SfdxCommand {
    public static description = 'query some object and get back the id of the matching record';

    public static examples = [
        `sfdx shane:data:id:query -o User -u platformers -w "Firstname = 'Shane' and Lastname = 'McLaughlin' and username = 'shane@platformers.org'"'
    // returns the id of the user. Use these ids between \`\` in other commands
    `
    ];

    protected static flagsConfig = {
        object: flags.string({ char: 'o', description: 'object', required: true }),
        where: flags.string({ char: 'w', description: 'SOQL where clause for your query', required: true })
    };

    protected static requiresUsername = true;
    protected static requiresProject = false;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const foundRecord = await singleRecordQuery({
            conn: this.org.getConnection(), // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
            query: `select id from ${this.flags.object} where ${this.flags.where}`
        });

        this.ux.log(foundRecord.Id);
        return foundRecord.Id;
    }
}
