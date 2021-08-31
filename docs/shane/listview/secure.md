<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:listview:secure

## Description

Find list views that are shared everywhere and makes them shared internally only.  Local source modification only--to use this command to fix an entire org, retrieve all your objects and then deploy the updated files

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|directory<br/>-d|option|Where is all this metadata? defaults to force-app/main/default|force-app/main/default|||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|noprompt<br/>-p|boolean|Do not prompt for confirmation||||
|object<br/>-o|option|only modify list views for a single object.  Api name, including __c if custom||||
|verbose|boolean|emit additional command output to stdout||||

## Examples

```shell
sfdx shane:listview:secure -o Account
// add 'all internal users' sharing to any list view on Account without defined sharing

```

```shell
sfdx shane:listview:secure
// add 'all internal users' sharing to any list view in local source without defined sharing

```


