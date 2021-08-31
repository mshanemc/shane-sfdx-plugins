<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:iot:activation

## Description

Activate an iot orchestration by name

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|deactivate<br/>-d|boolean|deactivate the orchestration||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|API name of the orchestration||||
|reset<br/>-r|boolean|reset all instances of the orchestration||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:iot:activate -n orchName -r
// activates the orchestration, including the context if necessary, optionally resetting all the instances

```

```shell
sfdx shane:iot:activate -n orchName -d
// deactivates the orchestration, without resetting all the instances

```


