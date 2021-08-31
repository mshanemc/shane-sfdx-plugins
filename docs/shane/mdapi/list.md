<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:mdapi:list

## Description

what's in the org?

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|type<br/>-t|option|pull only a specific type.  See the metadata api docs for type names||||

## Examples

```shell
sfdx shane:mdapi:list -u someOrg -t CustomObject
// what metadata exists for a specific type

```


