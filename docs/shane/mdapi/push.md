<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:mdapi:push

## Description

convert and deploy the packaged source

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|convertedfolder<br/>-d|option|where to store the mdapi-converted source|mdapiout|||
|deploymenttimelimit<br/>-w|option|How many minutes to wait for the deployment to finish|200|||
|json|boolean|format output as json||||
|keepconverted<br/>-k|boolean|Don't automatically delete the converted source||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|source<br/>-r|option|deploy a specific folder that's not force-app|force-app|||
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:mdapi:push -u someOrg
// convert to mdapi format and push to the given org

```


