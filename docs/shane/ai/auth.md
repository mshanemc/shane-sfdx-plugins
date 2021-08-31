<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:ai:auth

## Description

get an access token from an email and a .pem file, either passed in or from environment variables

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|certfile<br/>-f|option|path to your private key from when you signed up||||
|email<br/>-e|option|email address you used when you signed up for your einstein.ai account||||
|json|boolean|format output as json||||
|level<br/>-l|option|where to store this config|local||local<br/>global|
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|tokentime<br/>-t|option|time in minutes that you want your token to be valid for|1440|||

## Examples

```shell
sfdx shane:ai:auth -e shane.mclaughlin@salesforce.com -f ~/code/certs/einstein_platform.pem
    // reauths, and takes what it can get
    
```


