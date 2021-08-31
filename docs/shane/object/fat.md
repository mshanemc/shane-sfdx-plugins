<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:object:fat

## Description

add or update a field audit trail retention policy on an object.  Modifies local source--you still need to push/deploy

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|archiveaftermonths<br/>-m|option|archive after this number of months|18|||
|archiveretentionyears<br/>-y|option|Archive for this many years|10|||
|description|option|optional friendly description for the policy||||
|directory<br/>-d|option|Where is all this metadata? defaults to force-app/main/default|force-app/main/default|||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|object<br/>-o|option|object to manage the policy for||||

## Examples

```shell
sfdx shane:object:fat -o Account
// set the retention policy on Account to the defaults (archive after 18 months, archive for 10 years)

```

```shell
sfdx shane:object:fat -o Account -m 4 -y 5
// archive history for 5 years, after being in regular history for 4 months

```

```shell
sfdx shane:object:fat -o Account -m 4 -y 5 -d myDir
// same as 2nd example, except metadata is in myDir instead of the default force-app/main/default

```

```shell
sfdx shane:mdapi:pull -o Account -u realOrg && sfdx shane:object:fat -o Account -m 4 -y 5 -d myDir && sfdx shane:mdapi:push -u realOrg
// get some object you don't have locally, create the policy, and push that back up to where it came from

```


