<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:tsp:username:update

## Description

change the username on all transaction security policies

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|directory<br/>-d|option|Where is all this metadata? defaults to force-app/main/default|force-app/main/default|||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|newusername<br/>-n|option|manually specify the username, ignoring your default or any -u||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:tsp:username:update -n newusername@example.com
// updates the username for executionUser and all notifications in all transaction security policies

```

```shell
sfdx shane:tsp:username:create
// updates the username for executionUser and all notifications in all transaction security policies to the default org's username

```

```shell
sfdx shane:tsp:username:create -u someAlias
// updates the username for executionUser and all notifications in all transaction security policies to the specified target org's username

```


