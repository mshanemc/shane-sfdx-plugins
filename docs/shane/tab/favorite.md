<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:tab:favorite

## Description

favorite a tab

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-l|option|the label you want to appear in the favorites menu||||
|start|boolean|add the favorite at the beginning of the menu||||
|target<br/>-t|option|API name of the tab you want to favorite||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:tab:favorite -t Tab_API_Name'"
// creates a favorite

```

```shell
sfdx shane:tab:favorite -t someNamespace__Tab_API_Name'"
// creates a favorite for a tab in a namespace

```


