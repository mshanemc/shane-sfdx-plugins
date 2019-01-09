import { flags, SfdxCommand } from '@salesforce/command';

export default class FieldDescribe extends SfdxCommand {

  public static description = 'what fields are on the object?';

  public static examples = [
`sfdx shane:object:fields:describe -o Account -u someOrg
// list the fields (with type/label) on account
`
  ];

  protected static requiresUsername = true;

  protected static flagsConfig = {
    object: flags.string({required: true, char: 'o', description: 'the object to describe'})
  };

  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const conn = await this.org.getConnection();
    const metadata = await conn.sobject(this.flags.object).describe();
    // this.ux.logJson(metadata.fields);

    const output = [];

    for (const field of metadata.fields) {
      const rewritten = {
        name: field.name,
        label: field.label,
        type: typeTransform(field),
        required: requiredTransform(field)
      };
      output.push(rewritten);
    }

    this.ux.table(
      output,
      ['name', 'label', 'required', 'type']
    );

    function typeTransform(field) {
      if (field.calculated) {
        return `formula/${field.type}`;
      } else if (field.type === 'double') {
        return `${field.type} (${field.precision}, ${field.scale})`;
      } else if (field.type === 'reference') {
        return `${field.type} (${field.referenceTo})`;
      } else if (field.type === 'picklist' || field.type === 'multipicklist ') {
        return `${field.type}(${field.picklistValues.map(pLV => pLV.value)})`;
      } else {
        return field.type;
      }
    }

    function requiredTransform(field) {
      if (field.type === 'boolean') {
        return false;
      } else {
        return !field.nillable;
      }
    }
  }
}
