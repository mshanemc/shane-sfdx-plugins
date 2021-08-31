<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:object:unperm

## Description

remove references to an object from profiles/permsets (all or a specific one)

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|directory<br/>-d|option|Where is all this metadata? defaults to force-app/main/default|force-app/main/default|||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|object<br/>-o|option|remove all references to an object from profiles or permsets||||
|specific<br/>-s|option|specify a profile or permset by name to only remove it from that one||||

## Examples

```shell
sfdx shane:object:unperm -o OpportunitySplit
// go through all the profiles/permsets in force-app/main/default and remove the object, field, recordtypes and layout assignments (profile only) for the named object

```


