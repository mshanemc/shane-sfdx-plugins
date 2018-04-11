moving the existing plugsins to oclif, and adding some more handy stuff.

### install

sfdx plugins:install shane-sfdx-plugins

### docs

what all is in here and how does it work?

install and run this `sfdx shane -h`

but you like README, you say?

## shane:data:file:upload
`sfdx shane:data:file:upload - f ~/Downloads/King.png`
uploads file from local filesystem as a file

`sfdx shane:data:file:upload - f ~/Downloads/King.png -p 0011900000VkJgrAAF`
uploads file from local filesystem as a file and attaches to a record

`sfdx shane:data:file:upload - f ~/Downloads/King.png -p 0011900000VkJgrAAF -c`
uploads and attaches it to the indicated record, but as a chatter file post

`sfdx shane:data:file:upload - f ~/Downloads/King.png -p 0011900000VkJgrAAF -n CustomName -c`
uploads and attaches it to the indicated record, but as a chatter file post with a name that's not the same name as the local filesystem used


## shane:iot.activation
`sfdx shane:iot:activate -n orchName -r`
activates the orchestration, resetting all the instances

`sfdx shane:iot:activate -n orchName -d`
deactivates the orchestration, without resetting all the instances

## shane:mdapi:pull
`sfdx force:mdapi:pull -c -u someOrg`
pulls code kinda stuff from the org and converts/merges it into force-app.  There's other flags for perms, schema, and UI


## shane:org:delete
`sfdx force:org:delete`
deletes the current default scratch org without asking any questions or making you specify the username

## shane:package2:version:bump
`sfdx force:package2:version:bump -m`
bump the minor version up by one

`sfdx force:package2:version:bump -M`
bump the major version up by one (and set minor/patch to 0)

`sfdx force:package2:version:bump -M -t myDir`
bump the major version up by one for a particular directory that's not the default

`sfdx force:package2:version:bump --minor --create`
bump the minor version up by one and create a new package2version

`sfdx force:package2:version:bump --minor --release`
bump the minor version up by one and create a new package2version, then set that as released

## shane:remotesite:create
`sfdx force:remotesite:create -n Test -u https://www.google.com`
create a remote site setting in force-app/main/default

`sfdx force:remotesite:create -n Test -u https://www.google.com -d "my description" -t myOtherDirectory/main/default`
create a remote site setting in myOtherDirectory/main/default with a description

## shane:user:photo
`sfdx force:user:photo -f ~/Downloads/King.png -g User -l User`
sets the chatter photo for the user named User User using the local file

`sfdx force:user:photo -b ~/Downloads/King.png -g User -l User`
sets the chatter banner photo for the user named User User using the local file

`sfdx force:user:photo -f ~/Downloads/King.png -b ~/Downloads/OtherPhoto.jpg -g User -l User`
sets the chatter banner photo AND user photo at the same time

