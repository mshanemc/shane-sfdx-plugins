<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:ai:playground:setup

## Description

upload .pem file from local encrypted copy, setup username and secret key in custom setting

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|email<br/>-e|option|email address you used when you signed up for your einstein.ai account.  Defaults to EINSTEIN_EMAIL from the environment||||
|file<br/>-f|option|encrypted file from local filesystem||||
|json|boolean|format output as json||||
|key<br/>-k|option|encoding key used to encrypt/decrypt the file.  Defaults to AI_PLAYGROUND_SETUP_KEY from the environment||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:ai:playground:setup -f my.pem -e shane.mclaughlin@salesforce.com -k yay9HVn68GzXrqhT0HWkoQ==
```


