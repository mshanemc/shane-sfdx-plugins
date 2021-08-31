<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:permset:check

## Description

who has access to what

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|field<br/>-f|option|what field to check||||
|fieldlevel|option|what level of perms are you looking for|Read||Read<br/>Edit|
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|object<br/>-o|option|what object to check perms on||||
|objectlevel|option|what level of perms are you looking for|Read||Read<br/>Edit<br/>Create<br/>Delete<br/>ViewAll<br/>ModifyAll|
|permsets|boolean|return names/ids of permission sets||||
|profiles|boolean|return names/ids of profiles||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|users|boolean|return names/ids of users with those profiles and/or permission sets||||

## Examples

```shell
sfdx shane:permset:check -o Project__c --profiles --permsets
    // list the profiles and permsets that have Read access to the object
    
```

```shell
sfdx shane:permset:check -o Project__c -f Due_Date__c --fieldlevel Edit --profiles --permsets
    // list the profiles and permsets that have Edit access to the field on the object
    
```

```shell
sfdx shane:permset:check -o Project__c -f Due_Date__c --users
    // list the users that have Read access to the field on the object, and the profile/permset(s) that are granting it
    
```


