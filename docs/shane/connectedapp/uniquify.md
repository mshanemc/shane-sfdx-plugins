<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:connectedapp:uniquify

## Description

modify a clientId/consumerKey on a local connected app to guaranatee uniqueness

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|app<br/>-a|option|full path to your connected app locally||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|prefix<br/>-p|option|add a prefix to the connected app's consumerKey||||

## Examples

```shell
sfdx shane:connectedapp:uniquify -a force-app/main/default/connectedApps/myConnectedApp.connectedApp-meta.xml -p 5h4n3
// update the consumerKey of myConnectedApp to be unique, but start with 5h4n3

```


