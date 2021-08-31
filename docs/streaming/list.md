<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# streaming:list

## Description

What kinds of things can I subscribe to?

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|types<br/>-t|option|optional specify which types to query|cdc,event,topic|||

## Examples

```shell
sfdx streaming:list // list everything
```

```shell
sfdx streaming:list -t cdc,topic // list CDC and PushTopic but not standard and custom PlatformEvents 
```


