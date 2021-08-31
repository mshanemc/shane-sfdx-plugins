<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:object:create

## Description

create an object in local source.  Only __c (limited support), __b (big objects) and events __e are currently supported

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|activities|boolean|the enableActivities flag on an object (invalid for __b, __e)||||
|api<br/>-a|option|api name.  Ends with one of the supported types: [__b, __e]||||
|autonumberformat|option|the display format for the autonumbering||||
|description|option|optional description so you can remember why you added this and what it's for|added from sfdx plugin|||
|directory<br/>-d|option|where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default|force-app/main/default|||
|enterprise|boolean|enable bulk/sharing/streaming||||
|feeds|boolean|the enableFeeds flag on an object (invalid for __b, __e)||||
|highvolume|boolean|high volume, valid only for platform events (__e)||||
|history|boolean|the enableHistory flag on an object (invalid for __b, __e)||||
|interactive<br/>-i|boolean|fully interactive--ask me every possible question.||||
|json|boolean|format output as json||||
|label<br/>-l|option|label for the UI||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|namefieldlabel|option|the label for the name field|Name|||
|nametype|option|name field type|||Text<br/>AutoNumber|
|plural<br/>-p|option|plural label for the UI||||
|reports|boolean|the enableReports flag on an object (invalid for __b, __e)||||
|search|boolean|the enableSearch flag on an object (invalid for __b, __e)||||
|sharingmodel|option|sharing model|ReadWrite||Read<br/>ReadWrite<br/>Private|
|type<br/>-t|option|type of object|||custom<br/>cmdt<br/>big<br/>event|
|visibility|option|visibility for custom metadata types|Public||Public<br/>Protected<br/>PackageProtected|

## Examples

```shell
sfdx shane:object:create
// without any params, the cli is going to ask you questions to generate your object interactively

```

```shell
sfdx shane:object:create --label "Platypus" --plural "Platypi" --api Platypus__b --directory /my/project/path
// label, plural, api name specified so the tool doesn't have to ask you about them.  Creates in a non-default path

```

```shell
sfdx shane:object:create --label "Platypus" --plural "Platypi" --api Platypus__b --directory /my/project/path
// label, plural, api name specified so the tool doesn't have to ask you about them.  Creates in a non-default path

```

```shell
sfdx shane:object:create --label "Signal" --plural "Signals" --api Signal__e
// create a platform event

```


