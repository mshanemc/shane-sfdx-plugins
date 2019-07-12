import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import fs = require('fs-extra');
import jsToXml = require('js2xmlparser');
import * as _ from 'lodash';
import { fixExistingDollarSign, getExisting } from '../../../shared/getExisting';
import * as options from '../../../shared/js2xmlStandardOptions';
import { setupArray } from '../../../shared/setupArray';

const thingsThatMigrate = [
    { profileType: 'applicationVisibilities', permSetType: 'applicationVisibilities', key: 'application' },
    { profileType: 'classAccesses', permSetType: 'classAccesses', key: 'apexClass' },
    { profileType: 'externalDataSourceAccesses', permSetType: 'externalDataSourceAccesses', key: 'externalDataSource' },
    { profileType: 'fieldPermissions', permSetType: 'fieldPermissions', key: 'field' },
    { profileType: 'objectPermissions', permSetType: 'objectPermissions', key: 'object' },
    { profileType: 'pageAccesses', permSetType: 'pageAccesses', key: 'apexPage' },
    { profileType: 'recordTypeVisibilities', permSetType: 'recordTypeVisibilities', key: 'recordType' },
    { profileType: 'tabVisibilities', permSetType: 'tabSettings', key: 'tab' }
];

export default class PermSetConvert extends SfdxCommand {
    public static description = 'convert a profile into a permset';

    public static examples = [
        `sfdx shane:profile:convert -p Admin -n MyNewPermSet -e
// create a permset in force-app/main/default from the Admin profile (profiles/Admin).  If MyNewPermSet doesn't exist, it will be created.  Content is removed from Admin profile (-e)
`,
        `sfdx shane:profile:convert -p Admin -n MyNewPermSet -c
// create a permset in force-app/main/default from the Admin profile (profiles/Admin).  If MyNewPermSet doesn't exist, it will be created.  Leaves the original Admin profile and creates an Admin_Skinny profile that has everything in the permset removed (-c)
`
    ];

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            required: true,
            description: "path to existing permset.  If it exists, new perms will be added to it.  If not, then it'll be created for you"
        }),
        profile: flags.string({
            char: 'p',
            required: true,
            description: 'API name of an profile to convert.  If blank, then you mean ALL the objects and ALL their fields and ALL their tabs'
        }),
        directory: flags.directory({
            char: 'd',
            default: 'force-app/main/default',
            description: 'Where is all this metadata? defaults to force-app/main/default'
        }),
        editprofile: flags.boolean({ char: 'e', description: 'remove metadata from original profile', exclusive: ['skinnyclone'] }),
        skinnyclone: flags.boolean({
            char: 'c',
            description: "create a new profile that's the original profile less permset (does not modify original profile)",
            exclusive: ['editprofile']
        })
    };

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const targetFilename = `${this.flags.directory}/permissionsets/${this.flags.name}.permissionset-meta.xml`;
        const targetProfile = `${this.flags.directory}/profiles/${this.flags.profile}.profile-meta.xml`;

        // verify profile's existence locally
        if (!fs.existsSync(targetProfile)) {
            throw new Error(`profile not found: ${targetProfile}`);
        }

        let existing = await getExisting(targetFilename, 'PermissionSet', {
            '@': {
                xmlns: 'http://soap.sforce.com/2006/04/metadata'
            },
            hasActivationRequired: 'false',
            label: this.flags.name
        });

        let profile = await getExisting(targetProfile, 'Profile');

        thingsThatMigrate.forEach(item => {
            if (profile[item.profileType]) {
                profile = setupArray(profile, item.profileType);
                existing = setupArray(existing, item.permSetType);

                this.ux.log(`copying ${item.profileType} to perm set`);
                existing[item.permSetType] = _.unionBy(existing[item.permSetType], profile[item.profileType], item.key); // merge profile with existing permset array

                // special handling for applicationVisibility (default not allowed in permset)
                if (item.permSetType === 'applicationVisibilities') {
                    existing.applicationVisibilities = existing.applicationVisibilities.map(aV => {
                        delete aV.default;
                        return aV;
                    });
                }

                if (item.permSetType === 'recordTypeVisibilities') {
                    existing.recordTypeVisibilities = existing.recordTypeVisibilities.map(rtV => {
                        delete rtV.default;
                        delete rtV.personAccountDefault;
                        return rtV;
                    });
                }

                if (item.permSetType === 'tabSettings') {
                    existing.tabSettings = existing.tabSettings.map(tV => ({ ...tV, visibility: translateTabTypes(tV.visibility) }));
                }

                if (this.flags.editprofile) {
                    delete profile[item.profileType];
                }
            } else {
                this.ux.log(`found no ${item.profileType} on the profile`);
            }
        });

        existing = await fixExistingDollarSign(existing);

        fs.ensureDirSync(`${this.flags.directory}/permissionsets`);

        // convert to xml and write out the file
        const permSetXml = jsToXml.parse('PermissionSet', existing, options.js2xmlStandardOptions);
        fs.writeFileSync(targetFilename, permSetXml);

        // we either write this file over existing profile, or to a new one.
        if (this.flags.editprofile || this.flags.skinnyclone) {
            // correct @ => $ issue
            profile = await fixExistingDollarSign(profile);

            const profileXml = jsToXml.parse('Profile', profile, options.js2xmlStandardOptions);

            if (this.flags.editprofile) {
                // edit the existing profile
                fs.writeFileSync(targetProfile, profileXml);
                this.ux.log(`Permissions removed from ${targetProfile}`);
            } else if (this.flags.skinnyclone) {
                // save it as a new profile
                const skinnyTarget = `${this.flags.directory}/profiles/${this.flags.profile}_Skinny.profile-meta.xml`;
                fs.writeFileSync(skinnyTarget, profileXml);
                this.ux.log(chalk.green(`Skinny version saved at ${skinnyTarget}`));
            }
        }

        this.ux.log(chalk.green(`Permissions added in ${targetFilename}`));
        return existing; // for someone who wants the JSON?
    }
}

const translateTabTypes = profileTabType => {
    if (profileTabType === 'DefaultOff') return 'Available';
    else if (profileTabType === 'DefaultOn') return 'Visible';
    else if (profileTabType === 'Hidden') return 'None';
    else throw new Error(`unmatched tab visibility type on profile: ${profileTabType}`);
};
