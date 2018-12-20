# shane-sfdx-plugins

## install

sfdx plugins:install shane-sfdx-plugins

You'll be prompted that this, like any plugin, is not officially code-signed by Salesforce.  If that's annoying, you can [whitelist it](https://developer.salesforce.com/blogs/2017/10/salesforce-dx-cli-plugin-update.html)

## docs

what all is in here and how does it work?

install and run this `sfdx shane -h`

but you like README, you say?  Good thing oclif auto-generates all this for me.  :)

# Usage
<!-- usage -->
```sh-session
$ npm install -g shane-sfdx-plugins
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
shane-sfdx-plugins/0.38.2 darwin-x64 node-v9.11.1
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`sfdx shane:data:file:upload`](#sfdx-shanedatafileupload)
* [`sfdx shane:data:id:query`](#sfdx-shanedataidquery)
* [`sfdx shane:github:package:install`](#sfdx-shanegithubpackageinstall)
* [`sfdx shane:github:src:install`](#sfdx-shanegithubsrcinstall)
* [`sfdx shane:heroku:repo:deploy`](#sfdx-shaneherokurepodeploy)
* [`sfdx shane:iot:activation`](#sfdx-shaneiotactivation)
* [`sfdx shane:mdapi:describe`](#sfdx-shanemdapidescribe)
* [`sfdx shane:mdapi:list`](#sfdx-shanemdapilist)
* [`sfdx shane:mdapi:package:get`](#sfdx-shanemdapipackageget)
* [`sfdx shane:mdapi:package:xml`](#sfdx-shanemdapipackagexml)
* [`sfdx shane:mdapi:pull`](#sfdx-shanemdapipull)
* [`sfdx shane:mdapi:push`](#sfdx-shanemdapipush)
* [`sfdx shane:object:create`](#sfdx-shaneobjectcreate)
* [`sfdx shane:object:fat`](#sfdx-shaneobjectfat)
* [`sfdx shane:object:field`](#sfdx-shaneobjectfield)
* [`sfdx shane:object:fields:describe`](#sfdx-shaneobjectfieldsdescribe)
* [`sfdx shane:object:perms:align`](#sfdx-shaneobjectpermsalign)
* [`sfdx shane:object:powerofone`](#sfdx-shaneobjectpowerofone)
* [`sfdx shane:object:unperm`](#sfdx-shaneobjectunperm)
* [`sfdx shane:org:componentlibrary`](#sfdx-shaneorgcomponentlibrary)
* [`sfdx shane:org:create`](#sfdx-shaneorgcreate)
* [`sfdx shane:org:delete`](#sfdx-shaneorgdelete)
* [`sfdx shane:org:domain:verify`](#sfdx-shaneorgdomainverify)
* [`sfdx shane:org:metadatacoverage`](#sfdx-shaneorgmetadatacoverage)
* [`sfdx shane:org:reauth`](#sfdx-shaneorgreauth)
* [`sfdx shane:org:refreshtoken`](#sfdx-shaneorgrefreshtoken)
* [`sfdx shane:package2:version:bump`](#sfdx-shanepackage-2-versionbump)
* [`sfdx shane:permset:create`](#sfdx-shanepermsetcreate)
* [`sfdx shane:profile:convert`](#sfdx-shaneprofileconvert)
* [`sfdx shane:profile:whitelist`](#sfdx-shaneprofilewhitelist)
* [`sfdx shane:project:create`](#sfdx-shaneprojectcreate)
* [`sfdx shane:remotesite:create`](#sfdx-shaneremotesitecreate)
* [`sfdx shane:static:create`](#sfdx-shanestaticcreate)
* [`sfdx shane:tsp:username:update`](#sfdx-shanetspusernameupdate)
* [`sfdx shane:user:allphotos`](#sfdx-shaneuserallphotos)
* [`sfdx shane:user:lightning:debug`](#sfdx-shaneuserlightningdebug)
* [`sfdx shane:user:loginurl`](#sfdx-shaneuserloginurl)
* [`sfdx shane:user:password:set`](#sfdx-shaneuserpasswordset)
* [`sfdx shane:user:photo`](#sfdx-shaneuserphoto)

## `sfdx shane:data:file:upload`

upload a file from local resources, optionally as a chatter post or attached file on a record

```
USAGE
  $ sfdx shane:data:file:upload

OPTIONS
  -c, --chatter                                   attach as a chatter content post instead of just as a file
  -f, --file=file                                 (required) path to file on local filesystem
  -n, --name=name                                 set the name of the uploaded file
  -p, --parentid=parentid                         optional record ID that the file should be attached to
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:data:file:upload -f ~/Downloads/King.png
       //uploads file from local filesystem as a file
    
  sfdx shane:data:file:upload -f ~/Downloads/King.png -p 0011900000VkJgrAAF
       //uploads file from local filesystem as a file and attaches to a record
    
  sfdx shane:data:file:upload -f ~/Downloads/King.png -p 0011900000VkJgrAAF -c
       //uploads and attaches it to the indicated record, but as a chatter file post
    
  sfdx shane:data:file:upload -f ~/Downloads/King.png -p 0011900000VkJgrAAF -n CustomName -c
       //uploads and attaches it to the indicated record, but as a chatter file post with a name that's not the same 
  name as the local filesystem used
```

_See code: [src/commands/shane/data/file/upload.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/data/file/upload.ts)_

## `sfdx shane:data:id:query`

query some object and get back the id of the matching record

```
USAGE
  $ sfdx shane:data:id:query

OPTIONS
  -o, --object=object                             (required) object
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  -w, --where=where                               (required) SOQL where clause for your query
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:data:id:query -o User -u platformers -w "Firstname = 'Shane' and Lastname = 'McLaughlin' and username = 
  'shane@platformers.org'"'
       // returns the id of the user. Use these ids between `` in other commands
```

_See code: [src/commands/shane/data/id/query.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/data/id/query.ts)_

## `sfdx shane:github:package:install`

installs a package from github using the sfdx-project.json file (v43+) OR the latestVersion.json file convention

```
USAGE
  $ sfdx shane:github:package:install

OPTIONS
  -g, --githubuser=githubuser                     (required) github username where the package lives
  -r, --repo=repo                                 (required) repo where the packages lives
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:github:package:install -g someUser -r someRepo -u someOrg
  // installs packageVersion (04t) from https://github.com/someUser/someRepo/sfdx-project.json or 
  https://github.com/someUser/someRepo/latestVersion.json
```

_See code: [src/commands/shane/github/package/install.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/github/package/install.ts)_

## `sfdx shane:github:src:install`

installs a package from github from mdapi src

```
USAGE
  $ sfdx shane:github:src:install

OPTIONS
  -g, --githubuser=githubuser                     (required) github username where the package lives
  -k, --keeplocally                               keep the cloned repo in local source instead of deleting it
  -p, --path=path                                 [default: src] folder where the source lives
  -r, --repo=repo                                 (required) repo where the packages lives
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:github:src:install -g someUser -r someRepo -u someOrg
  // pulls mdapi-formatted code from https://github.com/someUser/someRepo/src and deploys to the org

  sfdx shane:github:src:install -g someUser -r someRepo -u someOrg -p my/folder/tree
  // pulls mdapi-formatted code from https://github.com/someUser/someRepo/my/folder/tree and deploys to the org
```

_See code: [src/commands/shane/github/src/install.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/github/src/install.ts)_

## `sfdx shane:heroku:repo:deploy`

deploy a heroku app that has a valid app.json.

```
USAGE
  $ sfdx shane:heroku:repo:deploy

OPTIONS
  -d, --days=days                                 days you want the heroku app to live (does nothing locally)
  -g, --githubuser=githubuser                     (required) github username where the app lives
  -n, --name=name                                 what do you want to Heroku app to be named

  -o, --overrides=overrides                       an array of key-value pairs, like SOME_VAR="some Value" (use quotes
                                                  where string have spaces!)

  -r, --repo=repo                                 (required) repo where the app lives

  -t, --team=team                                 assign this new app to an existing heroku team

  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org

  --apiversion=apiversion                         override the api version used for api requests made by this command

  --envpassword=envpassword                       grab the default scratch org password and set it to this Heroku
                                                  environment var

  --envuser=envuser                               grab the default scratch org username and set it to this Heroku
                                                  environment var

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:heroku:repo:deploy -g someUser -r someRepo -u
  // deploys code from https://github.com/someUser/someRepo that has a valid app.json
```

_See code: [src/commands/shane/heroku/repo/deploy.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/heroku/repo/deploy.ts)_

## `sfdx shane:iot:activation`

Activate an iot orchestration by name

```
USAGE
  $ sfdx shane:iot:activation

OPTIONS
  -d, --deactivate                                deactivate the orchestration
  -n, --name=name                                 (required) API name of the orchestration
  -r, --reset                                     reset all instances of the orchestration
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:iot:activate -n orchName -r
  // activates the orchestration, including the context if necessary, optionally resetting all the instances

  sfdx shane:iot:activate -n orchName -d
  // deactivates the orchestration, without resetting all the instances
```

_See code: [src/commands/shane/iot/activation.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/iot/activation.ts)_

## `sfdx shane:mdapi:describe`

what's in the org?

```
USAGE
  $ sfdx shane:mdapi:describe

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:mdapi:describe -u someOrg
  // list the metadata available in the org
```

_See code: [src/commands/shane/mdapi/describe.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/mdapi/describe.ts)_

## `sfdx shane:mdapi:list`

what's in the org?

```
USAGE
  $ sfdx shane:mdapi:list

OPTIONS
  -t, --type=type                                 (required) pull only a specific type.  See the metadata api docs for
                                                  type names

  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org

  --apiversion=apiversion                         override the api version used for api requests made by this command

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:mdapi:list -u someOrg -t CustomObject
  // what metadata exists for a specific type
```

_See code: [src/commands/shane/mdapi/list.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/mdapi/list.ts)_

## `sfdx shane:mdapi:package:get`

gets package from an org, converts, and merges it into the local source

```
USAGE
  $ sfdx shane:mdapi:package:get

OPTIONS
  -p, --packagename=packagename                   (required) the name of the package you want to retrieve

  -t, --target=target                             [default: force-app] where to convert the result to...defaults to
                                                  force-app

  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org

  --apiversion=apiversion                         override the api version used for api requests made by this command

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:mdapi:package:get -p MyPkg -u someOrg
  // pulls a package from the org and converts/merges it into force-app

  sfdx shane:mdapi:package:get -p MyPkg -u someOrg -t someDir
  // pulls a package from the org and converts/merges it into /someDir
```

_See code: [src/commands/shane/mdapi/package/get.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/mdapi/package/get.ts)_

## `sfdx shane:mdapi:package:xml`

gets metadata form an org based on a local package.xml, converts, and merges it into the local source

```
USAGE
  $ sfdx shane:mdapi:package:xml

OPTIONS
  -p, --xmlpath=xmlpath                           (required) the location of the package.xml you want to use

  -t, --target=target                             [default: force-app] where to convert the result to...defaults to
                                                  force-app

  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org

  --apiversion=apiversion                         override the api version used for api requests made by this command

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:mdapi:package:xml -p someFolder/package.xml -u someOrg
  // pulls a metadat from the org and converts/merges it into force-app

  sfdx shane:mdapi:package:xml -p someFolder/package.xml -u someOrg -t someDir
  // pulls a package from the org and converts/merges it into /someDir
```

_See code: [src/commands/shane/mdapi/package/xml.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/mdapi/package/xml.ts)_

## `sfdx shane:mdapi:pull`

gets unpackaged metadata for you

```
USAGE
  $ sfdx shane:mdapi:pull

OPTIONS
  -c, --code                                      Pull apex, VF, Lightning Components, triggers, static resources
  -i, --ui                                        Pull page layouts, tabs, compact layouts, apps, tabs, more
  -o, --object=object                             pull metadata for a single object
  -p, --perms                                     Pull profiles, permsets, roles, groups, customPermissions

  -s, --schema                                    Pull objects, fields, list views, recordtypes, valueSets, custom
                                                  Metadata

  -t, --target=target                             [default: force-app] where to convert the result to...defaults to
                                                  force-app

  -t, --type=type                                 pull only a specific type.  See the metadata api docs for type names

  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org

  --all                                           Pulls just about everything.  Don't use this flag with any other
                                                  subset of metadata.  Not recommended for really large metatadat orgs
                                                  because it'll overflow stdout

  --apiversion=apiversion                         override the api version used for api requests made by this command

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

  --wave                                          Pull
                                                  WaveApplication,WaveDashboard,WaveDataflow,WaveLens,WaveTemplateBundle
                                                  ,Wavexmd,WaveDataset

EXAMPLES
  sfdx shane:mdapi:pull -c -u someOrg
  // pulls code kinda stuff from the org and converts/merges it into force-app

  sfdx shane:mdapi:pull -t ExternalDataSource -u someOrg
  // pulls all the external data source metadata from the org and converts/merges it into force-app
```

_See code: [src/commands/shane/mdapi/pull.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/mdapi/pull.ts)_

## `sfdx shane:mdapi:push`

convert and deploy the packaged source

```
USAGE
  $ sfdx shane:mdapi:push

OPTIONS
  -d, --convertedfolder=convertedfolder           [default: mdapiout] where to store the mdapi-converted source
  -k, --keepconverted                             Don't automatically delete the converted source
  -r, --source=source                             [default: force-app] deploy a specific folder that's not force-app
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  -w, --deploymenttimelimit=deploymenttimelimit   [default: 200] How many minutes to wait for the deployment to finish
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:mdapi:push -u someOrg
  // convert to mdapi format and push to the given org
```

_See code: [src/commands/shane/mdapi/push.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/mdapi/push.ts)_

## `sfdx shane:object:create`

create an object in local source.  Only __c (limited support), __b (big objects) and events __e are currently supported

```
USAGE
  $ sfdx shane:object:create

OPTIONS
  -a, --api=api                                   api name.  Ends with one of the supported types: [__b, __e]

  -d, --directory=directory                       [default: force-app/main/default] where to create the folder (if it
                                                  doesn't exist already) and file...defaults to force-app/main/default

  -h, --highvolume                                high volume, valid only for platform events (__e)

  -i, --interactive                               fully interactive--ask me every possible question.

  -l, --label=label                               label for the UI

  -p, --plural=plural                             plural label for the UI

  -t, --type=custom|big|event                     type of object

  --activities                                    the enableActivities flag on an object (invalid for __b, __e)

  --autonumberformat=autonumberformat             the display format for the autonumbering

  --description=description                       [default: added from sfdx plugin] optional description so you can
                                                  remember why you added this and what it's for

  --enterprise                                    enable bulk/sharing/streaming

  --feeds                                         the enableFeeds flag on an object (invalid for __b, __e)

  --history                                       the enableHistory flag on an object (invalid for __b, __e)

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

  --namefieldlabel=namefieldlabel                 [default: Name] the label for the name field

  --nametype=Text|AutoNumber                      name field type

  --reports                                       the enableReports flag on an object (invalid for __b, __e)

  --search                                        the enableSearch flag on an object (invalid for __b, __e)

  --sharingmodel=Read|ReadWrite|Private           [default: ReadWrite] sharing model

EXAMPLES
  sfdx shane:object:create
  // without any params, the cli is going to ask you questions to generate your object interactively

  sfdx shane:object:create --label "Platypus" --plural "Platypi" --api Platypus__b --directory /my/project/path
  // label, plural, api name specified so the tool doesn't have to ask you about them.  Creates in a non-default path

  sfdx shane:object:create --label "Platypus" --plural "Platypi" --api Platypus__b --directory /my/project/path
  // label, plural, api name specified so the tool doesn't have to ask you about them.  Creates in a non-default path

  sfdx shane:object:create --label "Signal" --plural "Signals" --api Signal__e
  // create a platform event
```

_See code: [src/commands/shane/object/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/object/create.ts)_

## `sfdx shane:object:fat`

add or update a field audit trail retention policy on an object.  Modifies local source--you still need to push/deploy

```
USAGE
  $ sfdx shane:object:fat

OPTIONS
  -d, --directory=directory                          [default: force-app/main/default] Where is all this metadata?
                                                     defaults to force-app/main/default

  -m, --archiveaftermonths=archiveaftermonths        [default: 18] archive after this number of months

  -o, --object=object                                (required) object to manage the policy for

  -y, --archiveretentionyears=archiveretentionyears  [default: 10] Archive for this many years

  --description=description                          optional friendly description for the policy

  --json                                             format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)     logging level for this command invocation

EXAMPLES
  sfdx shane:object:fat -o Account
  // set the retention policy on Account to the defaults (archive after 18 months, archive for 10 years)

  sfdx shane:object:fat -o Account -m 4 -y 5
  // archive history for 5 years, after being in regular history for 4 months

  sfdx shane:object:fat -o Account -m 4 -y 5 -d myDir
  // same as 2nd example, except metadata is in myDir instead of the default force-app/main/default

  sfdx shane:mdapi:pull -o Account -u realOrg && sfdx shane:object:fat -o Account -m 4 -y 5 -d myDir && sfdx 
  shane:mdapi:push -u realOrg
  // get some object you don't have locally, create the policy, and push that back up to where it came from
```

_See code: [src/commands/shane/object/fat.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/object/fat.ts)_

## `sfdx shane:object:field`

create or add fields to an existing object

```
USAGE
  $ sfdx shane:object:field

OPTIONS
  -a, --api=api                                   API name for the field

  -d, --directory=directory                       [default: force-app/main/default] Where is this object metadata?
                                                  defaults to force-app/main/default

  -i, --interactive                               fully interactive--ask me every possible question.

  -l, --length=length                             length (for text fields)

  -n, --name=name                                 Label for the field

  -o, --object=object                             API name of an object to add a field to

  -r, --required                                  field is required

  -s, --scale=scale                               places right of the decimal

  -t, --type=type                                 field type.  Big Objects: Text,Number,DateTime,Lookup,LongTextArea.
                                                  Events: Text,Number,DateTime,Date,LongTextArea,Checkbox.  Regular
                                                  Objects: Text,Number,DateTime,Date,LongTextArea,Checkbox,Url

  -u, --unique                                    field must be unique

  --default=default                               required for checkbox fields.  Express in Salesforce formula language
                                                  (good luck with that!)

  --description=description                       optional description for the field so you remember what it's for next
                                                  year

  --externalid                                    use as an external id

  --helptext=helptext                             optional inline help text

  --indexappend                                   put next in the big object index

  --indexdirection=ASC|DESC                       sort direction for the big object index

  --indexposition=indexposition                   put in a specific position in the big object index (0 is the first
                                                  element).  You're responsible for dealing with producing a sane array

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

  --lookupobject=lookupobject                     API name of the object the lookup goes to

  --noindex                                       do not add this field to the index

  --precision=precision                           maximum allowed digits of a number, including whole and decimal places

  --relname=relname                               API name for the lookup relationship

  --trackhistory                                  enable history tracking on the field

EXAMPLES
  sfdx shane:object:field
  // without any params, the cli is going to ask you questions to generate your field interactively

  sfdx shane:object:field --api My_Field__c -l 255 -n "My Field" -t Text -o  BigTest__b --noindex
  // create new text field called My Field (My_Field__c) on BigObject BigTest__b

  sfdx shane:object:field --api My_Index_Field__c -l 255 -n "My Index Field" -t Text -o  BigTest__b --indexdirection ASC 
  --indexposition 1
  // create new text field called My Field (My_Field__c) on BigObject BigTest__b, add it to the existing index as the 
  second field

  sfdx shane:object:field --api My_Field__c -l 255 -n "My Field" -t Text -o  EventTest__e
  // create new text field called My Field (My_Field__c) on Platform Event EventTest__e
```

_See code: [src/commands/shane/object/field.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/object/field.ts)_

## `sfdx shane:object:fields:describe`

what fields are on the object?

```
USAGE
  $ sfdx shane:object:fields:describe

OPTIONS
  -o, --object=object                             (required) the object to describe
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:object:fields:describe -o Account -u someOrg
  // list the fields (with type/label) on account
```

_See code: [src/commands/shane/object/fields/describe.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/object/fields/describe.ts)_

## `sfdx shane:object:perms:align`

align profiles with

```
USAGE
  $ sfdx shane:object:perms:align

OPTIONS
  -d, --directory=directory                       [default: force-app/main/default] Where is all this metadata?
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:object:perms:align
  // go through all the profiles/permsets in force-app/main/default and remove references to stuff that isn't in local 
  source
```

_See code: [src/commands/shane/object/perms/align.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/object/perms/align.ts)_

## `sfdx shane:object:powerofone`

add a "power of one" formula field to any object

```
USAGE
  $ sfdx shane:object:powerofone

OPTIONS
  -a, --api=api                                   [default: Power_Of_One__c] api name (will include the __c for you if
                                                  you don't add it here

  -d, --description=description                   [default: Power of one is used for formulas, reporting, etc] optional
                                                  description so you can remember why you added this and what it's for

  -l, --label=label                               [default: Power Of One] label

  -o, --object=object                             (required) API name of the object to add the field to

  -t, --target=target                             [default: force-app/main/default] where to create the folder (if it
                                                  doesn't exist already) and file...defaults to force-app/main/default

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:object:powerofone -a Poo -l "Power of One" -o User
  // create a field with api name Poo__c and label "Power of One" on the user object with the default description in the 
  default folder
```

_See code: [src/commands/shane/object/powerofone.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/object/powerofone.ts)_

## `sfdx shane:object:unperm`

remove references to an object from profiles/permsets (all or a specific one)

```
USAGE
  $ sfdx shane:object:unperm

OPTIONS
  -d, --directory=directory                       [default: force-app/main/default] Where is all this metadata? defaults
                                                  to force-app/main/default

  -o, --object=object                             (required) remove all references to an object from profiles or
                                                  permsets

  -s, --specific=specific                         specify a profile or permset by name to only remove it from that one

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:object:unperm -o OpportunitySplit
  // go through all the profiles/permsets in force-app/main/default and remove the object, field, recordtypes and layout 
  assignments (profile only) for the named object
```

_See code: [src/commands/shane/object/unperm.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/object/unperm.ts)_

## `sfdx shane:org:componentlibrary`

opens the lightning component library for the specified org

```
USAGE
  $ sfdx shane:org:componentlibrary

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:org:componentlibrary
  // opens /componentReference/suite.app on the default scratch org

  sfdx shane:org:componentlibrary -u someOrgAlias
  // opens library for specified org
```

_See code: [src/commands/shane/org/componentlibrary.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/org/componentlibrary.ts)_

## `sfdx shane:org:create`

create an org with a friendly username.  wraps force:org:create

```
USAGE
  $ sfdx shane:org:create

OPTIONS
  -a, --setalias=setalias                         set an alias for for the created scratch org
  -c, --noancestors                               do not include second-generation package ancestors in the scratch org

  -d, --durationdays=durationdays                 [default: 7] duration of the scratch org (in days) (default:7, min:1,
                                                  max:30)

  -f, --definitionfile=definitionfile             [default: config/project-scratch-def.json] path to a scratch org
                                                  definition file.  Default = config/project-scratch-def.json

  -i, --clientid=clientid                         connected app consumer key

  -n, --nonamespace                               creates the scratch org with no namespace

  -o, --userdomain=userdomain                     (required) last part of the generated username (after the @ sign).
                                                  Example: 'demo.org' produces shane1@demo.org, shane2@demo.org

  -s, --setdefaultusername                        set the created org as the default username

  -u, --userprefix=userprefix                     (required) first part of the generated username.  Example: 'shane'
                                                  produces shane1@demo.org, shane2@demo.org

  -v, --targetdevhubusername                      username or alias for the dev hub org; overrides default dev hub org

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

  --wait=wait                                     the streaming client socket timeout (in minutes) (default:20, min:2)

EXAMPLES
  sfdx shane:org:create -u shane -o org.test
  // creates an org from the default project config/project-scratch-def.json but with username shane[i]@org.test where i 
  is a unique sequence number for that -u/-o combination

  sfdx shane:org:create -u shane -o org.test -a sydneyBristow -d 30 -v myOtherHub -f config/thatOtherFile.json
  // above, but with an alias, a longer duration, and not the default hub, and not the default config file
```

_See code: [src/commands/shane/org/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/org/create.ts)_

## `sfdx shane:org:delete`

delete the default scratch org.  Won't prompt you for confirmation

```
USAGE
  $ sfdx shane:org:delete

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:org:delete
  // deletes the current default scratch org
```

_See code: [src/commands/shane/org/delete.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/org/delete.ts)_

## `sfdx shane:org:domain:verify`

Verifies that a domain was successfully setup with MyDomain

```
USAGE
  $ sfdx shane:org:domain:verify

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:org:domain:verify
```

_See code: [src/commands/shane/org/domain/verify.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/org/domain/verify.ts)_

## `sfdx shane:org:metadatacoverage`

opens the metadata coverage report page

```
USAGE
  $ sfdx shane:org:metadatacoverage

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:org:metadatacoverage
  // opens /mdcoverage/report.jsp on the default scratch org

  sfdx shane:org:metadatacoverage -u someOrgAlias
  // opens mdcoverage for specified org
```

_See code: [src/commands/shane/org/metadatacoverage.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/org/metadatacoverage.ts)_

## `sfdx shane:org:reauth`

reauthenticates (generates a new authinfo) for a scratch org, optionally insisting on custom domain being ready.  Requires a hub

```
USAGE
  $ sfdx shane:org:reauth

OPTIONS
  -r, --requirecustomdomain                        keep trying until you get back an org with a custom domain on it
  -u, --targetusername=targetusername              username or alias for the target org; overrides default target org
  -v, --targetdevhubusername=targetdevhubusername  username or alias for the dev hub org; overrides default dev hub org
  --apiversion=apiversion                          override the api version used for api requests made by this command
  --json                                           format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)   logging level for this command invocation

EXAMPLES
  sfdx shane:org:reauth
       // reauths, and takes what it can get
    
  sfdx shane:org:reauth --requirecustomdomain
       // will try each minute, up to 60 minutes, until an org with a valid mydomain is ready
```

_See code: [src/commands/shane/org/reauth.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/org/reauth.ts)_

## `sfdx shane:org:refreshtoken`

Outputs a refresh token from an org that you've already auth'd sfdx to.  PLEASE BE CAREFUL WITH THIS AND TREAT IT AS A PASSWORD

```
USAGE
  $ sfdx shane:org:refreshtoken

OPTIONS
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:org:refreshtoken -u someAliasOrUsername
  // prints the refresh token for some org that you've already connected to
```

_See code: [src/commands/shane/org/refreshtoken.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/org/refreshtoken.ts)_

## `sfdx shane:package2:version:bump`

bump the major/minor version number in the packageDirectory

```
USAGE
  $ sfdx shane:package2:version:bump

OPTIONS
  -M, --major                                      Bump the major version by 1, sets minor,build to 0
  -c, --create                                     create a new packageVersion from the new versionNumber
  -m, --minor                                      Bump the minor version by 1
  -p, --patch                                      Bump the patch version by 1

  -r, --release                                    set the newly version as released (out of Beta).  Implies create
                                                   whether you flag it or not :)

  -t, --target=target                              [default: force-app] name of your package directory (defaults to
                                                   force-app)

  -v, --targetdevhubusername=targetdevhubusername  username or alias for the dev hub org; overrides default dev hub org

  --apiversion=apiversion                          override the api version used for api requests made by this command

  --json                                           format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)   logging level for this command invocation

EXAMPLES
  sfdx shane:package2:version:bump -m
  // bump the minor version up by one (and set patch to 0)

  sfdx shane:package2:version:bump -M
  // bump the major version up by one (and set minor/patch to 0)

  sfdx shane:package2:version:bump -p
  // bump the patch version up by one

  sfdx shane:package2:version:bump -M -t myDir
  // bump the major version up by one for a particular directory that's not the default

  sfdx shane:package2:version:bump --minor --create
  // bump the minor version up by one and create a new package2version

  sfdx shane:package2:version:bump --minor --release
  // bump the minor version up by one and create a new package2version, then set that as released
```

_See code: [src/commands/shane/package2/version/bump.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/package2/version/bump.ts)_

## `sfdx shane:permset:create`

create or add stuff to a permset with maximum access

```
USAGE
  $ sfdx shane:permset:create

OPTIONS
  -d, --directory=directory                       [default: force-app/main/default] Where is all this metadata? defaults
                                                  to force-app/main/default

  -f, --field=field                               API name of an field to add perms for.  Required --object If blank,
                                                  then you mean all the fields

  -n, --name=name                                 (required) path to existing permset.  If it exists, new perms will be
                                                  added to it.  If not, then it'll be created for you

  -o, --object=object                             API name of an object to add perms for.  If blank, then you mean ALL
                                                  the objects and ALL their fields and ALL their tabs

  -t, --tab                                       also add the tab for the specified object (or all objects if there is
                                                  no specified objects)

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:permset:create -n MyPermSet1 -o Something__c -f Some_Field__c
  // create a permset in force-app/main/default for the object/field.  If MyPermSet1 doesn't exist, it will be created.

  sfdx shane:permset:create -n MyPermSet1 -o Something__c
  // create a permset in force-app/main/default for every field on Something__c.

  sfdx shane:permset:create -n MyPermSet1
  // create a permset in force-app/main/default for every field on every object!

  sfdx shane:permset:create -n MyPermSet1 -t
  // create a permset in force-app/main/default for every field on every object.  If there's a tab for any of those 
  objects, add that tab to the permset, too
```

_See code: [src/commands/shane/permset/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/permset/create.ts)_

## `sfdx shane:profile:convert`

convert a profile into a permset

```
USAGE
  $ sfdx shane:profile:convert

OPTIONS
  -c, --skinnyclone                               create a new profile that's the original profile less permset (does
                                                  not modify original profile)

  -d, --directory=directory                       [default: force-app/main/default] Where is all this metadata? defaults
                                                  to force-app/main/default

  -e, --editprofile                               remove metadata from original profile

  -n, --name=name                                 (required) path to existing permset.  If it exists, new perms will be
                                                  added to it.  If not, then it'll be created for you

  -p, --profile=profile                           (required) API name of an profile to convert.  If blank, then you mean
                                                  ALL the objects and ALL their fields and ALL their tabs

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:profile:convert -p Admin -n MyNewPermSet -e
  // create a permset in force-app/main/default from the Admin profile (profiles/Admin).  If MyNewPermSet doesn't exist, 
  it will be created.  Content is removed from Admin profile (-e)

  sfdx shane:profile:convert -p Admin -n MyNewPermSet -c
  // create a permset in force-app/main/default from the Admin profile (profiles/Admin).  If MyNewPermSet doesn't exist, 
  it will be created.  Leaves the original Admin profile and creates an Admin_Skinny profile that has everything in the 
  permset removed (-c)
```

_See code: [src/commands/shane/profile/convert.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/profile/convert.ts)_

## `sfdx shane:profile:whitelist`

whitelist the whole internet for a profile (no ip verification or 2FA/OTP challenges in dev)

```
USAGE
  $ sfdx shane:profile:whitelist

OPTIONS
  -d, --directory=directory                       [default: force-app/main/default] Where is all this metadata? defaults
                                                  to force-app/main/default

  -n, --name=name                                 (required) profile name

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:profile:whitelist -n Admin
  // add loginIpRanges of 0.0.0.0 to 255.255.255.255 to an existing profile, or create one if it doesn't exist
```

_See code: [src/commands/shane/profile/whitelist.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/profile/whitelist.ts)_

## `sfdx shane:project:create`

creates an sfdx project

```
USAGE
  $ sfdx shane:project:create

OPTIONS
  -g, --gitremote=gitremote                        (required) [default: RemoteTBD] full github url for the remote
  -n, --name=name                                  (required) name and path for the project
  -v, --targetdevhubusername=targetdevhubusername  username or alias for the dev hub org; overrides default dev hub org
  --apiversion=apiversion                          override the api version used for api requests made by this command
  --json                                           format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)   logging level for this command invocation

EXAMPLE
  sfdx shane:project:create -n myProject
  // create a project in the folder with all the default structure
```

_See code: [src/commands/shane/project/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/project/create.ts)_

## `sfdx shane:remotesite:create`

create a remote site setting in the local source.  Push it when you're done

```
USAGE
  $ sfdx shane:remotesite:create

OPTIONS
  -d, --description=description                   [default: added from sfdx plugin] optional description so you can
                                                  remember why you added this and what it's for

  -n, --name=name                                 (required) name it (Salesforce API compliant name)

  -t, --target=target                             [default: force-app/main/default] where to create the folder (if it
                                                  doesn't exist already) and file...defaults to force-app/main/default

  -u, --url=url                                   (required) url that you want to allow callouts to

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:remotesite:create -n Test -u https://www.google.com
  // create a remote site setting in force-app/main/default

  sfdx shane:remotesite:create -n Test -u https://www.google.com -d "my description" -t myOtherDirectory/main/default
  // create a remote site setting in myOtherDirectory/main/default with a description
```

_See code: [src/commands/shane/remotesite/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/remotesite/create.ts)_

## `sfdx shane:static:create`

create a static resource locally

```
USAGE
  $ sfdx shane:static:create

OPTIONS
  -d, --description=description                   [default: added from sfdx plugin] optional description so you can
                                                  remember why you added this and what it's for

  -n, --name=name                                 (required) name it (Salesforce API compliant name)

  -p, --public                                    mark the cache control public

  -t, --target=target                             [default: force-app/main/default] where to create the folder (if it
                                                  doesn't exist already) and file...defaults to force-app/main/default

  -y, --type=zip|css|js|text|xml                  (required) choose one of the following: zip, css, js, text, xml

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:static:create -n myJSResource -y js
  // creates /staticresources/myJSResource.js (empty file) and  /staticresources/myJSResource.resource-meta.xml

  sfdx shane:static:create -n myZipResource -y js -d "my description" -t myOtherDirectory/main/default
  // create an empty folder (zips when pushed), the meta.xml, with a description in a non-default directory.
```

_See code: [src/commands/shane/static/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/static/create.ts)_

## `sfdx shane:tsp:username:update`

change the username on all transaction security policies

```
USAGE
  $ sfdx shane:tsp:username:update

OPTIONS
  -d, --directory=directory                       [default: force-app/main/default] Where is all this metadata? defaults
                                                  to force-app/main/default

  -n, --newusername=newusername                   manually specify the username, ignoring your default or any -u

  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org

  --apiversion=apiversion                         override the api version used for api requests made by this command

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:tsp:username:update -n newusername@example.com
  // updates the username for executionUser and all notifications in all transaction security policies

  sfdx shane:tsp:username:create
  // updates the username for executionUser and all notifications in all transaction security policies to the default 
  org's username

  sfdx shane:tsp:username:create -u someAlias
  // updates the username for executionUser and all notifications in all transaction security policies to the specified 
  target org's username
```

_See code: [src/commands/shane/tsp/username/update.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/tsp/username/update.ts)_

## `sfdx shane:user:allphotos`

set the chatter photos of anyone who has not set theirs already to encourage them to do so

```
USAGE
  $ sfdx shane:user:allphotos

OPTIONS
  -f, --folder=folder                             optional local folder of photos.  Overrides --repo

  -r, --repo=repo                                 [default: https://github.com/mshanemc/badProfilePhotos] optional
                                                  alternate repo of photos, which contains a folder of photos named /img

  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org

  --apiversion=apiversion                         override the api version used for api requests made by this command

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:user:allphotos -u someAlias
```

_See code: [src/commands/shane/user/allphotos.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/user/allphotos.ts)_

## `sfdx shane:user:lightning:debug`

set the user to debug mode

```
USAGE
  $ sfdx shane:user:lightning:debug

OPTIONS
  -g, --firstname=firstname                       first (given) name of the user--keeping -f for file for consistency
  -l, --lastname=lastname                         last name of the user
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:user:lightning:debug
       // puts the default user in lightning debug mode
    
  sfdx shane:user:lightning:debug -g Sarah -l McLaughlin
       // puts the named user in lightning debug mode
```

_See code: [src/commands/shane/user/lightning/debug.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/user/lightning/debug.ts)_

## `sfdx shane:user:loginurl`

generate a long-lived shareable login url for the org

```
USAGE
  $ sfdx shane:user:loginurl

OPTIONS
  -p, --starturl=starturl                         url to open
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:user:loginurl
       // generates a url including un and pw query strings to simplify logging into the scratch org
    
  sfdx shane:user:loginurl -p /lightning/setup/ObjectManager/home
       // same, but sets the start url to ObjectManager
```

_See code: [src/commands/shane/user/loginurl.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/user/loginurl.ts)_

## `sfdx shane:user:password:set`

Set the password for a user by first/last name

```
USAGE
  $ sfdx shane:user:password:set

OPTIONS
  -g, --firstname=firstname                       (required) first (given) name of the user--keeping -f for file for
                                                  consistency

  -l, --lastname=lastname                         (required) last name of the user

  -p, --password=password                         (required) local path of the photo to use

  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org

  --apiversion=apiversion                         override the api version used for api requests made by this command

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx shane:user:password:set -p sfdx1234 -g User -l User
  // sets the password for User User to sfdx1234
```

_See code: [src/commands/shane/user/password/set.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/user/password/set.ts)_

## `sfdx shane:user:photo`

Set the photo for a user by first/last name

```
USAGE
  $ sfdx shane:user:photo

OPTIONS
  -b, --banner=banner                             local path of the chatter banner photo to use
  -f, --file=file                                 local path of the photo to use
  -g, --firstname=firstname                       first (given) name of the user--keeping -f for file for consistency
  -l, --lastname=lastname                         (required) last name of the user
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:user:photo -f ~/Downloads/King.png -g User -l User
  // sets the chatter photo for the user named User User using the local file

  sfdx shane:user:photo -b ~/Downloads/King.png -g User -l User
  // sets the chatter banner photo for the user named User User using the local file

  sfdx shane:user:photo -f ~/Downloads/King.png -b ~/Downloads/OtherPhoto.jpg -g User -l User
  // sets the chatter banner photo AND user photo at the same time
```

_See code: [src/commands/shane/user/photo.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.38.2/src/commands/shane/user/photo.ts)_
<!-- commandsstop -->
