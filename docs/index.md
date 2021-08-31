<!-- This file has been generated with command 'sfdx hardis:doc:plugin:generate'. Please do not update it manually or it may be overwritten -->

# shane-sfdx-plugins

## install

sfdx plugins:install shane-sfdx-plugins

You'll be prompted that this, like any plugin, is not officially code-signed by Salesforce. If that's annoying, you can [whitelist it](https://developer.salesforce.com/blogs/2017/10/salesforce-dx-cli-plugin-update.html)

## docs

what all is in here and how does it work?

install and run this `sfdx shane -h`

but you like README, you say? Good thing oclif auto-generates all this for me. :)

## Contribute

Way, way down [at the bottom](#How-to-Contribute).

## More plugins

check out [this repo](https://github.com/mshanemc/awesome-sfdx-plugins) for other people's plugins (and share via PR if you've created one)

## Usage

<!-- usage -->

```sh-session
$ npm install -g shane-sfdx-plugins
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
shane-sfdx-plugins/4.43.0 darwin-x64 node-v12.14.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```

<!-- usagestop -->

## Commands

### data:sosl

| Command                                   | Title                                                                                                                                          |
| :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| [**data:sosl:query**](data/sosl/query.md) | Runs a sosl query. SOSL Reference: https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl_syntax.htm |

### shane:ai

| Command                                                                   | Title                                                                                             |
| :------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------ |
| [**shane:ai:auth**](shane/ai/auth.md)                                     | get an access token from an email and a .pem file, either passed in or from environment variables |
| [**shane:ai:dataset:delete**](shane/ai/dataset/delete.md)                 | delete a dataset                                                                                  |
| [**shane:ai:dataset:get**](shane/ai/dataset/get.md)                       | get an access token from an email and a .pem file, either passed in or from environment variables |
| [**shane:ai:dataset:upload**](shane/ai/dataset/upload.md)                 | upload a dataset                                                                                  |
| [**shane:ai:playground:setup**](shane/ai/playground/setup.md)             | upload .pem file from local encrypted copy, setup username and secret key in custom setting       |
| [**shane:ai:playground:setupHeroku**](shane/ai/playground/setupHeroku.md) | provisions a new einstein.ai account and sets up the org                                          |

### shane:analytics

| Command                                                                     | Title                                         |
| :-------------------------------------------------------------------------- | :-------------------------------------------- |
| [**shane:analytics:app:share**](shane/analytics/app/share.md)               | share an analytics app by name                |
| [**shane:analytics:community:enable**](shane/analytics/community/enable.md) | Activate a community using a headless browser |
| [**shane:analytics:dataflow:start**](shane/analytics/dataflow/start.md)     | start an analytics dataflow by name/label/id  |
| [**shane:analytics:dataset:download**](shane/analytics/dataset/download.md) | download a dataset as csv                     |
| [**shane:analytics:dataset:list**](shane/analytics/dataset/list.md)         | what analytics datasets are in my org?        |
| [**shane:analytics:dataset:upload**](shane/analytics/dataset/upload.md)     | upload a dataset from csv                     |

### shane:cdc

| Command                                     | Title |
| :------------------------------------------ | :---- |
| [**shane:cdc:create**](shane/cdc/create.md) |       |
| [**shane:cdc:prep**](shane/cdc/prep.md)     |       |
| [**shane:cdc:stream**](shane/cdc/stream.md) |       |

### shane:cert

| Command                                               | Title                                                                              |
| :---------------------------------------------------- | :--------------------------------------------------------------------------------- |
| [**shane:cert:unhardcode**](shane/cert/unhardcode.md) | modify local xml files with data from org to work around hardcoded metadata issues |

### shane:communities

| Command                                                               | Title                                                                                                         |
| :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| [**shane:communities:activate**](shane/communities/activate.md)       | Activate a community using a headless browser                                                                 |
| [**shane:communities:describe**](shane/communities/describe.md)       | tell me about the communities in the org, and optionally store the description                                |
| [**shane:communities:json:modify**](shane/communities/json/modify.md) | Manipulate community ExperienceBundle JSON files, using REST or Tooling queries to an org to get metadata IDs |
| [**shane:communities:publish**](shane/communities/publish.md)         | Publish a community using a headless browser                                                                  |
| [**shane:communities:selfreg**](shane/communities/selfreg.md)         | set the self-registration account for a community                                                             |
| [**shane:communities:url**](shane/communities/url.md)                 | get me the login for a community from an org                                                                  |

### shane:concierge

| Command                                                           | Title                                                          |
| :---------------------------------------------------------------- | :------------------------------------------------------------- |
| [**shane:concierge:chat:enable**](shane/concierge/chat/enable.md) | Modify custom settings to enable live agent chat for Concierge |

### shane:connectedapp

| Command                                                               | Title                                                                                                                                                      |
| :-------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**shane:connectedapp:attributes**](shane/connectedapp/attributes.md) | Set attributes on a connected app. Attributes for salesforce mobile app at https://github.com/gabesumner/mobile-security/blob/master/customAttributes.json |
| [**shane:connectedapp:uniquify**](shane/connectedapp/uniquify.md)     | modify a clientId/consumerKey on a local connected app to guaranatee uniqueness                                                                            |

### shane:contentasset

| Command                                                       | Title                                         |
| :------------------------------------------------------------ | :-------------------------------------------- |
| [**shane:contentasset:create**](shane/contentasset/create.md) | create a ContentAsset from a local image file |

### shane:data

| Command                                                     | Title                                                                                                                               |
| :---------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| [**shane:data:dates:update**](shane/data/dates/update.md)   | go through a folder of csv files and modify all the dates relative to a given date                                                  |
| [**shane:data:favorite**](shane/data/favorite.md)           | query records and set the match as a favorite                                                                                       |
| [**shane:data:file:download**](shane/data/file/download.md) | save a file from the org to the local filesystem                                                                                    |
| [**shane:data:file:upload**](shane/data/file/upload.md)     | upload a file from local resources, optionally as a chatter post or attached file on a record                                       |
| [**shane:data:id:query**](shane/data/id/query.md)           | query some object and get back the id of the matching record                                                                        |
| [**shane:data:search**](shane/data/search.md)               | sosl search                                                                                                                         |
| [**shane:data:tree:import**](shane/data/tree/import.md)     | similar to the original tree:import, but handles more than 200 records at a go, while still preserving relationships. Takes longer. |

### shane:events

| Command                                           | Title |
| :------------------------------------------------ | :---- |
| [**shane:events:stream**](shane/events/stream.md) |       |

### shane:github

| Command                                                             | Title                                                                                                            |
| :------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------- |
| [**shane:github:action**](shane/github/action.md)                   | adds an action to test your repo against https://github.com/mshanemc/deploy-to-sfdx using github actions         |
| [**shane:github:deploybutton**](shane/github/deploybutton.md)       | modify your local readme file to include a deployer link/button                                                  |
| [**shane:github:package:install**](shane/github/package/install.md) | installs a package from github using the sfdx-project.json file (v43+) OR the latestVersion.json file convention |
| [**shane:github:src:install**](shane/github/src/install.md)         | installs a package from github from mdapi src                                                                    |

### shane:group

| Command                                       | Title                                       |
| :-------------------------------------------- | :------------------------------------------ |
| [**shane:group:photo**](shane/group/photo.md) | Set the photo for a user by first/last name |

### shane:heroku

| Command                                                             | Title                                                                                        |
| :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------- |
| [**shane:heroku:connect**](shane/heroku/connect.md)                 | set up heroku connect on an existing app to an existing org (that you may have just created) |
| [**shane:heroku:externalobjects**](shane/heroku/externalobjects.md) | set up heroku connect on an existing app with external objects                               |
| [**shane:heroku:repo:deploy**](shane/heroku/repo/deploy.md)         | deploy a heroku app that has a valid app.json.                                               |

### shane:iot

| Command                                             | Title                                 |
| :-------------------------------------------------- | :------------------------------------ |
| [**shane:iot:activation**](shane/iot/activation.md) | Activate an iot orchestration by name |

### shane:label

| Command                                   | Title                                                                      |
| :---------------------------------------- | :------------------------------------------------------------------------- |
| [**shane:label:add**](shane/label/add.md) | create a remote site setting in the local source. Push it when you're done |

### shane:listview

| Command                                                   | Title                                                                                                                                                                                                                   |
| :-------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**shane:listview:favorite**](shane/listview/favorite.md) | favorite a listview                                                                                                                                                                                                     |
| [**shane:listview:secure**](shane/listview/secure.md)     | Find list views that are shared everywhere and makes them shared internally only. Local source modification only--to use this command to fix an entire org, retrieve all your objects and then deploy the updated files |

### shane:lwc

| Command                                           | Title                                                                                                   |
| :------------------------------------------------ | :------------------------------------------------------------------------------------------------------ |
| [**shane:lwc:create**](shane/lwc/create.md)       | create a lwc locally without need for sfdx project                                                      |
| [**shane:lwc:css:merge**](shane/lwc/css/merge.md) | take css from existing file(s), extract component-level relevant selectors and save to a LWC's css file |

### shane:mdapi

| Command                                                   | Title                                                                                                 |
| :-------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| [**shane:mdapi:describe**](shane/mdapi/describe.md)       | what's in the org?                                                                                    |
| [**shane:mdapi:list**](shane/mdapi/list.md)               | what's in the org?                                                                                    |
| [**shane:mdapi:package:get**](shane/mdapi/package/get.md) | Gets package from an org, converts, and merges it into the local source                               |
| [**shane:mdapi:package:xml**](shane/mdapi/package/xml.md) | gets metadata form an org based on a local package.xml, converts, and merges it into the local source |
| [**shane:mdapi:pull**](shane/mdapi/pull.md)               | gets unpackaged metadata for you                                                                      |
| [**shane:mdapi:push**](shane/mdapi/push.md)               | convert and deploy the packaged source                                                                |

### shane:msgchannel

| Command                                                   | Title                                      |
| :-------------------------------------------------------- | :----------------------------------------- |
| [**shane:msgchannel:create**](shane/msgchannel/create.md) | create a lightning message channel locally |

### shane:object

| Command                                                             | Title                                                                                                                    |
| :------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------- |
| [**shane:object:create**](shane/object/create.md)                   | create an object in local source. Only **c (limited support), **b (big objects) and events \_\_e are currently supported |
| [**shane:object:fat**](shane/object/fat.md)                         | add or update a field audit trail retention policy on an object. Modifies local source--you still need to push/deploy    |
| [**shane:object:field**](shane/object/field.md)                     | create or add fields to an existing object                                                                               |
| [**shane:object:fields:describe**](shane/object/fields/describe.md) | what fields are on the object?                                                                                           |
| [**shane:object:perms:align**](shane/object/perms/align.md)         | align profiles with                                                                                                      |
| [**shane:object:powerofone**](shane/object/powerofone.md)           | add a "power of one" formula field to any object                                                                         |
| [**shane:object:recordtype**](shane/object/recordtype.md)           | create a new record type for an object                                                                                   |
| [**shane:object:tab**](shane/object/tab.md)                         | create a tab from a custom object, and you have to pick an icon                                                          |
| [**shane:object:unperm**](shane/object/unperm.md)                   | remove references to an object from profiles/permsets (all or a specific one)                                            |

### shane:org

| Command                                                         | Title                                                                                                                                 |
| :-------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| [**shane:org:componentlibrary**](shane/org/componentlibrary.md) | opens the lightning component library for the specified org                                                                           |
| [**shane:org:create**](shane/org/create.md)                     | create an org with a friendly username. wraps force:org:create                                                                        |
| [**shane:org:delete**](shane/org/delete.md)                     | delete the default scratch org. Won't prompt you for confirmation                                                                     |
| [**shane:org:domain:cors**](shane/org/domain/cors.md)           | whitelist the org's domain as a CORS                                                                                                  |
| [**shane:org:domain:csp**](shane/org/domain/csp.md)             | whitelist the org's domain as a CSP Trusted Site                                                                                      |
| [**shane:org:domain:verify**](shane/org/domain/verify.md)       | Verifies that a domain was successfully setup with MyDomain                                                                           |
| [**shane:org:metadatacoverage**](shane/org/metadatacoverage.md) | opens the metadata coverage report page                                                                                               |
| [**shane:org:reauth**](shane/org/reauth.md)                     | reauthenticates (generates a new authinfo) for a scratch org, optionally insisting on custom domain being ready. Requires a hub       |
| [**shane:org:refreshtoken**](shane/org/refreshtoken.md)         | Outputs a refresh token from an org that you've already authenticated sfdx to. PLEASE BE CAREFUL WITH THIS AND TREAT IT AS A PASSWORD |

### shane:package2

| Command                                                           | Title                                                       |
| :---------------------------------------------------------------- | :---------------------------------------------------------- |
| [**shane:package2:version:bump**](shane/package2/version/bump.md) | bump the major/minor version number in the packageDirectory |

### shane:permset

| Command                                             | Title                                                |
| :-------------------------------------------------- | :--------------------------------------------------- |
| [**shane:permset:check**](shane/permset/check.md)   | who has access to what                               |
| [**shane:permset:create**](shane/permset/create.md) | create or add stuff to a permset with maximum access |

### shane:profile

| Command                                               | Title                                                                                    |
| :---------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| [**shane:profile:allowip**](shane/profile/allowip.md) | allow the whole internet for a profile (no ip verification or 2FA/OTP challenges in dev) |
| [**shane:profile:convert**](shane/profile/convert.md) | convert a profile into a permset                                                         |

### shane:project

| Command                                             | Title                   |
| :-------------------------------------------------- | :---------------------- |
| [**shane:project:create**](shane/project/create.md) | creates an sfdx project |

### shane:remotesite

| Command                                                   | Title                                                                      |
| :-------------------------------------------------------- | :------------------------------------------------------------------------- |
| [**shane:remotesite:create**](shane/remotesite/create.md) | create a remote site setting in the local source. Push it when you're done |

### shane:source

| Command                                             | Title                                   |
| :-------------------------------------------------- | :-------------------------------------- |
| [**shane:source:replace**](shane/source/replace.md) | replace a string in a file with another |

### shane:static

| Command                                           | Title                            |
| :------------------------------------------------ | :------------------------------- |
| [**shane:static:create**](shane/static/create.md) | create a static resource locally |

### shane:tab

| Command                                         | Title          |
| :---------------------------------------------- | :------------- |
| [**shane:tab:favorite**](shane/tab/favorite.md) | favorite a tab |

### shane:theme

| Command                                             | Title                                                                                            |
| :-------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| [**shane:theme:activate**](shane/theme/activate.md) | Activate a LightningExperienceTheme via metadata api. Makes no permanent changes to local source |

### shane:tsp

| Command                                                       | Title                                                    |
| :------------------------------------------------------------ | :------------------------------------------------------- |
| [**shane:tsp:username:update**](shane/tsp/username/update.md) | change the username on all transaction security policies |

### shane:uiapi

| Command                                                 | Title                                                                                                                                                   |
| :------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [**shane:uiapi:objectinfo**](shane/uiapi/objectinfo.md) | get a ui api response from the objectinfo endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_object_info.htm |
| [**shane:uiapi:record**](shane/uiapi/record.md)         | get a ui api response from the getrecord endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_record_get.htm   |
| [**shane:uiapi:recordui**](shane/uiapi/recordui.md)     | get a ui api response from the record-ui endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_record_ui.htm    |

### shane:user

| Command                                                         | Title                                                                                                                  |
| :-------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| [**shane:user:allPhotos**](shane/user/allPhotos.md)             | set the chatter photos of anyone who has not set theirs already to encourage them to do so                             |
| [**shane:user:lightning:debug**](shane/user/lightning/debug.md) | set the user to debug mode                                                                                             |
| [**shane:user:loginurl**](shane/user/loginurl.md)               | generate a long-lived shareable login url for the org                                                                  |
| [**shane:user:password:set**](shane/user/password/set.md)       | Set the password for a user by first/last name                                                                         |
| [**shane:user:permset:assign**](shane/user/permset/assign.md)   | Assign a permset to a user by first/last name, or just the default user. Does not error if permset is already assigned |
| [**shane:user:photo**](shane/user/photo.md)                     | Set the photo for a user by first/last name                                                                            |
| [**shane:user:psl**](shane/user/psl.md)                         | Assign a permset license already in an org for a user                                                                  |

### streaming:list

| Command                                 | Title                                    |
| :-------------------------------------- | :--------------------------------------- |
| [**streaming:list**](streaming/list.md) | What kinds of things can I subscribe to? |

### streaming:pushtopic

| Command                                                                 | Title                  |
| :---------------------------------------------------------------------- | :--------------------- |
| [**streaming:pushtopic:create**](streaming/pushtopic/create.md)         | Create push topics     |
| [**streaming:pushtopic:deactivate**](streaming/pushtopic/deactivate.md) | deactivate push topics |
| [**streaming:pushtopic:delete**](streaming/pushtopic/delete.md)         | Delete a push topic    |
| [**streaming:pushtopic:update**](streaming/pushtopic/update.md)         | Update push topics     |

### streaming:subscribe

| Command                                           | Title |
| :------------------------------------------------ | :---- |
| [**streaming:subscribe**](streaming/subscribe.md) |       |
