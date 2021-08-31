<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:cdc:stream

## Description



## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|dir<br/>-d|option|stream the events to a folder instead of the console||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|object<br/>-o|option|subscribe to change events for only a single object (api name, including __c)||||
|replay<br/>-r|option|replay Id to begin from|-1|||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:cdc:stream // get all the change events
```

```shell
sfdx shane:cdc:stream -o Account // get all the change events on a single object
```

```shell
sfdx shane:cdc:stream -d myDir // stream change events to myDir/cdc, organized into folders by object api type
```


