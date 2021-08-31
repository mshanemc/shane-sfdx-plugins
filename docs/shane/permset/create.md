<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:permset:create

## Description

create or add stuff to a permset with maximum access

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|application<br/>-a|option|API name of an application to add perms for.  If blank, then you mean all the applications||||
|checkpermissionable<br/>-c|boolean|some fields' permissions can't be deducted from metadata, use describe on org to check if field is permissionable||||
|directory<br/>-d|option|Where is all this metadata? defaults to force-app/main/default|force-app/main/default|||
|field<br/>-f|option|API name of an field to add perms for.  Required --object If blank, then you mean all the fields||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|path to existing permset.  If it exists, new perms will be added to it.  If not, then it'll be created for you||||
|object<br/>-o|option|API name of an object to add perms for.  If blank, then you mean ALL the objects and ALL their fields and ALL their tabs||||
|recordtype<br/>-r|option|API name of a record type to add perms for.  Required --object If blank, then you mean all the record types||||
|tab<br/>-t|boolean|also add the tab for the specified object (or all objects if there is no specified objects)||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|verbose|boolean|emit additional command output to stdout||||

## Examples

```shell
sfdx shane:permset:create -n MyPermSet1 -o Something__c -f Some_Field__c
    // create a permset in force-app/main/default for the object/field.  If MyPermSet1 doesn't exist, it will be created.
    
```

```shell
sfdx shane:permset:create -n MyPermSet1 -o Something__c
    // create a permset in force-app/main/default for every field on Something__c.
    
```

```shell
sfdx shane:permset:create -n MyPermSet1
    // create a permset in force-app/main/default for every field on every object!
    
```

```shell
sfdx shane:permset:create -n MyPermSet1 -t
    // create a permset in force-app/main/default for every field on every object.  If there's a tab for any of those objects, add that tab to the permset, too
    
```

```shell
sfdx shane:permset:create -n MyPermSet1 -c
    // create a permset in force-app/main/default for every field on every object, checking on org that all fields are permissionable
    
```


