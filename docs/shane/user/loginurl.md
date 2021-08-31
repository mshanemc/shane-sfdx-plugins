<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:user:loginurl

## Description

generate a long-lived shareable login url for the org

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|starturl<br/>-p|option|url to open||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:user:loginurl
    // generates a url including un and pw query strings to simplify logging into the scratch org
    
```

```shell
sfdx shane:user:loginurl -p /lightning/setup/ObjectManager/home
    // same, but sets the start url to ObjectManager
    
```


