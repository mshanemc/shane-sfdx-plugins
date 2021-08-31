<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:lwc:css:merge

## Description

take css from existing file(s), extract component-level relevant selectors and save to a LWC's css file

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|component<br/>-c|option|component directory where template and js live||||
|file<br/>-f|option|file containing all css selectors to select from||||
|json|boolean|format output as json||||
|localcss<br/>-l|option|local css file to merge with contents of --file||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|

## Examples

```shell
sfdx shane:lwc:css:merge -c modules/namespace/myComp -f some/big_file.css
// overwrites modules/namespace/myComp/myComp.css with relevant css selectors from big_file.css

```

```shell
sfdx shane:lwc:css:merge -c modules/namespace/myComp -f some/big_file.css -l modules/namespace/myComp/local.css
// overwrites modules/namespace/myComp/myComp.css with relevant css selectors from big_file.css PLUS any relevant selectors from modules/namespace/myComp/local.css

```


