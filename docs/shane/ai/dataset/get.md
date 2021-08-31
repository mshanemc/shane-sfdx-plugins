<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:ai:dataset:get

## Description

get an access token from an email and a .pem file, either passed in or from environment variables

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|dataset<br/>-n|option|dataset id||||
|email<br/>-e|option|email address you used when you signed up for your einstein.ai account||||
|json|boolean|format output as json||||
|language<br/>-l|boolean|use the language endpoint instead of vision||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|poll<br/>-p|boolean|poll for the status to be completed||||

## Examples

```shell
sfdx shane:ai:dataset:get -n 57
```


