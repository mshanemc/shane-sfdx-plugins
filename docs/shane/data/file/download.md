<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:data:file:download

## Description

save a file from the org to the local filesystem

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|directory<br/>-o|option|optional output path to save the file, if omitted will save to current directory, if directory then it will keep the filename and save into that directory|.|||
|filename<br/>-f|option|optional filename.  Defaults to the filename of the contentVersion to download||||
|id<br/>-i|option|optional ContentDocument ID or ContentVersion ID that should be downloaded||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|name of the file in Salesforce that you want to download||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:data:file:download -i 0691k000000MXfkAAG -o ./files/
    // save a ContentDocument from the org to the files directory, keeping the existing filename
```

```shell
sfdx shane:data:file:download -i 0691k000000MXfkAAG -o ./files/King.jpg
    // save a ContentDocument from the org to files/King.jpg
```

```shell
sfdx shane:data:file:download -i 0691k000000MXfkAAG
    // save a ContentDocument from the org to the current working directory, keeping the existing filename
```

```shell
sfdx shane:data:file:download -i 0681k000000MXfkAAG -o ./files/King.jpg
    // save a ContentVersion from the org to files/King.jpg
```

```shell
sfdx shane:data:file:download -n King
    // go find the file named kind and download the latest version of it.
```


