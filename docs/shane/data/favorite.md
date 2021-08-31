<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:data:favorite

## Description

query records and set the match as a favorite

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-l|option|the label you want to appear in the favorites menu||||
|object<br/>-o|option|object API name (including __c if custom)||||
|start|boolean|add the favorite at the beginning of the menu||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|where<br/>-w|option|SOQL where clause to match a single record||||

## Examples

```shell
sfdx shane:data:favorite -o Account -w "name='Salesforce.com'"
// finds the matching record and adds it to the end of the favorites menu

```


