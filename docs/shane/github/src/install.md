<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:github:src:install

## Description

installs a package from github from mdapi src

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|convert<br/>-c|boolean|the path folder is sfdx format, not mdapi, and should be converted first||||
|githubuser<br/>-g|option|github username where the package lives||||
|json|boolean|format output as json||||
|keeplocally<br/>-k|boolean|keep the cloned repo in local source instead of deleting it||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|path<br/>-p|option|folder where the source lives|src|||
|repo<br/>-r|option|repo where the packages lives||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:github:src:install -g someUser -r someRepo -u someOrg
// pulls mdapi-formatted code from https://github.com/someUser/someRepo/src and deploys to the org

```

```shell
sfdx shane:github:src:install -g someUser -r someRepo -u someOrg -p my/folder/tree
// pulls mdapi-formatted code from https://github.com/someUser/someRepo/my/folder/tree and deploys to the org

```


