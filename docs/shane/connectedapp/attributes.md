<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:connectedapp:attributes

## Description

Set attributes on a connected app.  Attributes for salesforce mobile app at https://github.com/gabesumner/mobile-security/blob/master/customAttributes.json

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|attributes<br/>-a|option|json formatted file of key/values||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|name of the connected app||||
|showbrowser<br/>-b|boolean|show the browser...useful for local debugging||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:connectedapp:attributes -n AppAPIName -a attributes.json
```


