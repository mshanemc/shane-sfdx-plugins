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
        object: flags.string({ required: true, char: 'o', description: 'the object to describe' })
    };

    public async run(): Promise<any> {
        const conn = await this.org.getConnection();
        const metadata = await conn.sobject(this.flags.object).describe();
        // this.ux.logJson(metadata.fields);

        const output = metadata.fields.map(field => ({
            name: field.name,
            label: field.label,
            type: typeTransform(field),
            required: requiredTransform(field)
        }));
        this.ux.table(output, ['name', 'label', 'required', 'type']);

        function typeTransform(field) {
            if (field.calculated) {
                return `formula/${field.type}`;
            }
            if (field.type === 'double') {
                return `${field.type} (${field.precision}, ${field.scale})`;
            }
            if (field.type === 'reference') {
                return `${field.type} (${field.referenceTo})`;
            }
            if (field.type === 'picklist' || field.type === 'multipicklist ') {
                return `${field.type}(${field.picklistValues.map(pLV => pLV.value)})`;
            }
            return field.type;
        }

        function requiredTransform(field) {
            if (field.type === 'boolean') {
                return false;
            }
            return !field.nillable;
        }
    }
}
