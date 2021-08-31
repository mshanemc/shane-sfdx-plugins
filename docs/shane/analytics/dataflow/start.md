<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:analytics:dataflow:start

## Description

start an analytics dataflow by name/label/id

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|id<br/>-i|option|the id of the dataflow||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|name or label of the analytics app (will match either)||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:analytics:dataflow:start -n MyDataFlowName
// enqueue a job for the the analytics dataflow with name/label MyDataFlowName (will not wait for completion of the dataflow)

```


