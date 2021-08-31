<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:heroku:externalobjects

## Description

set up heroku connect on an existing app with external objects

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|app<br/>-a|option|name of the heroku app||||
|createdir<br/>-c|option|creates an external data source in the chosen directory||||
|json|boolean|format output as json||||
|label<br/>-l|option|label that will appear for the external data source you create||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|showbrowser<br/>-b|boolean|show the browser...useful for local debugging||||
|tables<br/>-t|option|comma separated list of postgres table names to share.  If omitted, you want them all!||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|updatefile<br/>-f|option|updates an existing external data source with username/password/url||||
|verbose|boolean|emit additional command output to stdout||||

## Examples

```shell
sfdx shane:heroku:externalobjects -a sneaky-platypus
        // enables external objects on all tables
        
```

```shell
sfdx shane:heroku:externalobjects -a sneak-platypus -t corgis -c force-app/main/default/dataSources -l theDataSource
        // enables external objects on the postgres table called corgis and creates an external data source locally
        
```

```shell
sfdx shane:heroku:externalobjects -a sneak-platypus -f force-app/main/default/dataSources/existingXDS.dataSource-meta.xml
        // enables external objects on all tables and modifies the local file specified
        
```


