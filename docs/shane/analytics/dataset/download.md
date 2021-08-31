<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:analytics:dataset:download

## Description

download a dataset as csv

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|batchsize<br/>-b|option|maximum batchsize. Splits query in parts of this size.|1000000000|||
|id<br/>-i|option|dataset id||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|dataset name||||
|offset<br/>-o|option|offset for rows||||
|rows<br/>-r|option|how many rows?|1000000000|||
|target<br/>-t|option|where you want to save the file|.|||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|versionid|option|specify a version||||

## Examples

```shell
sfdx shane:analytics:dataset:download -n YourDataSetName -t myLocalFolder
```

```shell
sfdx shane:analytics:dataset:download -i 0Fb6A000000gDFxSAM --versionid 0Fc6A000002d8GwSAI -t myLocalFolder -r 10000 -b 5000
```


