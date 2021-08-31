<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:mdapi:package:get

## Description

Gets package from an org, converts, and merges it into the local source

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|packagename<br/>-p|option|the name of the package you want to retrieve||||
|target<br/>-t|option|where to convert the result to...defaults to force-app|force-app|||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:mdapi:package:get -p MyPkg -u someOrg
// pulls a package from the org and converts/merges it into force-app

```

```shell
sfdx shane:mdapi:package:get -p MyPkg -u someOrg -t someDir
// pulls a package from the org and converts/merges it into /someDir

```


