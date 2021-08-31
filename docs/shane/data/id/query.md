<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:data:id:query

## Description

query some object and get back the id of the matching record

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|object<br/>-o|option|object||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|where<br/>-w|option|SOQL where clause for your query||||

## Examples

```shell
sfdx shane:data:id:query -o User -u platformers -w "Firstname = 'Shane' and Lastname = 'McLaughlin' and username = 'shane@platformers.org'"'
    // returns the id of the user. Use these ids between `` in other commands
    
```


