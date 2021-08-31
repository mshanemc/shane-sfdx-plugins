<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:events:stream

## Description



## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|dir<br/>-d|option|stream the events to a folder instead of the console||||
|event<br/>-e|option|the platform event's api name||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|replay<br/>-r|option|replay Id to begin from|-1|||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:events:stream -e SomeEvent__e // subscribe to an event stream
```

```shell
sfdx shane:events:stream -e SomeEvent__e -d myDir // stream events to myDir
```


