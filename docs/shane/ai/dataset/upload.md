<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:ai:dataset:upload

## Description

upload a dataset

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|email<br/>-e|option|email address you used when you signed up for your einstein.ai account||||
|file<br/>-f|option|Path to the .zip (image) or .csv/.tsv/.json (language) file on the local drive (FilePart). The maximum file size you can upload from a local drive is 50 MB for images, 25 MB for text||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|Name of the dataset. Optional. If this parameter is omitted, the dataset name is derived from the .zip file name. ||||
|path<br/>-p|option|URL of the .zip (image) or .csv/.tsv/.json (language) file. The maximum file size you can upload from a web location is 2 GB (images), 25MB (text) ||||
|train|boolean|train a model on the dataset||||
|type<br/>-t|option|Type of dataset data. Valid values are:|image||image<br/>image-detection<br/>image-multi-label<br/>text-intent<br/>text-sentiment|
|verbose|boolean|emit additional command output to stdout||||
|wait<br/>-w|option|how long to wait for this to process (minutes)|10|||

## Examples

```shell
sfdx shane:ai:dataset:upload -e shane.mclaughlin@salesforce.com -f ~/myPics.zip -n AwesomeDataset 
```


