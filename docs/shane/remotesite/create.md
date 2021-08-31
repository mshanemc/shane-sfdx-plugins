<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:remotesite:create

## Description

create a remote site setting in the local source.  Push it when you're done

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|description<br/>-d|option|optional description so you can remember why you added this and what it's for|added from sfdx plugin|||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|name it (Salesforce API compliant name)||||
|target<br/>-t|option|where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default|force-app/main/default|||
|url<br/>-u|option|url that you want to allow callouts to||||

## Examples

```shell
sfdx shane:remotesite:create -n Test -u https://www.google.com
// create a remote site setting in force-app/main/default

```

```shell
sfdx shane:remotesite:create -n Test -u https://www.google.com -d "my description" -t myOtherDirectory/main/default
// create a remote site setting in myOtherDirectory/main/default with a description

```


