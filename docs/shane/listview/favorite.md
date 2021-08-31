<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:listview:favorite

## Description

favorite a listview

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-l|option|the label you want to appear in the favorites menu||||
|object<br/>-o|option|object API name (including __c if custom)||||
|start|boolean|add the favorite at the beginning of the menu||||
|target<br/>-t|option|API name of the list view you want to favorite||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:listview:favorite -o Account -t Awesome_Accounts
// finds the matching listview and adds it to the end of the favorites menu

```


