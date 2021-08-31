<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:user:lightning:debug

## Description

set the user to debug mode

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|firstname<br/>-g|option|first (given) name of the user--keeping -f for file for consistency||||
|json|boolean|format output as json||||
|lastname<br/>-l|option|last name of the user||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:user:lightning:debug
    // puts the default user in lightning debug mode
    
```

```shell
sfdx shane:user:lightning:debug -g Sarah -l McLaughlin
    // puts the named user in lightning debug mode
    
```


