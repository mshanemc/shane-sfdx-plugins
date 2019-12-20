const metadataTypes: ProfilePermsetMetadataTypeUnion[] = [
    { migrates: true, profileType: 'applicationVisibilities', permSetType: 'applicationVisibilities', key: 'application' },
    { migrates: true, profileType: 'classAccesses', permSetType: 'classAccesses', key: 'apexClass' },
    { migrates: true, profileType: 'externalDataSourceAccesses', permSetType: 'externalDataSourceAccesses', key: 'externalDataSource' },
    { migrates: true, profileType: 'fieldPermissions', permSetType: 'fieldPermissions', key: 'field' },
    { migrates: true, profileType: 'objectPermissions', permSetType: 'objectPermissions', key: 'object' },
    { migrates: true, profileType: 'pageAccesses', permSetType: 'pageAccesses', key: 'apexPage' },
    { migrates: true, profileType: 'recordTypeVisibilities', permSetType: 'recordTypeVisibilities', key: 'recordType' },
    { migrates: true, profileType: 'tabVisibilities', permSetType: 'tabSettings', key: 'tab' },
    { migrates: false, profileType: 'layoutAssignments', key: 'layout' }
];

const thingsThatMigrate = metadataTypes.filter(item => item.migrates);

export { thingsThatMigrate, metadataTypes };

interface ProfilePermsetMetadataTypeUnion {
    migrates: boolean;
    profileType?: string;
    permSetType?: string;
    key: 'application' | 'apexClass' | 'externalDataSource' | 'field' | 'object' | 'apexPage' | 'recordType' | 'tab' | 'layout';
}
