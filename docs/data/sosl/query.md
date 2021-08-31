<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# data:sosl:query

## Description

Runs a sosl query.  SOSL Reference: https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl_syntax.htm

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|query<br/>-q|option|SOSL query||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx force:data:sosl:query -q "find {something}"
        
```

```shell
sfdx force:data:sosl:query -q "find {Jack} returning User(Name), Account(Name),Contact(FirstName,LastName,Department)" -u platformers
// search across several objects with different results fields on a specified org

```


