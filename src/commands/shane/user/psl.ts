import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import userIdLookup = require('../../../shared/userIdLookup');
import { QueryResult } from './../../../shared/typeDefs';

export default class PSLAssign extends SfdxCommand {

  public static description = 'Assign a permset license already in an org for a user';

  public static examples = [
`sfdx shane:user:psl -n SomePSL -g User -l User
// assign the PSL named 'somePSL' for the user named User User
`
  ];

  protected static flagsConfig = {
    firstname: flags.string({char: 'g', description: 'first (given) name of the user--keeping -f for file for consistency'}),
    lastname: flags.string({char: 'l', required: true, description: 'last name of the user' }),
    name: flags.filepath({char: 'n', required: true, description: 'developer name or label of the PermSetLicense'})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  // protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    // const name = this.flags.name || 'world';

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();
    // const query = 'Select Name, TrialExpirationDate from Organization';
    let user;

    try {
      user = await userIdLookup.getUserId(conn, this.flags.lastname, this.flags.firstname);
    } catch (e) {
      this.ux.error(chalk.red(e));
      throw new Error (e);
    }

    this.ux.log(`found user with id ${user.Id}`);

    const PSLs = <QueryResult> await conn.query(`select Id, DeveloperName, MasterLabel from PermissionSetLicense where DeveloperName = '${this.flags.name}' or MasterLabel = '${this.flags.name}'`);
    if (PSLs.totalSize > 1) {
      throw new Error('There are more than 1 result for that name.');
    } else if (PSLs.totalSize === 0) {
      throw new Error('PSL not found');
    } else {
      this.ux.log(`found PSL with id ${PSLs.records[0].Id}`);
    }

    const createResult = await conn.create('PermissionSetLicenseAssign', {
      AssigneeId: user.Id,
      PermissionSetLicenseId: PSLs.records[0].Id
    });
    this.ux.logJson(createResult);
    return createResult;
  }
}
