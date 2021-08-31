<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:data:tree:import

## Description

similar to the original tree:import, but handles more than 200 records at a go, while still preserving relationships.  Takes longer.

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|filesfolder<br/>-d|option|folder that the plan lives in||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|plan<br/>-p|option|location of plan file||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:data:tree:import -p data/myPlan.json -d data/  // run all the data in the plan, and files mentioned are relative to ./data
```


