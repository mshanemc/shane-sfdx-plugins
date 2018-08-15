import { SfdxCommand, UX } from '@salesforce/command';
// import child_process = require('child_process');

export default class FieldDescribe extends SfdxCommand {

  public static description = 'what fields are on the object?';

  public static examples = [
`sfdx shane:object:fields:describe -o Account -u someOrg
// list the fields (with type/label) on account
`
  ];

  protected static requiresUsername = true;

  protected static flagsConfig = {
    object: { type: 'string', required: true, char: 'o', description: 'the object to describe'}
  };

  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const conn = await this.org.getConnection();
    const metadata = await conn.sobject(this.flags.object).describe();
    this.ux.table(
      metadata.fields,
      ['name', 'label', 'type']
    );
  }
}
