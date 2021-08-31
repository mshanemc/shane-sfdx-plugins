<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:group:photo

## Description

Set the photo for a user by first/last name

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|banner<br/>-b|option|local path of the chatter banner photo to use||||
|file<br/>-f|option|local path of the photo to use||||
|group<br/>-g|option|the name of the group name you want to set the photo/banner for||||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:group:photo -g AwesomePeople -f ~/Downloads/King.png
// sets the chatter photo for the group named AwesomePeople using the local file

```

```shell
sfdx shane:group:photo -b ~/Downloads/King.png -g AwesomePeople
// sets the chatter banner photo for the group named AwesomePeople using the local file

```


