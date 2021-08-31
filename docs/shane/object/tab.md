<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:object:tab

## Description

create a tab from a custom object, and you have to pick an icon

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|icon<br/>-i|option|icon number from https://lightningdesignsystem.com/icons/#custom but only up to 100||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|object<br/>-o|option|object api name||||
|target<br/>-t|option|where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default|force-app/main/default|||

## Examples

```shell
sfdx shane:object:tab -o SomeObject__c -i 86
// create a tab for the object using icon #86 from https://lightningdesignsystem.com/icons/#custom

```


