<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->
# shane:object:field

## Description

create or add fields to an existing object

## Parameters

|Name|Type|Description|Default|Required|Options|
|:---|:--:|:----------|:-----:|:------:|:-----:|
|api<br/>-a|option|API name for the field||||
|default|option|required for checkbox fields.  Express in Salesforce formula language (good luck with that!)||||
|deleteconstraint|option|delete behavior|||SetNull<br/>Restrict<br/>Cascade|
|description|option|optional description for the field so you remember what it's for next year||||
|directory<br/>-d|option|Where is this object metadata? defaults to force-app/main/default|force-app/main/default|||
|externalid|boolean|use as an external id||||
|helptext|option|optional inline help text||||
|indexappend|boolean|put next in the big object index||||
|indexdirection|option|sort direction for the big object index|||ASC<br/>DESC|
|indexposition|option|put in a specific position in the big object index (0 is the first element).  You're responsible for dealing with producing a sane array||||
|interactive<br/>-i|boolean|fully interactive--ask me every possible question.||||
|json|boolean|format output as json||||
|length<br/>-l|option|length (for text fields and text area)||||
|loglevel|option|logging level for this command invocation|warn||trace<br/>debug<br/>info<br/>warn<br/>error<br/>fatal|
|lookupobject|option|API name of the object the lookup goes to||||
|name<br/>-n|option|Label for the field||||
|noindex|boolean|do not add this field to the index||||
|object<br/>-o|option|API name of an object to add a field to||||
|picklistdefaultfirst|boolean|use the first value in the picklist as the default||||
|picklistvalues|option|values for the picklist||||
|precision|option|maximum allowed digits of a number, including whole and decimal places||||
|rellabel|option|label for the child relationship (appears on related lists)||||
|relname|option|API name for the child relationship||||
|reparentable|boolean|the master detail is parentable||||
|required<br/>-r|boolean|field is required||||
|scale<br/>-s|option|places right of the decimal||||
|trackhistory|boolean|enable history tracking on the field||||
|type<br/>-t|option|field type.  Big Objects: Text,Number,DateTime,Lookup,LongTextArea.  Events: Text,Number,DateTime,Date,LongTextArea,Checkbox.  Regular Objects: Text,Number,DateTime,Date,Time,LongTextArea,Checkbox,Url,Email,Phone,Currency,Picklist,Html,Location,Lookup,MasterDetail||||
|unique<br/>-u|boolean|field must be unique||||
|writerequiresmasterread|boolean|the master detail is parentable||||

## Examples

```shell
sfdx shane:object:field
// without any params, the cli is going to ask you questions to generate your field interactively

```

```shell
sfdx shane:object:field --api My_Field__c -l 255 -n "My Field" -t Text -o  BigTest__b --noindex
// create new text field called My Field (My_Field__c) on BigObject BigTest__b

```

```shell
sfdx shane:object:field --api My_Index_Field__c -l 255 -n "My Index Field" -t Text -o  BigTest__b --indexdirection ASC --indexposition 1
// create new text field called My Field (My_Field__c) on BigObject BigTest__b, add it to the existing index as the second field

```

```shell
sfdx shane:object:field --api My_Field__c -l 255 -n "My Field" -t Text -o  EventTest__e
// create new text field called My Field (My_Field__c) on Platform Event EventTest__e

```


