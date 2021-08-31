<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# streaming:subscribe

## Description



## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|name of the topic/event/dataEvent||||
|replay<br/>-r|option|replay Id to begin from|-1|||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|type<br/>-t|option|the type of thing you want to subscribe to|event||event<br/>topic<br/>cdc|

## Examples

```shell
sfdx streaming:subscribe -t cdc -n ChangeEvents   // subscribe to all CDC 
```

```shell
sfdx streaming:subscribe -t cdc -n AccountChangeEvent   // subscribe to cdc for a standard object 
```

```shell
sfdx streaming:subscribe -t event -n Something__e   // subscribe to platform event 
```

```shell
sfdx streaming:subscribe -t event -n Something__e -r 6744   // subscribe to platform event with a replay ID 
```

```shell
sfdx streaming:subscribe -t topic -n myTopic   // subscribe to a push topic
```


