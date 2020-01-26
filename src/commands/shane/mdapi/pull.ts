import { flags, SfdxCommand } from '@salesforce/command';
import fs = require('fs-extra');

import { exec } from '../../../shared/execProm';
import * as options from '../../../shared/js2xmlStandardOptions';

import jsToXml = require('js2xmlparser');

const retryLimit = 5;

const booleanFlags = {
    code: ['ApexClass', 'ApexTrigger', 'ApexComponent', 'ApexPage', 'AuraDefinitionBundle', 'StaticResource'],
    perms: ['PermissionSet', 'Profile', 'Role', 'CustomPermission', 'Group'],
    schema: ['ExternalDataSource', 'CustomMetadata', 'RecordType', 'GlobalValueSet', 'CustomField', 'CustomObject', 'StandardValueSet'],
    ui: [
        'CompactLayout',
        'Layout',
        'ListView',
        'CustomTab',
        'AppMenu',
        'CustomApplication',
        'CustomPageWebLink',
        'HomePageComponent',
        'HomePageLayout',
        'PathAssistant',
        'WebLink',
        'CustomLabels',
        'FlexiPage',
        'QuickAction'
    ],
    wave: ['WaveApplication', 'WaveDashboard', 'WaveDataflow', 'WaveLens', 'WaveTemplateBundle', 'Wavexmd', 'WaveDataset'],
    reporting: ['Report', 'Dashboard']
};

const standardObjects = [
    'Account',
    'AccountContactRelation',
    'AccountContactRole',
    'Activity',
    'Asset',
    'AssistantProgress',
    'Campaign',
    'CampaignMember',
    'Case',
    'CaseContactRole',
    'Contact',
    'ContentVersion',
    'Contract',
    'ContractContactRole',
    'DuplicateRecordItem',
    'DuplicateRecordSet',
    'EmailMessage',
    'Event',
    'ExchangeUserMapping',
    'FeedItem',
    'Idea',
    'Lead',
    'LinkedArticle',
    'Macro',
    'MacroAction',
    'MacroInstruction',
    'Opportunity',
    'OpportunityCompetitor',
    'OpportunityContactRole',
    'OpportunityLineItem',
    'Order',
    'OrderItem',
    'PartnerRole',
    'Pricebook2',
    'PricebookEntry',
    'Product2',
    'ProfileSkill',
    'ProfileSkillEndorsement',
    'ProfileSkillUser',
    'Quote',
    'QuoteLineItem',
    'Site',
    'SocialPersona',
    'Solution',
    'StreamingChannel',
    'Task',
    'Territory',
    'User',
    'WorkBadge',
    'WorkBadgeDefinition',
    'WorkThanks'
];
const StandardValueSets = [
    'AccountContactMultiRoles',
    'AccountContactRole',
    'AccountOwnership',
    'AccountRating',
    'AccountType',
    'AssetStatus',
    'CampaignMemberStatus',
    'CampaignStatus',
    'CampaignType',
    'CaseContactRole',
    'CaseOrigin',
    'CasePriority',
    'CaseReason',
    'CaseStatus',
    'CaseType',
    'ContactRole',
    'ContractContactRole',
    'ContractStatus',
    'EntitlementType',
    'EventSubject',
    'EventType',
    'FiscalYearPeriodName',
    'FiscalYearPeriodPrefix',
    'FiscalYearQuarterName',
    'FiscalYearQuarterPrefix',
    'IdeaCategory',
    'IdeaMultiCategory',
    'IdeaStatus',
    'IdeaThemeStatus',
    'Industry',
    'LeadSource',
    'LeadStatus',
    'OpportunityCompetitor',
    'OpportunityStage',
    'OpportunityType',
    'OrderType',
    'PartnerRole',
    'Product2Family',
    'QuestionOrigin',
    'QuickTextCategory',
    'QuickTextChannel',
    'QuoteStatus',
    'RoleInTerritory2',
    'SalesTeamRole',
    'Salutation',
    'ServiceContractApprovalStatus',
    'SocialPostClassification',
    'SocialPostEngagementLevel',
    'SocialPostReviewedStatus',
    'SolutionStatus',
    'TaskPriority',
    'TaskStatus',
    'TaskSubject',
    'TaskType',
    'WorkOrderLineItemStatus',
    'WorkOrderPriority',
    'WorkOrderStatus'
];

const CrawlDown = [];

const pkgDir = 'pkgDirTemp';

export default class Pull extends SfdxCommand {
    public static description = 'gets unpackaged metadata for you';

    public static examples = [
        `sfdx shane:mdapi:pull -c -u someOrg
// pulls code kinda stuff from the org and converts/merges it into your project's default pkgDir
`,
        `sfdx shane:mdapi:pull -u someOrg
// pulls all the external data source metadata from the org and converts/merges it into your project's default pkgDir
`
    ];

    protected static requiresUsername = true;

    protected static flagsConfig = {
        code: flags.boolean({ char: 'c', description: booleanFlags.code.join(','), exclusive: ['all'] }),
        perms: flags.boolean({ char: 'p', description: booleanFlags.perms.join(','), exclusive: ['all'] }),
        wave: flags.boolean({ description: booleanFlags.wave.join(','), exclusive: ['all'] }),
        schema: flags.boolean({ char: 's', description: booleanFlags.schema.join(','), exclusive: ['all', 'object'] }),
        ui: flags.boolean({ char: 'i', description: booleanFlags.ui.join(','), exclusive: ['all'] }),
        reporting: flags.boolean({ description: booleanFlags.reporting.join(','), exclusive: ['all'] }),

        object: flags.string({ char: 'o', description: 'pull metadata for a single object', exclusive: ['all', 'schema'] }),
        type: flags.string({ char: 't', description: 'pull only a specific type.  See the metadata api docs for type names', exclusive: ['all'] }),
        // TODO: automation, security, reporting, i18n
        all: flags.boolean({
            description:
                "Pulls just about everything.  Don't use this flag with any other subset of metadata.  Not recommended for really large metadata orgs because it'll overflow stdout",
            exclusive: ['code', 'perms', 'wave', 'schema', 'ui', 'object', 'type', 'reporting']
        })
    };

    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        if (!this.flags.apiversion) {
            this.flags.apiversion = await this.org.retrieveMaxApiVersion();
        }

        fs.ensureDirSync(pkgDir);

        const conn = this.org.getConnection();

        const describeResult = await conn.metadata.describe(this.flags.apiversion);

        const mdTypes = [];
        const requestedTypes = getTypeList(this.flags);
        if (this.flags.type && requestedTypes.includes(this.flags.type)) {
            this.ux.warn(`type ${this.flags.type} is already selected`);
        }
        const all = describeResult.metadataObjects;

        // special case
        if (this.flags.object) {
            mdTypes.push({
                members: this.flags.object,
                name: 'CustomObject'
            });
        }

        for (const item of all) {
            // we actually want that time, OR we said we wanted it all
            if (this.flags.all || requestedTypes.includes(item.xmlName) || this.flags.type === item.xmlName) {
                // this.ux.logJson(item);
                // special cases: objects that don't support *
                if (item.xmlName === 'CustomObject') {
                    mdTypes.push({
                        members: standardObjects.concat(['*']),
                        name: item.xmlName
                    });
                } else if (item.xmlName === 'StandardValueSet') {
                    mdTypes.push({
                        members: StandardValueSets,
                        name: item.xmlName
                    });
                } else if (CrawlDown.includes(item.xmlName)) {
                    for (const childName of item.childXmlNames) {
                        await conn.metadata.list([{ type: childName, folder: null }], this.flags.apiversion);
                        // console.log(parentList);
                        // parentList.forEach( childItem => {
                        //   this.ux.logJson(childItem);
                        // });
                    }
                    // parentList.forEach( thing => this.ux.logJson(thing));
                } else if (item.inFolder) {
                    // get a list of all the folders for this type
                    // this.ux.log(`checking item ${item.xmlName}`);
                    const finalItemList = [];
                    let folderListMetadata = await conn.metadata.list(
                        [{ type: item.xmlName === 'EmailTemplate' ? 'EmailFolder' : `${item.xmlName}Folder`, folder: null }],
                        this.flags.apiversion
                    );

                    if (folderListMetadata) {
                        // correct in case it's single object instead of an array
                        if (!Array.isArray(folderListMetadata)) {
                            folderListMetadata = [folderListMetadata];
                        }

                        for (const folder of folderListMetadata) {
                            finalItemList.push(folder.fullName);

                            // this.ux.log(`looking in folder ${folder.fullName}`);
                            const contents = await conn.metadata.list([{ type: item.xmlName, folder: folder.fullName }], this.flags.apiversion);
                            if (contents && contents.length > 0) {
                                contents.forEach(thing => {
                                    // this.ux.logJson(thing);
                                    finalItemList.push(thing.fullName);
                                });
                            } else {
                                // this.ux.log(`no content for folder ${folder.fullName}`);
                            }
                        }

                        // this.ux.logJson(finalItemList);

                        mdTypes.push({
                            members: finalItemList,
                            name: item.xmlName
                        });
                    }
                } else {
                    mdTypes.push({
                        members: '*',
                        name: item.xmlName
                    });
                }
            }
        }

        // this.ux.logJson(mdTypes);

        // in parallel, build out all the local package.xmls
        this.ux.log('Going to retrieve all the metadata you asked for...this could take a while');

        const retrieveResults = await Promise.all(mdTypes.map(mdType => localFilesystemBuild(mdType, this.flags.apiversion, this.org.getUsername())));
        this.ux.log(
            `Success: ${retrieveResults
                .filter(result => result.status === 'success')
                .map(result => result.type)
                .join(',')}`
        );
        this.ux.log(
            `Failure: ${retrieveResults
                .filter(result => result.status === 'failure')
                .map(result => result.type)
                .join(',')}`
        );

        await fs.remove(pkgDir);
        return retrieveResults;
    }
}

// builds out the package.xml in a folder for each type.
const localFilesystemBuild = async (mdType, apiversion, username) => {
    // create a folder for that type within tmpDir
    const targetFolder = `${pkgDir}/${mdType.name}`;
    await fs.ensureDir(targetFolder);

    const packageJSON = {
        '@': {
            xmlns: 'http://soap.sforce.com/2006/04/metadata'
        },
        types: Array.of({ name: mdType.name, members: mdType.members }),
        version: apiversion
    };

    // create a packagexml for that type
    const xml = jsToXml.parse('Package', packageJSON, options.js2xmlStandardOptions);
    await fs.writeFile(`./${targetFolder}/package.xml`, xml);

    const retrieveCommand = `sfdx force:source:retrieve -x ${targetFolder}/package.xml -w 30 -u ${username} --json`;

    // build in retry logic because of flakiness on .sfdx/stash.json
    let retries = 0;
    while (retries < retryLimit) {
        try {
            await exec(retrieveCommand, { maxBuffer: 1000000 * 1024 });
            return { type: mdType.name, status: 'success' };
        } catch (e) {
            retries++;
        }
    }
    return { type: mdType.name, status: 'failure' };
};

// takes the command flags and builds a list of the types that the user wants
const getTypeList = theFlags => {
    let outputTypes = [];
    Object.keys(booleanFlags).forEach(flag => {
        if (theFlags[flag]) {
            outputTypes = [...outputTypes, ...booleanFlags[flag]];
        }
    });
    return outputTypes;
};
