<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:data:file:upload

## Description

upload a file from local resources, optionally as a chatter post or attached file on a record

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|chatter<br/>-c|boolean|attach as a chatter content post instead of just as a file||||
|file<br/>-f|option|path to file on local filesystem||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|set the name of the uploaded file||||
|parentid<br/>-p|option|optional record ID that the file should be attached to||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:data:file:upload -f ~/Downloads/King.png
    //uploads file from local filesystem as a file
    
```

```shell
sfdx shane:data:file:upload -f ~/Downloads/King.png -p 0011900000VkJgrAAF
    //uploads file from local filesystem as a file and attaches to a record
    
```

```shell
sfdx shane:data:file:upload -f ~/Downloads/King.png -p 0011900000VkJgrAAF -c
    //uploads and attaches it to the indicated record, but as a chatter file post
    
```

```shell
sfdx shane:data:file:upload -f ~/Downloads/King.png -p 0011900000VkJgrAAF -n CustomName -c
    //uploads and attaches it to the indicated record, but as a chatter file post with a name that's not the same name as the local filesystem used
    
```


