// for a given object and optionally field, which profiles/permsets have access, and optionally, what all users are those?
import { flags, SfdxCommand } from '@salesforce/command';

export default class PermCheck extends SfdxCommand {
    public static description = 'who has access to what';

    public static examples = [
        `sfdx shane:permset:check -o Project__c --profiles --permsets
    // list the profiles and permsets that have Read access to the object
    `,
        `sfdx shane:permset:check -o Project__c -f Due_Date__c --fieldlevel Edit --profiles --permsets
    // list the profiles and permsets that have Edit access to the field on the object
    `,
        `sfdx shane:permset:check -o Project__c -f Due_Date__c --users
    // list the users that have Read access to the field on the object, and the profile/permset(s) that are granting it
    `
    ];

    protected static flagsConfig = {
        object: flags.string({ char: 'o', description: 'what object to check perms on', required: true }),
        field: flags.string({ char: 'f', description: 'what field to check' }),
        profiles: flags.boolean({ description: 'return names/ids of profiles' }),
        permsets: flags.boolean({ description: 'return names/ids of permission sets' }),
        users: flags.boolean({
            description: 'return names/ids of users with those profiles and/or permission sets',
            exclusive: ['permsets', 'profiles']
        }),
        fieldlevel: flags.string({ description: 'what level of perms are you looking for', default: 'Read', options: ['Read', 'Edit'] }),
        objectlevel: flags.string({
            description: 'what level of perms are you looking for',
            default: 'Read',
            options: ['Read', 'Edit', 'Create', 'Delete', 'ViewAll', 'ModifyAll']
        })
    };

    protected static requiresUsername = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const output = [];
        if (!this.flags.profiles && !this.flags.permsets && !this.flags.users) {
            throw new Error('add --profiles, --permsets or --users to say what you want in your table');
        }

        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();
        let withAccess;

        if (this.flags.field) {
            // tslint:disable-next-line:no-any
            withAccess = <any[]>(
                (await conn.query(
                    `select ParentId, Parent.Name, Parent.IsOwnedByProfile, Parent.ProfileId from FieldPermissions where ${levelTranlator(
                        this.flags.fieldlevel
                    )} = true and SobjectType = '${this.flags.object}' and Field = '${this.flags.object}.${this.flags.field}'`
                )).records
            );
        } else {
            // tslint:disable-next-line:no-any
            withAccess = <any[]>(
                (await conn.query(
                    `select ParentId, Parent.Name, Parent.IsOwnedByProfile, Parent.ProfileId from ObjectPermissions where ${levelTranlator(
                        this.flags.objectlevel
                    )} = true and SobjectType = '${this.flags.object}'`
                )).records
            );
        }

        const profileswithAccess = withAccess.filter(ps => ps.Parent.IsOwnedByProfile);
        const permsetswithAccess = withAccess.filter(ps => !ps.Parent.IsOwnedByProfile);

        // tslint:disable-next-line:no-any
        const profilesById = async permsetsList => {
            if (permsetsList.length === 0) {
                return [];
            }
            const query = `select id, Name from Profile where id in (${permsetsList.map(ps => `'${ps.Parent.ProfileId}'`).join(',')})`;
            return (await conn.query(query)).records;
        };

        if (this.flags.profiles || this.flags.users) {
            // tslint:disable-next-line:no-any
            const profiles = <any[]>await profilesById(profileswithAccess);
            profiles.forEach(profile => {
                output.push({
                    type: 'Profile',
                    name: profile.Name,
                    id: profile.Id
                });
            });
        }

        if (this.flags.permsets || this.flags.users) {
            permsetswithAccess.forEach(ps => {
                output.push({
                    type: 'PermissionSet',
                    name: ps.Parent.Name,
                    id: ps.ParentId
                });
            });
        }

        if (this.flags.users) {
            // which users have that profile?
            const query = `select id, username, Name, Profile.Name from User where ProfileId in (${output
                .filter(i => i.type === 'Profile')
                .map(profile => `'${profile.id}'`)
                .join(',')})`;
            // tslint:disable-next-line:no-any
            const profileUsers = <any[]>(await conn.query(query)).records;
            const userOutput = profileUsers.map(user => ({
                userid: user.Id,
                name: user.Name,
                username: user.Username,
                profile: user.Profile.Name,
                permsets: []
            }));

            const psaQuery = `select AssigneeId, Assignee.Username, Assignee.Name, PermissionSet.Name from PermissionSetAssignment where PermissionSetId in (${output
                .filter(i => i.type === 'PermissionSet')
                .map(ps => `'${ps.id}'`)
                .join(',')})`;
            // tslint:disable-next-line:no-any
            const psaUsers = <any[]>(await conn.query(psaQuery)).records;
            psaUsers.forEach(psaUser => {
                // if in the list, add the permset to the permsets columns
                const index = userOutput.findIndex(user => user.userid === psaUser.AssigneeId);
                if (index >= 0) {
                    userOutput[index].permsets.push(psaUser.PermissionSet.Name);
                } else {
                    userOutput.push({
                        userid: psaUser.AssigneeId,
                        name: psaUser.Assignee.Name,
                        username: psaUser.Assignee.Username,
                        profile: null,
                        permsets: [psaUser.PermissionSet.Name]
                    });
                }
            });

            this.ux.table(userOutput, ['userid', 'name', 'username', 'profile', 'permsets']);
            return userOutput;
        } else {
            this.ux.table(output, ['type', 'name', 'id']);
            return output;
        }
    }
}

const levelTranlator = objectlevel => {
    if (objectlevel === 'Read') return 'PermissionsRead';
    if (objectlevel === 'Create') return 'PermissionsCreate';
    if (objectlevel === 'Edit') return 'PermissionsEdit';
    if (objectlevel === 'Delete') return 'PermissionsDelete';
    if (objectlevel === 'ViewAll') return 'PermissionsViewAllRecords';
    if (objectlevel === 'ModifyAll') return 'PermissionsModifyAllRecords';
};
