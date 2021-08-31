<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:object:recordtype

## Description

create a new record type for an object

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|description<br/>-d|option|optional description so you can remember why you added this and what it's for|Created by shane:sfdx:plugins|||
|json|boolean|format output as json||||
|label<br/>-l|option|label|Power Of One|||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|Name for the record Type (defaults to label if not provided)||||
|object<br/>-o|option|API name of the object to add the record type to||||
|target<br/>-t|option|where to create the file...defaults to force-app/main/default|force-app/main/default|||

## Examples

```shell
sfdx shane:object:recordtype -o Something__c -l 'MyRecordType'
// create a recordtype named MyRecordType and label MyRecordType on the Something__c object with the default description in the default folder

```


