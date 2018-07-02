import { flags } from '@oclif/command';
import { SfdxCommand, core } from '@salesforce/command';
import fs = require('fs-extra');
import util = require('util');

import jsToXml = require('js2xmlparser');
import * as options from '../../../shared/js2xmlStandardOptions';

const code = ['ApexClass', 'ApexTrigger', 'ApexComponent', 'ApexPage', 'AuraDefinitionBundle', 'StaticResource'];
const perms = ['PermissionSet', 'Profile', 'Role', 'CustomPermission', 'Group'];
const schema = ['ExternalDataSource', 'CustomMetadata', 'RecordType', 'GlobalValueSet', 'CustomField', 'CustomObject'];
const standardObjects = ['Account', 'AccountContactRelation', 'AccountContactRole', 'Activity', 'Asset', 'AssistantProgress', 'Campaign', 'CampaignMember', 'Case', 'CaseContactRole', 'Contact', 'ContentVersion', 'Contract', 'ContractContactRole', 'DuplicateRecordItem', 'DuplicateRecordSet', 'EmailMessage', 'Event', 'ExchangeUserMapping', 'FeedItem', 'Idea', 'Lead', 'LinkedArticle', 'Macro', 'MacroAction', 'MacroInstruction', 'Opportunity', 'OpportunityCompetitor', 'OpportunityContactRole', 'OpportunityLineItem', 'Order', 'OrderItem', 'PartnerRole', 'Pricebook2', 'PricebookEntry', 'Product2', 'ProfileSkill', 'ProfileSkillEndorsement', 'ProfileSkillUser', 'Quote', 'QuoteLineItem', 'Site', 'SocialPersona', 'Solution', 'StreamingChannel', 'Task', 'Territory', 'User', 'WorkBadge', 'WorkBadgeDefinition', 'WorkThanks'];
const ui = ['CompactLayout', 'Layout', 'ListView', 'CustomTab', 'AppMenu', 'CustomApplication', 'CustomPageWebLink', 'HomePageComponent', 'HomePageLayout', 'PathAssistant', 'WebLink', 'CustomLabels'];
const all = ['AccountCriteriaBasedSharingRule', 'AccountOwnerSharingRule', 'AnalyticSnapshot', 'ApexClass', 'ApexComponent', 'ApexPage', 'ApexTrigger', 'ApprovalProcess', 'AppMenu', 'AssignmentRules', 'AuraDefinitionBundle', 'AuthProvider', 'AutoResponseRules', 'Certificate', 'CleanDataService', 'Community', 'CompactLayout', 'CustomApplication', 'CustomApplicationComponent', 'CustomField', 'CustomLabels', 'CustomObject', 'CustomMetadata', 'CustomObjectTranslation', 'CustomPageWebLink', 'CustomPermission', 'CustomSite', 'CustomTab', 'DelegateGroup', 'DuplicateRule', 'EscalationRules', 'ExternalDataSource', 'Flow', 'FlowDefinition', 'GlobalValueSet', 'GlobalValueSetTranslation', 'Group', 'HomePageComponent', 'HomePageLayout', 'Layout', 'Letterhead', 'ListView', 'ManagedTopics', 'MatchingRule', 'MatchingRules', 'Network', 'PathAssistant', 'PermissionSet', 'Profile', 'Queue', 'QuickAction', 'RecordType', 'RemoteSiteSetting', 'ReportType', 'Role', 'SharingRules', 'SharingCriteriaRule', 'SharingOwnerRule', 'SharingTerritoryRule', 'SiteDotCom', 'StandardValueSetTranslation', 'StaticResource', 'Territory', 'Translations', 'ValidationRule', 'WebLink', 'Workflow', 'WorkflowAlert', 'WorkflowFieldUpdate', 'WorkflowRule', 'Settings'];

import child_process = require('child_process');

const exec = util.promisify(child_process.exec);

const tmpDir = 'mdapiout';
const pkgDir = 'pkgDirTemp';

export default class Pull extends SfdxCommand {

  public static description = 'gets unpackaged metadata for you';

  public static examples = [
`sfdx shane:mdapi:pull -c -u someOrg
// pulls code kinda stuff from the org and converts/merges it into force-app
`,
`sfdx shane:mdapi:pull -t ExternalDataSource -u someOrg
// pulls all the external data source metadata from the org and converts/merges it into force-app
`
  ];

  protected static requiresUsername = true;

  protected static flagsConfig = {
    code: flags.boolean({ char: 'c', description: 'Pull apex, VF, Lightning Components, triggers, static resources' }),
    perms: flags.boolean({ char: 'p', description: 'Pull profiles, permsets, roles, groups, customPermissions' }),
    schema: flags.boolean({ char: 's', description: 'Pull objects, fields, list views, recordtypes, valueSets, custom Metadata' }),
    ui: flags.boolean({ char: 'i', description: 'Pull page layouts, tabs, compact layouts, apps, tabs, more' }),
    object: flags.string({ char: 'o', description: 'pull metadata for a single object'}),
    type: flags.string({char: 't', description: 'pull only a specific type.  See the metadata api docs for type names'}),
    // TODO: automation, security, reporting, i18n
    all: flags.boolean({ description: 'Pulls just about everything.  Don\'t use this flag with any other subset of metadata.  Not recommended for really large metatadat orgs because it\'ll overflow stdout'}),
    target: flags.string({ char: 't', default: 'force-app', description: 'where to convert the result to...defaults to force-app' })
  };

  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any

    fs.ensureDirSync(this.flags.target);
    fs.ensureDirSync(pkgDir);

    // validations
    if (this.flags.schema && this.flags.object) {
      this.ux.error('you can\'t choose a single object AND schema');
    }

    if (this.flags.type && this.flags.code && code.includes(this.flags.type)) {
      this.ux.error(`type ${this.flags.type} is already included in --code`);
    }

    if (this.flags.type && this.flags.ui && ui.includes(this.flags.type)) {
      this.ux.error(`type ${this.flags.type} is already included in --ui`);
    }

    if (this.flags.type && this.flags.schema && schema.includes(this.flags.type)) {
      this.ux.error(`type ${this.flags.type} is already included in --schema`);
    }

    if (this.flags.type && this.flags.perms && perms.includes(this.flags.type)) {
      this.ux.error(`type ${this.flags.type} is already included in --perms`);
    }

    const packageJSON = {
      '@': {
        xmlns: 'http://soap.sforce.com/2006/04/metadata'
      },
      'types': [],
      'version': this.org.retrieveMaxApiVersion()
    };

    if (this.flags.all) {
      all.forEach((item) => {
        if (item === 'CustomObject') {
          packageJSON.types.push({
            members: standardObjects.concat(['*']),
            name: item
          });
        } else {
          packageJSON.types.push({
            members: '*',
            name: item
          });
        }
      });
    } else {

      // things that can be used in combination
      if (this.flags.object) {
        packageJSON.types.push({
          members: this.flags.object,
          name: 'CustomObject'
        });
      }

      if (this.flags.type) {
        packageJSON.types.push({
          members: '*',
          name: this.flags.type
        });
      }

      if (this.flags.schema) {
        schema.forEach( (item) => {
          packageJSON.types.push({
            members: '*',
            name: item
          });
        });
      }

      if (this.flags.ui) {
        ui.forEach((item) => {
          packageJSON.types.push({
            members: '*',
            name: item
          });
        });
      }

      if (this.flags.perms) {
        perms.forEach((item) => {
          packageJSON.types.push({
            members: '*',
            name: item
          });
        });
      }

      if (this.flags.code) {
        code.forEach((item) => {
          packageJSON.types.push({
            members: '*',
            name: item
          });
        });
      }
    }

    // this.ux.logJson(packageJSON);

    const xml = jsToXml.parse('Package', packageJSON, options.js2xmlStandardOptions);
    fs.writeFileSync(`./${pkgDir}/package.xml`, xml);

    process.stdout.write('Starting retrieval...');

    const retrieveResult = await exec(`sfdx force:mdapi:retrieve -s -k ${pkgDir}/package.xml -r ./${tmpDir} -w 30 -u ${this.org.getUsername()}`, { maxBuffer: 1000000 * 1024 });

    if (retrieveResult.stderr) {
      this.ux.error(retrieveResult.stderr);
      return;
    }

    await exec(`rm -rf ./${pkgDir}`);
    process.stdout.write('done.  Unzipping...');

    const unzipResult = await exec(`unzip -qqo ./${tmpDir}/unpackaged.zip -d ./${tmpDir}`);
    process.stdout.write('done.  Converting...');

    try {
      const convertResult = await exec(`sfdx force:mdapi:convert -r ./${tmpDir} -d ${this.flags.target} --json`);
      process.stdout.write(`done (converted ${JSON.parse(convertResult.stdout).result.length} items).  Cleaning up...`);
    } catch (err) {
      this.ux.errorJson(err);
      this.ux.error('Error from conversion--it may have been too much metadata');
    }

    await exec(`rm -rf ./${tmpDir}`);
    process.stdout.write('Done!\n');

  }
}
