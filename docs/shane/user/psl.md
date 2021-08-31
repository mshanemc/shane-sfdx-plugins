<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:user:psl

## Description

Assign a permset license already in an org for a user

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|firstname<br/>-g|option|first (given) name of the user--keeping -f for file for consistency||||
|json|boolean|format output as json||||
|lastname<br/>-l|option|last name of the user||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|developer name or label of the PermSetLicense||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:user:psl -n SomePSL -g User -l User
// assign the PSL named 'somePSL' for the user named User User

```


