<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# streaming:pushtopic:update

## Description

Update push topics

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|description<br/>-d|option|add a description to the push topic||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|name for the push topic||||
|notifyforfields<br/>-f|option|Specifies which fields are evaluated to generate a notification|||All<br/>Referenced<br/>Select<br/>Where|
|operations<br/>-o|option|which operations should produce a notification||||
|query<br/>-q|option|The SOQL query statement that determines which record changes trigger events to be sent to the channel.||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx streaming:pushtopic:update -n myTopic -q "select Id,Name from account"
    // modifies the push topic
    
```

```shell
sfdx streaming:pushtopic:update -n myTopic -q "select Id from account" -f All -o create,update
    // modifies the push topic and sets operations and watches all fields
    
```


