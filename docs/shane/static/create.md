<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:static:create

## Description

create a static resource locally

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|description<br/>-d|option|optional description so you can remember why you added this and what it's for|added from sfdx plugin|||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|name it (Salesforce API compliant name)||||
|public<br/>-p|boolean|mark the cache control public||||
|target<br/>-t|option|where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default|force-app/main/default|||
|type<br/>-y|option|choose one of the following: zip, css, js, text, xml|||zip<br/>css<br/>js<br/>text<br/>xml|

## Examples

```shell
sfdx shane:static:create -n myJSResource -y js
// creates /staticresources/myJSResource.js (empty file) and  /staticresources/myJSResource.resource-meta.xml

```

```shell
sfdx shane:static:create -n myZipResource -y js -d "my description" -t myOtherDirectory/main/default
// create an empty folder (zips when pushed), the meta.xml, with a description in a non-default directory.

```


