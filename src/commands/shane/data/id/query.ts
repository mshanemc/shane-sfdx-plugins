import { SfdxCommand } from '@salesforce/command';

export default class IdQuery extends SfdxCommand {

  public static description = 'query some object and get back the id of the matching record';

  public static examples = [
    `sfdx shane:data:id:query -o User -u platformers -w "Firstname = 'Shane' and Lastname = 'McLaughlin' and username = 'shane@platformers.org'"'
    // returns the id of the user. Use these ids between \`\` in other commands
    `
  ];

  protected static flagsConfig = {
    object: { char: 'o', description: 'object', required: true, type: 'string' },
    where: { char: 'w', description: 'SOQL where clause for your query', required: true, type: 'string' }
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  // protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    interface Record {
      attributes: object;
      Id: string;
    }

    interface QueryResult {
      totalSize: number;
      done: boolean;
      records: Record[];
    }

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();
    const query = `select id from ${this.flags.object} where ${this.flags.where}`;

    const results = <QueryResult> await conn.query(query);

    if (results.records.length > 1) {
      throw new Error('There are more than 1 matching records');
    } else if (results.records.length === 0) {
      throw new Error('No records found');
    } else {
      // tslint:disable-next-line:no-any
      this.ux.log(results.records[0].Id);
      return results.records[0].Id;
    }
  }
}
