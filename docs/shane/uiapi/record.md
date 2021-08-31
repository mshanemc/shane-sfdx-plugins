<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:uiapi:record

## Description

get a ui api response from the getrecord endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_record_get.htm

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|fields<br/>-f|option|fields to return.  Specify with the object API name, like Account.Name, Account.Phone, etc.  If not visible to the running user, an error is thrown||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|optionalfields|option|optional fields to return.  If not visible to the running user, the field is just omitted||||
|outputfile|option|local path to save the output to||||
|recordid<br/>-r|option|single recordId to generate the data/metadata||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:uiapi:record -r 001R0000003I6CoIAK -f Account.Name --optionalfields Account.AnnualRevenue,AccountAccount.Number --json
// default ui-api response for a getrecord.

```


