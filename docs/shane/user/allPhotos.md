<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:user:allPhotos

## Description

set the chatter photos of anyone who has not set theirs already to encourage them to do so

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|folder<br/>-f|option|optional local folder of photos.  Overrides --repo||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|repo<br/>-r|option|optional alternate repo of photos, which contains a folder of photos named /img|https://github.com/mshanemc/badProfilePhotos|||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:user:allphotos -u someAlias
```


