<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:label:add

## Description

create a remote site setting in the local source.  Push it when you're done

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|bundle|option|label bundle when you want to organize them more|CustomLabels|||
|categories|option|categories to add to your custom label||||
|description<br/>-d|option|description for your label||||
|json|boolean|format output as json||||
|language<br/>-l|option|language code|en_US|||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|api name for your label||||
|protected|boolean|mark as protected (packaged, subscribers cannot change the label||||
|target<br/>-t|option|where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default|force-app/main/default|||
|text<br/>-t|option|the text you want to turn into a label||||

## Examples

```shell
sfdx shane:label:add -t "This is some Text"
// create a custom label with the displayed text and all the defaults

```


