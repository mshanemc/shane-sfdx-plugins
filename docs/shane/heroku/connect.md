<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:heroku:connect

## Description

set up heroku connect on an existing app to an existing org (that you may have just created)

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|app<br/>-a|option|name of the heroku app||||
|configfile<br/>-f|option|path to the json file exported from Heroku Connect||||
|environment<br/>-e|option|environment of the salesforce org|custom||sandbox<br/>production<br/>custom|
|instance<br/>-i|option|salesforce instance for making login easier.  Will be read from org:display if exists...this is the override||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|password<br/>-p|option|pass in a password to override the one associated with your org in sfdx, or if you don't have one set properly (like you used `shane:user:password:set` instead of `force:user:password:generate||||
|showbrowser<br/>-b|boolean|show the browser...useful for local debugging||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|verbose|boolean|emit additional command output to stdout||||

## Examples

```shell
sfdx shane:heroku:connect -a prosaic-samurai-4564 -f assets/myConfig.json
// auth the heroku app to the current default org, assuming password is available from force:org:display, then import the json config file

```

```shell
sfdx shane:heroku:connect -a prosaic-samurai-4564 -f assets/myConfig.json -p p455w0rd -u myother@scratch.org
// same, but not the default org, with a specified password

```


