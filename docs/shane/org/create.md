<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:org:create

## Description

create an org with a friendly username.  wraps force:org:create

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|clientid<br/>-i|option|connected app consumer key||||
|definitionfile<br/>-f|option|path to a scratch org definition file.  Default = config/project-scratch-def.json|config/project-scratch-def.json|||
|durationdays<br/>-d|option|duration of the scratch org (in days) (default:7, min:1, max:30)|7|||
|json|boolean|format output as json||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|noancestors<br/>-c|boolean|do not include second-generation package ancestors in the scratch org||||
|nonamespace<br/>-n|boolean|creates the scratch org with no namespace||||
|setalias<br/>-a|option|set an alias for for the created scratch org||||
|setdefaultusername<br/>-s|boolean|set the created org as the default username||||
|userdomain<br/>-o|option|last part of the generated username (after the @ sign).  Example: 'demo.org' produces shane1@demo.org, shane2@demo.org||||
|userprefix|option|first part of the generated username.  Example: 'shane' produces shane1@demo.org, shane2@demo.org||||
|verbose|boolean|emit additional command output to stdout||||
|wait|option|the streaming client socket timeout (in minutes) (default:20, min:2)|20|||

## Examples

```shell
sfdx shane:org:create --userprefix shane -o org.test
// creates an org from the default project config/project-scratch-def.json but with username shane[i]@org.test where i is a unique sequence number for that -u/-o combination

```

```shell
sfdx shane:org:create --userprefix shane -o org.test -a sydneyBristow -d 30 -v myOtherHub -f config/thatOtherFile.json
// above, but with an alias, a longer duration, and not the default hub, and not the default config file

```


