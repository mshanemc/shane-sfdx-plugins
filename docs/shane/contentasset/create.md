<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:contentasset:create

## Description

create a ContentAsset from a local image file

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|file<br/>-f|option|the file you want to turn into an asset||||
|json|boolean|format output as json||||
|language<br/>-l|option|language code like en_US|en_US|||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|api name for the contentAsset||||
|target<br/>-t|option|where to find the contentassets folder (will create if it doesn't exist already)|force-app/main/default|||

## Examples

```shell
sfdx shane:contentasset:create -f ~/somefile.jpg -n MyContentAsset
// create a contentAsset called MyContentAsset from the local file

```


