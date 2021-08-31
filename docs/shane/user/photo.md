<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:user:photo

## Description

Set the photo for a user by first/last name

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|apiversion|option|override the api version used for api requests made by this command||||
|banner<br/>-b|option|local path of the chatter banner photo to use||||
|file<br/>-f|option|local path of the photo to use||||
|firstname<br/>-g|option|first (given) name of the user--keeping -f for file for consistency||||
|json|boolean|format output as json||||
|lastname<br/>-l|option|last name of the user||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|targetusername<br/>-u|option|username or alias for the target org; overrides default target org||||

## Examples

```shell
sfdx shane:user:photo -f ~/Downloads/King.png -g User -l User
// sets the chatter photo for the user named User User using the local file

```

```shell
sfdx shane:user:photo -b ~/Downloads/King.png -g User -l User
// sets the chatter banner photo for the user named User User using the local file

```

```shell
sfdx shane:user:photo -f ~/Downloads/King.png -b ~/Downloads/OtherPhoto.jpg -g User -l User
// sets the chatter banner photo AND user photo at the same time

```


