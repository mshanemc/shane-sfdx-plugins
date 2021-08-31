<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:org:domain:cors

## Description

whitelist the org's domain as a CORS

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|all|boolean|do all of Salesforce, not just this org's custom domain||||
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|liveagent|boolean|whitelist all of LiveAgent urls||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|target<br/>-t|option|where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default|force-app/main/default|||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:org:domain:cors
```


