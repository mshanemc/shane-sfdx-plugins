<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:org:reauth

## Description

reauthenticates (generates a new authinfo) for a scratch org, optionally insisting on custom domain being ready.  Requires a hub

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|requirecustomdomain<br/>-r|boolean|keep trying until you get back an org with a custom domain on it||||
|targetdevhubusername<br/>-v|option|username or alias for the dev hub org; overrides default dev hub org||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:org:reauth
    // reauths, and takes what it can get
    
```

```shell
sfdx shane:org:reauth --requirecustomdomain
    // will try each minute, up to 60 minutes, until an org with a valid mydomain is ready
    
```


