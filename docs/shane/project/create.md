<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:project:create

## Description

creates an sfdx project

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|gitremote<br/>-g|option|full github url for the remote...overrides the default generated from git config user.name and project name||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|name and path for the project||||
|targetdevhubusername<br/>-v|option|username or alias for the dev hub org; overrides default dev hub org||||

## Examples

```shell
sfdx shane:project:create -n myProject
// create a project in the folder with all the default structure

```


