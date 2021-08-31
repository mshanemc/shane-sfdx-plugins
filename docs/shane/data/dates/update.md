<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:data:dates:update

## Description

go through a folder of csv files and modify all the dates relative to a given date

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|datafolder<br/>-d|option|Where is all this data?|data|||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|outputfolder<br/>-o|option|where to output the modified CSV files|data-modified|||
|relative<br/>-r|option|the date to adjust all other dates relative to.  example: if "relative" is 8 days ago, then all dates are moved forward 8 days||||

## Examples

```shell
sfdx shane:data:dates:update -r 1-1-2020
// move all dates in .csv files in /data by the difference between now and 1-1-2020

```


