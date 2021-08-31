<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:heroku:repo:deploy

## Description

deploy a heroku app that has a valid app.json.  

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|branch<br/>-b|option|heroku branch to deploy|master|||
|days<br/>-d|option|days you want the heroku app to live (does nothing locally)|1|||
|envpassword|option|grab the default scratch org password and set it to this Heroku environment var||||
|envuser|option|grab the default scratch org username and set it to this Heroku environment var||||
|githubuser<br/>-g|option|github username where the app lives||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|what do you want to Heroku app to be named||||
|overrides<br/>-o|option|an array of key-value pairs, like SOME_VAR="some Value" (use quotes where string have spaces!)||||
|repo<br/>-r|option|repo where the app lives||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|team<br/>-t|option|assign this new app to an existing heroku team||||

## Examples

```shell
sfdx shane:heroku:repo:deploy -g someUser -r someRepo
// deploys code from https://github.com/someUser/someRepo that has a valid app.json

```


