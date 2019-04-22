import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import { QueryResult } from '../../../../shared/typeDefs';
import userIdLookup = require('../../../../shared/userIdLookup');

export default class UserPermsetSassign extends SfdxCommand {

  public static description = 'Assign a permset to a user by first/last name';

  public static examples = [ 'sfdx shane:user:permset:assign -n thePermSet -g User -l User' ];

  protected static flagsConfig = {
    firstname: flags.string({char: 'g', description: 'first (given) name of the user--keeping -f for file for consistency'}),
    lastname: flags.string({char: 'l', required: true, description: 'last name of the user' }),
    name: flags.string({char: 'n', required: true, description: 'the value of the permset name or label field'})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  // protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();
    let user;

    try {
      user = await userIdLookup.getUserId(conn, this.flags.lastname, this.flags.firstname);
    } catch (e) {
      this.ux.error(chalk.red(e));
      throw new Error (e);
    }

    this.ux.log(`found user with id ${user.Id}`);

    // find the permset id
    const permset = <QueryResult> await conn.query(`select id, Name from PermissionSet where Name = '${this.flags.name}' OR Label = '${this.flags.name}'`);
    if (permset.totalSize === 0) {
      throw new Error('no permset found');
    } else if (permset.totalSize > 1) {
      throw new Error(`multiple permsets found: ${permset.records.map( ps => ps.Name).join(',')}`);
    }

    this.ux.log(`found permset with id ${permset.records[0].Id}`);

    const result = await conn.create('PermissionSetAssignment', {
      PermissionSetId : permset.records[0].Id,
      AssigneeId: user.Id
    });

    this.ux.log(`Assigned permset ${this.flags.name} (${permset.records[0].Id}) to user ${this.flags.firstname  ? this.flags.firstname : ''} ${this.flags.lastname} (${user.Id})`);

    return result;

  }
}
