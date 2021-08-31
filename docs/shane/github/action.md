<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:github:action

## Description

adds an action to test your repo against https://github.com/mshanemc/deploy-to-sfdx using github actions

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|skipprerel<br/>-r|boolean|omit the pre-release deployer||||
|skipprod<br/>-p|boolean|omit the production deployer||||

## Examples

```shell
sfdx shane:github:action
// tests against both prod and prerel(gs0) deployers

```


