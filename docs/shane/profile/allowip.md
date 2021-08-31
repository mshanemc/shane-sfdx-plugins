<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:profile:allowip

## Description

allow the whole internet for a profile (no ip verification or 2FA/OTP challenges in dev)

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|directory<br/>-d|option|Where is all this metadata? defaults to force-app/main/default|force-app/main/default|||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|name<br/>-n|option|profile name||||

## Examples

```shell
sfdx shane:profile:allowip -n Admin
// add loginIpRanges of 0.0.0.0 to 255.255.255.255 to an existing profile, or create one if it doesn't exist

```


