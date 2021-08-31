<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:analytics:app:share

## Description

share an analytics app by name

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|allcsp|boolean|share with all customer portal users||||
|allprm|boolean|share with all partner users||||
|apiversion|option|override the api version used for api requests made by this command||||
|community<br/>-c|boolean|enable community sharing||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|name of the analytics app||||
|org|boolean|share with all internal users||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|type<br/>-t|option|access level|View||View<br/>Edit<br/>Manage|

## Examples

```shell
sfdx shane:analytics:app:share -n SharedApp --allprm -c
// share the standard SharedApp with all partners view level perms (default) and check the "enable sharing with communities" box for this app

```


