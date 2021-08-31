<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:org:refreshtoken

## Description

Outputs a refresh token from an org that you've already authenticated sfdx to.  PLEASE BE CAREFUL WITH THIS AND TREAT IT AS A PASSWORD

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:org:refreshtoken -u someAliasOrUsername
// prints the refresh token for some org that you've already connected to

```


