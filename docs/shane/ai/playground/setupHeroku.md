<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:ai:playground:setupHeroku

## Description

provisions a new einstein.ai account and sets up the org

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|app<br/>-a|option|name of the heroku app that we attach add-ons to||||
|create<br/>-c|boolean|create the app||||
|json|boolean|format output as json||||
|keepauth<br/>-k|boolean|save the refresh token for einstein.ai to the local sfdx store for future cli use||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|verbose|boolean|emit additional command output to stdout||||

## Examples

```shell
sfdx shane:ai:playground:herokuSetup -a my-existing-app
    // creates addons to existing app
    
```

```shell
sfdx shane:ai:playground:herokuSetup -c
    // creates an app with whatever name heroku feels like
    
```

```shell
sfdx shane:ai:playground:herokuSetup -a non-existing-app -c
    // creates a new app with the name of your choice (usually build dynamically!)
    
```


