<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:uiapi:recordui

## Description

get a ui api response from the record-ui endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_record_ui.htm

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|layouttypes<br/>-l|option|which layout (Compact, Full or both)||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|modes<br/>-m|option|which mode (Create, Edit, View, or combo)||||
|outputfile|option|local path to save the output to||||
|recordid<br/>-r|option|single recordId to generate the data/metadata||||
|recordids|option|array of recordIds to generate the data/metadata||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:uiapi:recordui -r 001R0000003I6CoIAK --json
// default ui-api response for a single recordId

```


