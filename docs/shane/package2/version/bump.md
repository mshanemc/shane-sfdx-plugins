<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:package2:version:bump

## Description

bump the major/minor version number in the packageDirectory

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|create<br/>-c|boolean|create a new packageVersion from the new versionNumber||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|major<br/>-M|boolean|Bump the major version by 1, sets minor,build to 0||||
|minor<br/>-m|boolean|Bump the minor version by 1||||
|patch<br/>-p|boolean|Bump the patch version by 1||||
|release<br/>-r|boolean|set the newly version as released (out of Beta).  Implies create whether you flag it or not :)||||
|target<br/>-t|option|name of your package directory (defaults to force-app)|force-app|||
|targetdevhubusername<br/>-v|option|username or alias for the dev hub org; overrides default dev hub org||||

## Examples

```shell
sfdx shane:package2:version:bump -m
// bump the minor version up by one (and set patch to 0)

```

```shell
sfdx shane:package2:version:bump -M
// bump the major version up by one (and set minor/patch to 0)

```

```shell
sfdx shane:package2:version:bump -p
// bump the patch version up by one

```

```shell
sfdx shane:package2:version:bump -M -t myDir
// bump the major version up by one for a particular directory that's not the default

```

```shell
sfdx shane:package2:version:bump --minor --create
// bump the minor version up by one and create a new package2version

```

```shell
sfdx shane:package2:version:bump --minor --release
// bump the minor version up by one and create a new package2version, then set that as released

```


