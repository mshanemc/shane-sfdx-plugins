<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:profile:convert

## Description

convert a profile into a permset

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|directory<br/>-d|option|Where is all this metadata? defaults to force-app/main/default|force-app/main/default|||
|editprofile<br/>-e|boolean|remove metadata from original profile||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|path to existing permset.  If it exists, new perms will be added to it.  If not, then it'll be created for you||||
|profile<br/>-p|option|API name of an profile to convert.  If blank, then you mean ALL the objects and ALL their fields and ALL their tabs||||
|skinnyclone<br/>-c|boolean|create a new profile that's the original profile less permset (does not modify original profile)||||

## Examples

```shell
sfdx shane:profile:convert -p Admin -n MyNewPermSet -e
// create a permset in force-app/main/default from the Admin profile (profiles/Admin).  If MyNewPermSet doesn't exist, it will be created.  Content is removed from Admin profile (-e)

```

```shell
sfdx shane:profile:convert -p Admin -n MyNewPermSet -c
// create a permset in force-app/main/default from the Admin profile (profiles/Admin).  If MyNewPermSet doesn't exist, it will be created.  Leaves the original Admin profile and creates an Admin_Skinny profile that has everything in the permset removed (-c)

```


