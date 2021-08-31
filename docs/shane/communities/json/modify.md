<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:communities:json:modify

## Description

Manipulate community ExperienceBundle JSON files, using REST or Tooling queries to an org to get metadata IDs

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|file<br/>-f|option|full path to the file||||
|id<br/>-i|option|unique id of the component.  ex: 69c03077-932a-4c08-b932-46baec5a7c86||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|property<br/>-p|option|property that will be updated (or contains JSON or what will be updated||||
|query<br/>-q|option|soql query for a field to pass to the value||||
|queryfield|option|field from the record returned by --query that you want to use the value from|Id|||
|subproperty<br/>-s|option|if the property is a json object, or json-like string, the subproperty inside that that needs updating||||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||
|tooling<br/>-t|boolean|using tooling api for query instead of normal sobjects||||
|truncate|boolean|truncate ids to 15 characters on queried record||||
|value<br/>-d|option|new value for the property/subproperty||||
|variable|option|assign one of the variables to the property|||OrgId<br/>InstanceUrl<br/>Username|
|verbose|boolean|emit additional command output to stdout||||
|wavename|option|name to match from wave api||||
|wavetype|option|part of the wave api endpoint|||dashboards|
|write<br/>-w|boolean|write over the original file with its new version.  omit to see what will be written||||

## Examples

```shell
sfdx shane:communities:json:modify -f force-app/main/default/experiences/employeebots1/views/home.json -i 69c03077-932a-4c08-b932-46baec5a7c86 -p someProp  -v NewValue
// find the component and set a new hardcoded value for the property but don't write to the file

```

```shell
sfdx shane:communities:json:modify -f force-app/main/default/experiences/employeebots1/views/home.json -i 69c03077-932a-4c08-b932-46baec5a7c86 -p orgId  -q "select id from organization" --write
// find the component and set a new value from a query to the org and update file locally

```

```shell
sfdx shane:communities:json:modify -f force-app/main/default/experiences/employeebots1/views/home.json -i 69c03077-932a-4c08-b932-46baec5a7c86 -p someUnconvertedJSON -s actualPropInsideTheJSON -q "select id from organization" -t --write
// find the component and set a new value from a query onto a property contained within unconverted JSON using the tooling api and update file locally

```


