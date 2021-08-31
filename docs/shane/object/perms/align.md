<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:object:perms:align

## Description

align profiles with 

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|directory<br/>-d|option|Where is all this metadata?|force-app/main/default|||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|

## Examples

```shell
sfdx shane:object:perms:align
// go through all the profiles/permsets in force-app/main/default and remove references to stuff that isn't in local source

```


