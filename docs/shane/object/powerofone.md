<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:object:powerofone

## Description

add a "power of one" formula field to any object

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|api<br/>-a|option|api name (will include the __c for you if you don't add it here|Power_Of_One__c|||
|description<br/>-d|option|optional description so you can remember why you added this and what it's for|Power of one is used for formulas, reporting, etc|||
|json|boolean|format output as json||||
|label<br/>-l|option|label|Power Of One|||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|object<br/>-o|option|API name of the object to add the field to||||
|target<br/>-t|option|where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default|force-app/main/default|||

## Examples

```shell
sfdx shane:object:powerofone -a Poo -l "Power of One" -o User
// create a field with api name Poo__c and label "Power of One" on the user object with the default description in the default folder

```


