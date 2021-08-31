<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:analytics:dataset:upload

## Description

upload a dataset from csv

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|app<br/>-a|option|app name||||
|async|boolean|do not wait for successful completion of the dataset upload...just return and hope for the best.  If omitted, will poll the analytics rest API for job processing status until complete||||
|csvfile<br/>-f|option|local csv file containing the data||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|metajson<br/>-m|option|path to json file for describing your upload (highly recommended)||||
|name<br/>-n|option|dataset name--no spaces, should be like an api name||||
|operation<br/>-o|option|what to do with the dataset if it already exists.  See https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_ext_data.meta/bi_dev_guide_ext_data/bi_ext_data_object_externaldata.htm|Overwrite||Append<br/>Overwrite<br/>Upsert<br/>Delete|
|serial|boolean|chunks are uploaded with no parallelization to prevent locking issues||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|uploadinterval<br/>-d|option|milliseconds between uploaded chunks...increase this if you get strange errors during file uploads like "write EPIPE"|500|||

## Examples

```shell
sfdx shane:analytics:dataset:upload -n someName -f data/myFile.csv -m myMetaFile.json
```

```shell
sfdx shane:analytics:dataset:upload -n someName -f data/myFile.csv -m myMetaFile.json -a SharedApp  --async
```


