sfdx shane
==========

Activate an iot orchestration by name
* [sfdx shane:data:file:upload [FILE]](#sfdx-shanedatafileupload-file)
* [sfdx shane:iot:activation](#sfdx-shaneiotactivation)
* [sfdx shane:mdapi:pull](#sfdx-shanemdapipull)
* [sfdx shane:org:create](#sfdx-shaneorgcreate)
* [sfdx shane:org:delete](#sfdx-shaneorgdelete)
* [sfdx shane:package2:version:bump [FILE]](#sfdx-shanepackage-2-versionbump-file)
* [sfdx shane:remotesite:create [FILE]](#sfdx-shaneremotesitecreate-file)
* [sfdx shane:user:photo [FILE]](#sfdx-shaneuserphoto-file)

## sfdx shane:data:file:upload [FILE]

upload a file from local resources, optionally as a chatter post or attached file on a record

```
USAGE
  $ sfdx shane:data:file:upload [FILE]

OPTIONS
  -c, --chatter                                   attach as a chatter content post instead of just as a file
  -f, --file=file                                 (required) path to file on local filesystem
  -n, --name=name                                 set the name of the uploaded file
  -p, --parentId=parentId                         optional record ID that the file should be attached to
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx shane:data:file:upload - f ~/Downloads/King.png
  		//uploads file from local filesystem as a file
		

  sfdx shane:data:file:upload - f ~/Downloads/King.png -p 0011900000VkJgrAAF
  		//uploads file from local filesystem as a file and attaches to a record
		

  sfdx shane:data:file:upload - f ~/Downloads/King.png -p 0011900000VkJgrAAF -c
  		//uploads and attaches it to the indicated record, but as a chatter file post
		

  sfdx shane:data:file:upload - f ~/Downloads/King.png -p 0011900000VkJgrAAF -n CustomName -c
  		//uploads and attaches it to the indicated record, but as a chatter file post with a name that's not the same name as 
  the local filesystem used
```

_See code: [src/commands/shane/data/file/upload.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.0.1/src/commands/shane/data/file/upload.ts)_

## sfdx shane:iot:activation

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
  // activates the orchestration, resetting all the instances


  sfdx shane:iot:activate -n orchName -d
  // deactivates the orchestration, without resetting all the instances
```

_See code: [src/commands/shane/iot/activation.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.0.1/src/commands/shane/iot/activation.ts)_

## sfdx shane:mdapi:pull

gets unpackaged metadata for you

```
USAGE
  $ sfdx shane:mdapi:pull

OPTIONS
  -c, --code                                      Pull apex, VF, Lightning Components, triggers, static resources
  -i, --ui                                        Pull page layouts, tabs, list views, compact layouts, apps, tabs, more
  -p, --perms                                     Pull profiles, permsets, roles, groups, customPermissions
  -s, --schema                                    Pull objects, fields, recordtypes, valueSets, custom Metadata

  -t, --target=target                             [default: force-app] where to convert the result to...defaults to
                                                  force-app

  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org

  --all                                           Pulls just about everything.  Don't use this flag with any other
                                                  subset of metadata.  Not recommended for really large metatadat orgs
                                                  because it'll overflow stdout

  --apiversion=apiversion                         override the api version used for api requests made by this command

  --json                                          format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  sfdx force:mdapi:pull -c -u someOrg
  		// pulls code kinda stuff from the org and converts/merges it into force-app
```

_See code: [src/commands/shane/mdapi/pull.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.0.1/src/commands/shane/mdapi/pull.ts)_

## sfdx shane:org:create

create an org with a friendly username.  wraps force:org:create

```
USAGE
  $ sfdx shane:org:create

OPTIONS
  -a, --setalias=setalias                         set an alias for for the created scratch org
  -c, --noancestors                               do not include second-generation package ancestors in the scratch org
  -d, --durationdays=durationdays                 duration of the scratch org (in days) (default:7, min:1, max:30)

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

  --wait=wait                                     the streaming client socket timeout (in minutes) (default:6, min:2)
```

_See code: [src/commands/shane/org/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.0.1/src/commands/shane/org/create.ts)_

## sfdx shane:org:delete

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
  sfdx force:org:delete
  		// deletes the current default scratch org
```

_See code: [src/commands/shane/org/delete.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.0.1/src/commands/shane/org/delete.ts)_

## sfdx shane:package2:version:bump [FILE]

bump the major/minor version number in the packageDirectory

```
USAGE
  $ sfdx shane:package2:version:bump [FILE]

OPTIONS
  -M, --major                                      Bump the major version by 1, sets minor,build to 0
  -c, --create                                     create a new packageVersion from the new versionNumber
  -m, --minor                                      Bump the minor version by 1

  -r, --release                                    set the newly version as released (out of Beta).  Implies create
                                                   whether you flag it or not :)

  -t, --target=target                              [default: force-app] name of your package directory (defaults to
                                                   force-app)

  -v, --targetdevhubusername=targetdevhubusername  username or alias for the dev hub org; overrides default dev hub org

  --apiversion=apiversion                          override the api version used for api requests made by this command

  --json                                           format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)   logging level for this command invocation

EXAMPLES
  sfdx force:package2:version:bump -m
  // bump the minor version up by one


  sfdx force:package2:version:bump -M
  // bump the major version up by one (and set minor/patch to 0)


  sfdx force:package2:version:bump -M -t myDir
  // bump the major version up by one for a particular directory that's not the default


  sfdx force:package2:version:bump --minor --create
  // bump the minor version up by one and create a new package2version


  sfdx force:package2:version:bump --minor --release
  // bump the minor version up by one and create a new package2version, then set that as released
```

_See code: [src/commands/shane/package2/version/bump.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.0.1/src/commands/shane/package2/version/bump.ts)_

## sfdx shane:remotesite:create [FILE]

create a remote site setting in the local source.  Push it when you're done

```
USAGE
  $ sfdx shane:remotesite:create [FILE]

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
  sfdx force:remotesite:create -n Test -u https://www.google.com
  // create a remote site setting in force-app/main/default


  sfdx force:remotesite:create -n Test -u https://www.google.com -d "my description" -t myOtherDirectory/main/default
  // create a remote site setting in myOtherDirectory/main/default with a description
```

_See code: [src/commands/shane/remotesite/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.0.1/src/commands/shane/remotesite/create.ts)_

## sfdx shane:user:photo [FILE]

Set the photo for a user by first/last name

```
USAGE
  $ sfdx shane:user:photo [FILE]

OPTIONS
  -b, --banner=banner                             local path of the chatter banner photo to use
  -f, --file=file                                 local path of the photo to use
  -g, --firstName=firstName                       first (given) name of the user--keeping -f for file for consistency
  -l, --lastName=lastName                         (required) last name of the user
  -u, --targetusername=targetusername             username or alias for the target org; overrides default target org
  --apiversion=apiversion                         override the api version used for api requests made by this command
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLES
  sfdx force:user:photo -f ~/Downloads/King.png -g User -l User
  // sets the chatter photo for the user named User User using the local file


  sfdx force:user:photo -b ~/Downloads/King.png -g User -l User
  // sets the chatter banner photo for the user named User User using the local file


  sfdx force:user:photo -f ~/Downloads/King.png -b ~/Downloads/OtherPhoto.jpg -g User -l User
  // sets the chatter banner photo AND user photo at the same time
```

_See code: [src/commands/shane/user/photo.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v0.0.1/src/commands/shane/user/photo.ts)_
