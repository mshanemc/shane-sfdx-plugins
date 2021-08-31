<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:user:permset:assign

## Description

Assign a permset to a user by first/last name, or just the default user.  Does not error if permset is already assigned

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|firstname<br/>-g|option|first (given) name of the user--keeping -f for file for consistency||||
|json|boolean|format output as json||||
|lastname<br/>-l|option|last name of the user||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|the value of the permset name or label field||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:user:permset:assign -n thePermSet -g User -l User
```


