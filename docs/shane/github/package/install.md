<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:github:package:install

## Description

installs a package from github using the sfdx-project.json file (v43+) OR the latestVersion.json file convention

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|githubuser<br/>-g|option|github username where the package lives||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|repo<br/>-r|option|repo where the packages lives||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:github:package:install -g someUser -r someRepo -u someOrg
// installs packageVersion (04t) from https://github.com/someUser/someRepo/sfdx-project.json or https://github.com/someUser/someRepo/latestVersion.json

```


