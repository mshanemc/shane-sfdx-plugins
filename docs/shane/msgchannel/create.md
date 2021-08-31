<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:msgchannel:create

## Description

create a lightning message channel locally

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|description<br/>-d|option|optional description so you can remember why you added this and what it's for|added from sfdx plugin|||
|exposed<br/>-e|boolean|accessible outside your namespace (this is PERMANENT!)||||
|fields<br/>-f|option|fields to create on the message channel||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|name it (Salesforce API compliant name)||||
|target<br/>-t|option|where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default|force-app/main/default|||

## Examples

```shell
sfdx shane:msgchannel:create -n wkrp -d "it's a message channel, yo" -f Field1,Field2,Field3
// creates a messageChannel with the given name, description, and fields

```


