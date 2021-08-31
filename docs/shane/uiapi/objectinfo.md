<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:uiapi:objectinfo

## Description

get a ui api response from the objectinfo endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_object_info.htm

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|object<br/>-o|option|object api name||||
|outputfile|option|local path to save the output to||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:uiapi:objectinfo -o Account --json
    // returns ui-api objectinfo for Account
    
```

```shell
sfdx shane:uiapi:objectinfo -o Account --json --outputfile accountObjectInfo.json
    // returns ui-api objectinfo for Account and saves it to a local file
    
```


