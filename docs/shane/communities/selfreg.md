<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:communities:selfreg

## Description

set the self-registration account for a community

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|account<br/>-a|option|Name of the account.  Wrap in quotes if there are spaces or weird characters||||
|apiversion|option|override the api version used for api requests made by this command||||
|community<br/>-c|option|name of the community.  Wrap in quotes if there are spaces or weird characters||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:communities:selfreg -a Salesforce -c "Trailblazer Community"
```


