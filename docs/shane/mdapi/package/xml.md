<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:mdapi:package:xml

## Description

gets metadata form an org based on a local package.xml, converts, and merges it into the local source

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|target<br/>-t|option|where to convert the result to...defaults to force-app|force-app|||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|xmlpath<br/>-p|option|the location of the package.xml you want to use||||

## Examples

```shell
sfdx shane:mdapi:package:xml -p someFolder/package.xml -u someOrg
// pulls a metadat from the org and converts/merges it into force-app

```

```shell
sfdx shane:mdapi:package:xml -p someFolder/package.xml -u someOrg -t someDir
// pulls a package from the org and converts/merges it into /someDir

```


