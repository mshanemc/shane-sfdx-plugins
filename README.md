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

# Usage

<!-- usage -->

```sh-session
$ npm install -g shane-sfdx-plugins
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
shane-sfdx-plugins/4.29.0 darwin-x64 node-v12.14.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

-   [`sfdx shane:ai:auth [-e <email>] [-f <filepath>] [-t <integer>] [-l <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneaiauth--e-email--f-filepath--t-integer--l-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:ai:dataset:delete -n <string> [-e <email>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneaidatasetdelete--n-string--e-email---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:ai:dataset:get -n <string> [-l] [-e <email>] [-p] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneaidatasetget--n-string--l--e-email--p---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:ai:dataset:upload [-n <string>] [-f <filepath>] [-p <string>] [-t <string>] [--train] [-e <email>] [-w <integer>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneaidatasetupload--n-string--f-filepath--p-string--t-string---train--e-email--w-integer---verbose---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:ai:playground:setup -f <filepath> [-e <email>] [-k <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneaiplaygroundsetup--f-filepath--e-email--k-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:ai:playground:setupHeroku [-a <string>] [-c] [-k] [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneaiplaygroundsetupheroku--a-string--c--k--u-string---apiversion-string---verbose---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:analytics:app:share -n <string> [--allprm -c] [--allcsp undefined] [--org] [-t <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneanalyticsappshare--n-string---allprm--c---allcsp-undefined---org--t-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:analytics:community:enable [-b] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneanalyticscommunityenable--b--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:analytics:dataflow:start [-n <string>] [-i <id>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneanalyticsdataflowstart--n-string--i-id--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:analytics:dataset:download [-i <id>] [-n <string>] [--versionid <string>] [-t <filepath>] [-r <number>] [-o <number>] [-b <number>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneanalyticsdatasetdownload--i-id--n-string---versionid-string--t-filepath--r-number--o-number--b-number--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:analytics:dataset:list [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneanalyticsdatasetlist--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:analytics:dataset:upload -n <string> -f <filepath> [-a <string>] [-m <filepath>] [-o <string>] [--async] [-d <integer>] [--serial] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneanalyticsdatasetupload--n-string--f-filepath--a-string--m-filepath--o-string---async--d-integer---serial--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:cdc:create -d <directory> [--batchsize <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanecdccreate--d-directory---batchsize-integer--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:cdc:prep -d <directory> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanecdcprep--d-directory--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:cdc:stream [-o <string>] [-d <directory>] [-r <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanecdcstream--o-string--d-directory--r-integer--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:cert:unhardcode -f <filepath> -l <string> [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanecertunhardcode--f-filepath--l-string--u-string---apiversion-string---verbose---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:communities:activate -n <string> [-b] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanecommunitiesactivate--n-string--b--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:communities:describe [--store] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanecommunitiesdescribe---store--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:communities:json:modify -f <filepath> -p <string> [-i <string>] [--queryfield <string> | undefined | undefined] [--truncate | undefined] [-s <string>] [-w] [--wavename <string> [--wavetype <string> | undefined | [-t [-q <string> | -d <string> | --variable <string>]] | undefined | undefined]] [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanecommunitiesjsonmodify--f-filepath--p-string--i-string---queryfield-string--undefined--undefined---truncate--undefined--s-string--w---wavename-string---wavetype-string--undefined---t--q-string---d-string----variable-string--undefined--undefined--u-string---apiversion-string---verbose---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:communities:publish [-n <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanecommunitiespublish--n-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:communities:url [-p <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanecommunitiesurl--p-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:concierge:chat:enable [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneconciergechatenable--u-string---apiversion-string---verbose---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:connectedapp:attributes -n <string> -a <filepath> [-b] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneconnectedappattributes--n-string--a-filepath--b--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:connectedapp:uniquify -p <string> -a <filepath> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneconnectedappuniquify--p-string--a-filepath---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:contentasset:create -f <filepath> -n <string> [-l <string>] [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanecontentassetcreate--f-filepath--n-string--l-string--t-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:data:dates:update -r <date> [-d <directory>] [-o <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanedatadatesupdate--r-date--d-directory--o-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:data:favorite -w <string> -o <string> [--start] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanedatafavorite--w-string--o-string---start--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:data:file:download [-n <string> | -i <id>] [-f <string>] [-o <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanedatafiledownload--n-string---i-id--f-string--o-directory--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:data:file:upload -f <filepath> [-c -p <id>] [-n <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanedatafileupload--f-filepath--c--p-id--n-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:data:id:query -o <string> -w <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanedataidquery--o-string--w-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:data:tree:import -p <filepath> -d <directory> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanedatatreeimport--p-filepath--d-directory--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:events:stream [-e <string>] [-d <directory>] [-r <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneeventsstream--e-string--d-directory--r-integer--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:github:deploybutton -d <url> -b <url> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanegithubdeploybutton--d-url--b-url---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:github:package:install -g <string> -r <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanegithubpackageinstall--g-string--r-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:github:src:install -g <string> -r <string> [-p <directory>] [-k] [-c] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanegithubsrcinstall--g-string--r-string--p-directory--k--c--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:group:photo [-g <string>] [-f <filepath> | -b <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanegroupphoto--g-string--f-filepath---b-filepath--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:heroku:connect -a <string> -f <filepath> [-e <string>] [-p <string>] [-b] [-i] [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneherokuconnect--a-string--f-filepath--e-string--p-string--b--i--u-string---apiversion-string---verbose---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:heroku:repo:deploy -g <string> -r <string> [-n <string>] [-o <array>] [--envuser <string>] [--envpassword <string>] [-t <string>] [-d <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneherokurepodeploy--g-string--r-string--n-string--o-array---envuser-string---envpassword-string--t-string--d-integer--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:iot:activation -n <string> [-r] [-d] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneiotactivation--n-string--r--d--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:label:add -t <string> [--bundle <string>] [-n <string>] [-d <string>] [--protected] [--categories <array>] [-l <string>] [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanelabeladd--t-string---bundle-string--n-string--d-string---protected---categories-array--l-string--t-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:listview:secure [-d <directory>] [-o <directory>] [-p] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanelistviewsecure--d-directory--o-directory--p---verbose---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:lwc:create -n <string> -d <directory> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanelwccreate--n-string--d-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:lwc:css:merge -f <filepath> -c <directory> [-l <filepath>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanelwccssmerge--f-filepath--c-directory--l-filepath---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:mdapi:describe [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanemdapidescribe--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:mdapi:list -t <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanemdapilist--t-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:mdapi:package:get -p <string> [-t <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanemdapipackageget--p-string--t-directory--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:mdapi:package:xml -p <filepath> [-t <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanemdapipackagexml--p-filepath--t-directory--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:mdapi:pull [-c | --all] [-p | undefined] [--wave | undefined] [-s | undefined | -o <string>] [-i | undefined] [--reporting | undefined] [-t <string> | undefined] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanemdapipull--c----all--p--undefined---wave--undefined--s--undefined---o-string--i--undefined---reporting--undefined--t-string--undefined--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:mdapi:push [-d <directory>] [-k] [-r <directory>] [-w <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanemdapipush--d-directory--k--r-directory--w-integer--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:msgchannel:create -n <string> [-d <string>] [-t <directory>] [-e] [-f <array>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanemsgchannelcreate--n-string--d-string--t-directory--e--f-array---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:object:create [-t <string>] [-l <string>] [-a <string>] [-p <string>] [--description <string>] [--enterprise] [--sharingmodel <string>] [--activities] [--search] [--reports] [--history] [--feeds] [--nametype <string>] [--namefieldlabel <string>] [--autonumberformat <string>] [--visibility <string>] [--highvolume] [-i] [-d <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneobjectcreate--t-string--l-string--a-string--p-string---description-string---enterprise---sharingmodel-string---activities---search---reports---history---feeds---nametype-string---namefieldlabel-string---autonumberformat-string---visibility-string---highvolume--i--d-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:object:fat -o <string> [-m <integer>] [-y <integer>] [--description <string>] [-d <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneobjectfat--o-string--m-integer--y-integer---description-string--d-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:object:field [-o <string>] [-n <string>] [-a <string>] [-t <string>] [--description <string>] [--default <string>] [-r] [-u] [--externalid] [--trackhistory] [--helptext <string>] [-l <integer>] [-s <integer>] [--precision <integer>] [--lookupobject <string>] [--relname <string>] [--picklistvalues <array>] [--picklistdefaultfirst] [--indexposition <integer>] [--indexappend] [--indexdirection <string>] [--noindex] [-i] [-d <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneobjectfield--o-string--n-string--a-string--t-string---description-string---default-string--r--u---externalid---trackhistory---helptext-string--l-integer--s-integer---precision-integer---lookupobject-string---relname-string---picklistvalues-array---picklistdefaultfirst---indexposition-integer---indexappend---indexdirection-string---noindex--i--d-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:object:fields:describe -o <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneobjectfieldsdescribe--o-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:object:perms:align [-d <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneobjectpermsalign--d-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:object:powerofone -o <string> [-l <string>] [-a <string>] [-d <string>] [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneobjectpowerofone--o-string--l-string--a-string--d-string--t-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:object:recordtype -o <string> -l <string> [-n <string>] [-d <string>] [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneobjectrecordtype--o-string--l-string--n-string--d-string--t-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:object:tab -o <string> -i <integer> [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneobjecttab--o-string--i-integer--t-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:object:unperm -o <string> [-d <directory>] [-s <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneobjectunperm--o-string--d-directory--s-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:org:componentlibrary [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneorgcomponentlibrary--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:org:create --userprefix <string> -o <string> [-i <string>] [-f <filepath>] [-a <string>] [-d <integer>] [--wait <integer>] [-c] [-n] [-s] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneorgcreate---userprefix-string--o-string--i-string--f-filepath--a-string--d-integer---wait-integer--c--n--s---verbose---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:org:delete [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneorgdelete--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:org:domain:cors [--all] [--liveagent] [-t <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneorgdomaincors---all---liveagent--t-directory--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:org:domain:csp [--all] [--liveagent] [-t <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneorgdomaincsp---all---liveagent--t-directory--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:org:domain:verify [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneorgdomainverify--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:org:metadatacoverage [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneorgmetadatacoverage--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:org:reauth [-r] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneorgreauth--r--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:org:refreshtoken [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneorgrefreshtoken--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:package2:version:bump [-M | -m | -p] [-c] [-r] [-t <string>] [-v <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanepackage2versionbump--m---m---p--c--r--t-string--v-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:permset:check -o <string> [-f <string>] [--users | --permsets | --profiles] [--fieldlevel <string>] [--objectlevel <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanepermsetcheck--o-string--f-string---users----permsets----profiles---fieldlevel-string---objectlevel-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:permset:create -n <string> [-f <string> -o <string>] [-r <string> undefined] [-a <string>] [-d <directory>] [-t] [-c] [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanepermsetcreate--n-string--f-string--o-string--r-string-undefined--a-string--d-directory--t--c--u-string---apiversion-string---verbose---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:profile:convert -n <string> -p <string> [-d <directory>] [-e | -c] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneprofileconvert--n-string--p-string--d-directory--e---c---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:profile:whitelist -n <string> [-d <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneprofilewhitelist--n-string--d-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:project:create -n <string> [-g <string>] [-v <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneprojectcreate--n-string--g-string--v-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:remotesite:create -u <url> -n <string> [-d <string>] [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneremotesitecreate--u-url--n-string--d-string--t-directory---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:static:create -n <string> -y <string> [-d <string>] [-t <directory>] [-p] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanestaticcreate--n-string--y-string--d-string--t-directory--p---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:theme:activate -n <string> [-b] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanethemeactivate--n-string--b--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:tsp:username:update [-n <email>] [-d <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shanetspusernameupdate--n-email--d-directory--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:uiapi:objectinfo -o <string> [--outputfile <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneuiapiobjectinfo--o-string---outputfile-filepath--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:uiapi:record -r <string> -f <array> [--optionalfields <array>] [--outputfile <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneuiapirecord--r-string--f-array---optionalfields-array---outputfile-filepath--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:uiapi:recordui [-r <string> | --recordids <array>] [-l <array>] [-m <array>] [--outputfile <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneuiapirecordui--r-string----recordids-array--l-array--m-array---outputfile-filepath--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:user:allPhotos [-r <url>] [-f <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneuserallphotos--r-url--f-directory--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:user:lightning:debug [-g <string>] [-l <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneuserlightningdebug--g-string--l-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:user:loginurl [-p <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneuserloginurl--p-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:user:password:set -g <string> -l <string> -p <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneuserpasswordset--g-string--l-string--p-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:user:permset:assign -n <string> [-g <string> -l <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneuserpermsetassign--n-string--g-string--l-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:user:photo -l <string> [-g <string>] [-f <filepath> | -b <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneuserphoto--l-string--g-string--f-filepath---b-filepath--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
-   [`sfdx shane:user:psl -l <string> -n <filepath> [-g <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-shaneuserpsl--l-string--n-filepath--g-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx shane:ai:auth [-e <email>] [-f <filepath>] [-t <integer>] [-l <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

get an access token from an email and a .pem file, either passed in or from environment variables

```
USAGE
  $ sfdx shane:ai:auth [-e <email>] [-f <filepath>] [-t <integer>] [-l <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -e, --email=email                                                                 email address you used when you
                                                                                    signed up for your einstein.ai
                                                                                    account

  -f, --certfile=certfile                                                           path to your private key from when
                                                                                    you signed up

  -l, --level=local|global                                                          [default: local] where to store this
                                                                                    config

  -t, --tokentime=tokentime                                                         [default: 1440] time in minutes that
                                                                                    you want your token to be valid for

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:ai:auth -e shane.mclaughlin@salesforce.com -f ~/code/certs/einstein_platform.pem
       // reauths, and takes what it can get
```

_See code: [src/commands/shane/ai/auth.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/ai/auth.ts)_

## `sfdx shane:ai:dataset:delete -n <string> [-e <email>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

delete a dataset

```
USAGE
  $ sfdx shane:ai:dataset:delete -n <string> [-e <email>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -e, --email=email                                                                 email address you used when you
                                                                                    signed up for your einstein.ai
                                                                                    account

  -n, --dataset=dataset                                                             (required) dataset id

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:ai:dataset:delete -n 57
```

_See code: [src/commands/shane/ai/dataset/delete.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/ai/dataset/delete.ts)_

## `sfdx shane:ai:dataset:get -n <string> [-l] [-e <email>] [-p] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

get an access token from an email and a .pem file, either passed in or from environment variables

```
USAGE
  $ sfdx shane:ai:dataset:get -n <string> [-l] [-e <email>] [-p] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -e, --email=email                                                                 email address you used when you
                                                                                    signed up for your einstein.ai
                                                                                    account

  -l, --language                                                                    use the language endpoint instead of
                                                                                    vision

  -n, --dataset=dataset                                                             (required) dataset id

  -p, --poll                                                                        poll for the status to be completed

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:ai:dataset:get -n 57
```

_See code: [src/commands/shane/ai/dataset/get.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/ai/dataset/get.ts)_

## `sfdx shane:ai:dataset:upload [-n <string>] [-f <filepath>] [-p <string>] [-t <string>] [--train] [-e <email>] [-w <integer>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

upload a dataset

```
USAGE
  $ sfdx shane:ai:dataset:upload [-n <string>] [-f <filepath>] [-p <string>] [-t <string>] [--train] [-e <email>] [-w
  <integer>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -e, --email=email
      email address you used when you signed up for your einstein.ai account

  -f, --file=file
      Path to the .zip (image) or .csv/.tsv/.json (language) file on the local drive (FilePart). The maximum file size you
      can upload from a local drive is 50 MB for images, 25 MB for text

  -n, --name=name
      Name of the dataset. Optional. If this parameter is omitted, the dataset name is derived from the .zip file name.

  -p, --path=path
      URL of the .zip (image) or .csv/.tsv/.json (language) file. The maximum file size you can upload from a web location
      is 2 GB (images), 25MB (text)

  -t, --type=image|image-detection|image-multi-label|text-intent|text-sentiment
      [default: image] Type of dataset data. Valid values are:

  -w, --wait=wait
      [default: 10] how long to wait for this to process (minutes)

  --json
      format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)
      [default: warn] logging level for this command invocation

  --train
      train a model on the dataset

  --verbose
      emit additional command output to stdout

EXAMPLE
  sfdx shane:ai:dataset:upload -e shane.mclaughlin@salesforce.com -f ~/myPics.zip -n AwesomeDataset
```

_See code: [src/commands/shane/ai/dataset/upload.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/ai/dataset/upload.ts)_

## `sfdx shane:ai:playground:setup -f <filepath> [-e <email>] [-k <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

upload .pem file from local encrypted copy, setup username and secret key in custom setting

```
USAGE
  $ sfdx shane:ai:playground:setup -f <filepath> [-e <email>] [-k <string>] [-u <string>] [--apiversion <string>]
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -e, --email=email                                                                 email address you used when you
                                                                                    signed up for your einstein.ai
                                                                                    account.  Defaults to EINSTEIN_EMAIL
                                                                                    from the environment

  -f, --file=file                                                                   (required) encrypted file from local
                                                                                    filesystem

  -k, --key=key                                                                     encoding key used to encrypt/decrypt
                                                                                    the file.  Defaults to
                                                                                    AI_PLAYGROUND_SETUP_KEY from the
                                                                                    environment

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:ai:playground:setup -f my.pem -e shane.mclaughlin@salesforce.com -k yay9HVn68GzXrqhT0HWkoQ==
```

_See code: [src/commands/shane/ai/playground/setup.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/ai/playground/setup.ts)_

## `sfdx shane:ai:playground:setupHeroku [-a <string>] [-c] [-k] [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

provisions a new einstein.ai account and sets up the org

```
USAGE
  $ sfdx shane:ai:playground:setupHeroku [-a <string>] [-c] [-k] [-u <string>] [--apiversion <string>] [--verbose]
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --app=app                                                                     name of the heroku app that we
                                                                                    attach add-ons to

  -c, --create                                                                      create the app

  -k, --keepauth                                                                    save the refresh token for
                                                                                    einstein.ai to the local sfdx store
                                                                                    for future cli use

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --verbose                                                                         emit additional command output to
                                                                                    stdout

EXAMPLES
  sfdx shane:ai:playground:herokuSetup -a my-existing-app
       // creates addons to existing app

  sfdx shane:ai:playground:herokuSetup -c
       // creates an app with whatever name heroku feels like

  sfdx shane:ai:playground:herokuSetup -a non-existing-app -c
       // creates a new app with the name of your choice (usually build dynamically!)
```

_See code: [src/commands/shane/ai/playground/setupHeroku.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/ai/playground/setupHeroku.ts)_

## `sfdx shane:analytics:app:share -n <string> [--allprm -c] [--allcsp undefined] [--org] [-t <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

share an analytics app by name

```
USAGE
  $ sfdx shane:analytics:app:share -n <string> [--allprm -c] [--allcsp undefined] [--org] [-t <string>] [-u <string>]
  [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --community                                                                   enable community sharing
  -n, --name=name                                                                   (required) name of the analytics app
  -t, --type=View|Edit|Manage                                                       [default: View] access level

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --allcsp                                                                          share with all customer portal users

  --allprm                                                                          share with all partner users

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --org                                                                             share with all internal users

EXAMPLE
  sfdx shane:analytics:app:share -n SharedApp --allprm -c
  // share the standard SharedApp with all partners view level perms (default) and check the "enable sharing with
  communities" box for this app
```

_See code: [src/commands/shane/analytics/app/share.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/analytics/app/share.ts)_

## `sfdx shane:analytics:community:enable [-b] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Activate a community using a headless browser

```
USAGE
  $ sfdx shane:analytics:community:enable [-b] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --showbrowser                                                                 show the browser...useful for local
                                                                                    debugging

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

ALIASES
  $ sfdx shane:communities:analytics:enable
```

_See code: [src/commands/shane/analytics/community/enable.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/analytics/community/enable.ts)_

## `sfdx shane:analytics:dataflow:start [-n <string>] [-i <id>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

start an analytics dataflow by name/label/id

```
USAGE
  $ sfdx shane:analytics:dataflow:start [-n <string>] [-i <id>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -i, --id=id                                                                       the id of the dataflow

  -n, --name=name                                                                   name or label of the analytics app
                                                                                    (will match either)

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:analytics:dataflow:start -n MyDataFlowName
  // enqueue a job for the the analytics dataflow with name/label MyDataFlowName (will not wait for completion of the
  dataflow)
```

_See code: [src/commands/shane/analytics/dataflow/start.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/analytics/dataflow/start.ts)_

## `sfdx shane:analytics:dataset:download [-i <id>] [-n <string>] [--versionid <string>] [-t <filepath>] [-r <number>] [-o <number>] [-b <number>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

download a dataset as csv

```
USAGE
  $ sfdx shane:analytics:dataset:download [-i <id>] [-n <string>] [--versionid <string>] [-t <filepath>] [-r <number>]
  [-o <number>] [-b <number>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --batchsize=batchsize                                                         [default: 1000000000] maximum
                                                                                    batchsize. Splits query in parts of
                                                                                    this size.

  -i, --id=id                                                                       dataset id

  -n, --name=name                                                                   dataset name

  -o, --offset=offset                                                               offset for rows

  -r, --rows=rows                                                                   [default: 1000000000] how many rows?

  -t, --target=target                                                               [default: .] where you want to save
                                                                                    the file

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --versionid=versionid                                                             specify a version

EXAMPLES
  sfdx shane:analytics:dataset:download -n YourDataSetName -t myLocalFolder
  sfdx shane:analytics:dataset:download -i 0Fb6A000000gDFxSAM --versionid 0Fc6A000002d8GwSAI -t myLocalFolder -r 10000
  -b 5000
```

_See code: [src/commands/shane/analytics/dataset/download.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/analytics/dataset/download.ts)_

## `sfdx shane:analytics:dataset:list [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

what analytics datasets are in my org?

```
USAGE
  $ sfdx shane:analytics:dataset:list [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:analytics:dataset:list
```

_See code: [src/commands/shane/analytics/dataset/list.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/analytics/dataset/list.ts)_

## `sfdx shane:analytics:dataset:upload -n <string> -f <filepath> [-a <string>] [-m <filepath>] [-o <string>] [--async] [-d <integer>] [--serial] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

upload a dataset from csv

```
USAGE
  $ sfdx shane:analytics:dataset:upload -n <string> -f <filepath> [-a <string>] [-m <filepath>] [-o <string>] [--async]
  [-d <integer>] [--serial] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --app=app
      app name

  -d, --uploadinterval=uploadinterval
      [default: 500] milliseconds between uploaded chunks...increase this if you get strange errors during file uploads
      like "write EPIPE"

  -f, --csvfile=csvfile
      (required) local csv file containing the data

  -m, --metajson=metajson
      path to json file for describing your upload (highly recommended)

  -n, --name=name
      (required) dataset name--no spaces, should be like an api name

  -o, --operation=Append|Overwrite|Upsert|Delete
      [default: Overwrite] what to do with the dataset if it already exists.  See
      https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_ext_data.meta/bi_dev_guide_ext_data/bi_ext_data_objec
      t_externaldata.htm

  -u, --targetusername=targetusername
      username or alias for the target org; overrides default target org

  --apiversion=apiversion
      override the api version used for api requests made by this command

  --async
      do not wait for successful completion of the dataset upload...just return and hope for the best.  If omitted, will
      poll the analytics rest API for job processing status until complete

  --json
      format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)
      [default: warn] logging level for this command invocation

  --serial
      chunks are uploaded with no parallelization to prevent locking issues

EXAMPLES
  sfdx shane:analytics:dataset:upload -n someName -f data/myFile.csv -m myMetaFile.json
  sfdx shane:analytics:dataset:upload -n someName -f data/myFile.csv -m myMetaFile.json -a SharedApp  --async
```

_See code: [src/commands/shane/analytics/dataset/upload.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/analytics/dataset/upload.ts)_

## `sfdx shane:cdc:create -d <directory> [--batchsize <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

```
USAGE
  $ sfdx shane:cdc:create -d <directory> [--batchsize <integer>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --dir=dir                                                                     (required) folder to upload,
                                                                                    containing /cdc/records

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --batchsize=batchsize                                                             [default: 200] how many records to
                                                                                    insert in a batch

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/shane/cdc/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/cdc/create.ts)_

## `sfdx shane:cdc:prep -d <directory> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

```
USAGE
  $ sfdx shane:cdc:prep -d <directory> [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --dir=dir                                                                     (required) folder to upload,
                                                                                    containing /cdc/records

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/shane/cdc/prep.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/cdc/prep.ts)_

## `sfdx shane:cdc:stream [-o <string>] [-d <directory>] [-r <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

```
USAGE
  $ sfdx shane:cdc:stream [-o <string>] [-d <directory>] [-r <integer>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --dir=dir                                                                     stream the events to a folder
                                                                                    instead of the console

  -o, --object=object                                                               subscribe to change events for only
                                                                                    a single object (api name, including
                                                                                    __c)

  -r, --replay=replay                                                               [default: -1] replay Id to begin
                                                                                    from

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:cdc:stream // get all the change events
  sfdx shane:cdc:stream -o Account // get all the change events on a single object
  sfdx shane:cdc:stream -d myDir // stream change events to myDir/cdc, organized into folders by object api type
```

_See code: [src/commands/shane/cdc/stream.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/cdc/stream.ts)_

## `sfdx shane:cert:unhardcode -f <filepath> -l <string> [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

modify local xml files with data from org to work around hardcoded metadata issues

```
USAGE
  $ sfdx shane:cert:unhardcode -f <filepath> -l <string> [-u <string>] [--apiversion <string>] [--verbose] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --samlfile=samlfile                                                           (required) full path to the
                                                                                    samlssoconfig file.  Will be
                                                                                    modified by this process

  -l, --label=label                                                                 (required) masterLabel of the cert
                                                                                    whose Id you need

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --verbose                                                                         emit additional command output to
                                                                                    stdout
```

_See code: [src/commands/shane/cert/unhardcode.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/cert/unhardcode.ts)_

## `sfdx shane:communities:activate -n <string> [-b] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Activate a community using a headless browser

```
USAGE
  $ sfdx shane:communities:activate -n <string> [-b] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --showbrowser                                                                 show the browser...useful for local
                                                                                    debugging

  -n, --name=name                                                                   (required) name of the community to
                                                                                    activate

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/shane/communities/activate.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/communities/activate.ts)_

## `sfdx shane:communities:describe [--store] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

tell me about the communities in the org, and optionally store the description

```
USAGE
  $ sfdx shane:communities:describe [--store] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --store                                                                           store the community description in
                                                                                    externalApps.json

EXAMPLE
  sfdx shane:communities:describe
```

_See code: [src/commands/shane/communities/describe.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/communities/describe.ts)_

## `sfdx shane:communities:json:modify -f <filepath> -p <string> [-i <string>] [--queryfield <string> | undefined | undefined] [--truncate | undefined] [-s <string>] [-w] [--wavename <string> [--wavetype <string> | undefined | [-t [-q <string> | -d <string> | --variable <string>]] | undefined | undefined]] [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Manipulate community ExperienceBundle JSON files, using REST or Tooling queries to an org to get metadata IDs

```
USAGE
  $ sfdx shane:communities:json:modify -f <filepath> -p <string> [-i <string>] [--queryfield <string> | undefined |
  undefined] [--truncate | undefined] [-s <string>] [-w] [--wavename <string> [--wavetype <string> | undefined | [-t [-q
  <string> | -d <string> | --variable <string>]] | undefined | undefined]] [-u <string>] [--apiversion <string>]
  [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --value=value                                                                 new value for the
                                                                                    property/subproperty

  -f, --file=file                                                                   (required) full path to the file

  -i, --id=id                                                                       unique id of the component.  ex:
                                                                                    69c03077-932a-4c08-b932-46baec5a7c86

  -p, --property=property                                                           (required) property that will be
                                                                                    updated (or contains JSON or what
                                                                                    will be updated

  -q, --query=query                                                                 soql query for a field to pass to
                                                                                    the value

  -s, --subproperty=subproperty                                                     if the property is a json object, or
                                                                                    json-like string, the subproperty
                                                                                    inside that that needs updating

  -t, --tooling                                                                     using tooling api for query instead
                                                                                    of normal sobjects

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -w, --write                                                                       write over the original file with
                                                                                    its new version.  omit to see what
                                                                                    will be written

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --queryfield=queryfield                                                           [default: Id] field from the record
                                                                                    returned by --query that you want to
                                                                                    use the value from

  --truncate                                                                        truncate ids to 15 characters on
                                                                                    queried record

  --variable=OrgId|InstanceUrl|Username                                             assign one of the variables to the
                                                                                    property

  --verbose                                                                         emit additional command output to
                                                                                    stdout

  --wavename=wavename                                                               name to match from wave api

  --wavetype=dashboards                                                             part of the wave api endpoint

EXAMPLES
  sfdx shane:communities:json:modify -f force-app/main/default/experiences/employeebots1/views/home.json -i
  69c03077-932a-4c08-b932-46baec5a7c86 -p someProp  -v NewValue
  // find the component and set a new hardcoded value for the property but don't write to the file

  sfdx shane:communities:json:modify -f force-app/main/default/experiences/employeebots1/views/home.json -i
  69c03077-932a-4c08-b932-46baec5a7c86 -p orgId  -q "select id from organization" --write
  // find the component and set a new value from a query to the org and update file locally

  sfdx shane:communities:json:modify -f force-app/main/default/experiences/employeebots1/views/home.json -i
  69c03077-932a-4c08-b932-46baec5a7c86 -p someUnconvertedJSON -s actualPropInsideTheJSON -q "select id from
  organization" -t --write
  // find the component and set a new value from a query onto a property contained within unconverted JSON using the
  tooling api and update file locally
```

_See code: [src/commands/shane/communities/json/modify.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/communities/json/modify.ts)_

## `sfdx shane:communities:publish [-n <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Publish a community using a headless browser

```
USAGE
  $ sfdx shane:communities:publish [-n <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -n, --name=name                                                                   name of the community to publish
                                                                                    (case sensitive!)

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:communities:publish
  // publishes all the communities in the org

  sfdx shane:communities:publish -n customer
  // finds a community named customer, publishes it.
```

_See code: [src/commands/shane/communities/publish.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/communities/publish.ts)_

## `sfdx shane:communities:url [-p <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

get me the login for a community from an org

```
USAGE
  $ sfdx shane:communities:url [-p <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -p, --prefix=prefix                                                               community prefix (thing after the
                                                                                    slash in the url)

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:communities:url --prefix dealers
```

_See code: [src/commands/shane/communities/url.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/communities/url.ts)_

## `sfdx shane:concierge:chat:enable [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Modify custom settings to enable live agent chat for Concierge

```
USAGE
  $ sfdx shane:concierge:chat:enable [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --verbose                                                                         emit additional command output to
                                                                                    stdout
```

_See code: [src/commands/shane/concierge/chat/enable.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/concierge/chat/enable.ts)_

## `sfdx shane:connectedapp:attributes -n <string> -a <filepath> [-b] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Set attributes on a connected app. Attributes for salesforce mobile app at https://github.com/gabesumner/mobile-security/blob/master/customAttributes.json

```
USAGE
  $ sfdx shane:connectedapp:attributes -n <string> -a <filepath> [-b] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --attributes=attributes                                                       (required) json formatted file of
                                                                                    key/values

  -b, --showbrowser                                                                 show the browser...useful for local
                                                                                    debugging

  -n, --name=name                                                                   (required) name of the connected app

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:connectedapp:attributes -n AppAPIName -a attributes.json
```

_See code: [src/commands/shane/connectedapp/attributes.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/connectedapp/attributes.ts)_

## `sfdx shane:connectedapp:uniquify -p <string> -a <filepath> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

modify a clientId/consumerKey on a local connected app to guaranatee uniqueness

```
USAGE
  $ sfdx shane:connectedapp:uniquify -p <string> -a <filepath> [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --app=app                                                                     (required) full path to your
                                                                                    connected app locally

  -p, --prefix=prefix                                                               (required) add a prefix to the
                                                                                    connected app's consumerKey

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:connectedapp:uniquify -a force-app/main/default/connectedApps/myConnectedApp.connectedApp-meta.xml -p 5h4n3
  // update the consumerKey of myConnectedApp to be unique, but start with 5h4n3
```

_See code: [src/commands/shane/connectedapp/uniquify.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/connectedapp/uniquify.ts)_

## `sfdx shane:contentasset:create -f <filepath> -n <string> [-l <string>] [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create a ContentAsset from a local image file

```
USAGE
  $ sfdx shane:contentasset:create -f <filepath> -n <string> [-l <string>] [-t <directory>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --file=file                                                                   (required) the file you want to turn
                                                                                    into an asset

  -l, --language=language                                                           [default: en_US] language code like
                                                                                    en_US

  -n, --name=name                                                                   (required) api name for the
                                                                                    contentAsset

  -t, --target=target                                                               [default: force-app/main/default]
                                                                                    where to find the contentassets
                                                                                    folder (will create if it doesn't
                                                                                    exist already)

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:contentasset:create -f ~/somefile.jpg -n MyContentAsset
  // create a contentAsset called MyContentAsset from the local file
```

_See code: [src/commands/shane/contentasset/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/contentasset/create.ts)_

## `sfdx shane:data:dates:update -r <date> [-d <directory>] [-o <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

go through a folder of csv files and modify all the dates relative to a given date

```
USAGE
  $ sfdx shane:data:dates:update -r <date> [-d <directory>] [-o <directory>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --datafolder=datafolder                                                       [default: data] Where is all this
                                                                                    data?

  -o, --outputfolder=outputfolder                                                   [default: data-modified] where to
                                                                                    output the modified CSV files

  -r, --relative=relative                                                           (required) the date to adjust all
                                                                                    other dates relative to.  example:
                                                                                    if "relative" is 8 days ago, then
                                                                                    all dates are moved forward 8 days

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:data:dates:update -r 1-1-2020
  // move all dates in .csv files in /data by the difference between now and 1-1-2020
```

_See code: [src/commands/shane/data/dates/update.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/data/dates/update.ts)_

## `sfdx shane:data:favorite -w <string> -o <string> [--start] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

query records and set the match as a favorite

```
USAGE
  $ sfdx shane:data:favorite -w <string> -o <string> [--start] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -o, --object=object                                                               (required) object API name
                                                                                    (including __c if custom)

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -w, --where=where                                                                 (required) SOQL where clause to
                                                                                    match a single record

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --start                                                                           add the favorite at the beginning of
                                                                                    the menu

ALIASES
  $ sfdx shane:data:favourite

EXAMPLE
  sfdx shane:data:favorite -o Account -w "name='Salesforce.com'"
  // finds the matching record and adds it to the end of the favorites menu
```

_See code: [src/commands/shane/data/favorite.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/data/favorite.ts)_

## `sfdx shane:data:file:download [-n <string> | -i <id>] [-f <string>] [-o <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

save a file from the org to the local filesystem

```
USAGE
  $ sfdx shane:data:file:download [-n <string> | -i <id>] [-f <string>] [-o <directory>] [-u <string>] [--apiversion
  <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --filename=filename                                                           optional filename.  Defaults to the
                                                                                    filename of the contentVersion to
                                                                                    download

  -i, --id=id                                                                       optional ContentDocument ID or
                                                                                    ContentVersion ID that should be
                                                                                    downloaded

  -n, --name=name                                                                   name of the file in Salesforce that
                                                                                    you want to download

  -o, --directory=directory                                                         [default: .] optional output path to
                                                                                    save the file, if omitted will save
                                                                                    to current directory, if directory
                                                                                    then it will keep the filename and
                                                                                    save into that directory

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:data:file:download -i 0691k000000MXfkAAG -o ./files/
       // save a ContentDocument from the org to the files directory, keeping the existing filename
  sfdx shane:data:file:download -i 0691k000000MXfkAAG -o ./files/King.jpg
       // save a ContentDocument from the org to files/King.jpg
  sfdx shane:data:file:download -i 0691k000000MXfkAAG
       // save a ContentDocument from the org to the current working directory, keeping the existing filename
  sfdx shane:data:file:download -i 0681k000000MXfkAAG -o ./files/King.jpg
       // save a ContentVersion from the org to files/King.jpg
  sfdx shane:data:file:download -n King
       // go find the file named kind and download the latest version of it.
```

_See code: [src/commands/shane/data/file/download.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/data/file/download.ts)_

## `sfdx shane:data:file:upload -f <filepath> [-c -p <id>] [-n <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

upload a file from local resources, optionally as a chatter post or attached file on a record

```
USAGE
  $ sfdx shane:data:file:upload -f <filepath> [-c -p <id>] [-n <string>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --chatter                                                                     attach as a chatter content post
                                                                                    instead of just as a file

  -f, --file=file                                                                   (required) path to file on local
                                                                                    filesystem

  -n, --name=name                                                                   set the name of the uploaded file

  -p, --parentid=parentid                                                           optional record ID that the file
                                                                                    should be attached to

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

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

_See code: [src/commands/shane/data/file/upload.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/data/file/upload.ts)_

## `sfdx shane:data:id:query -o <string> -w <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

query some object and get back the id of the matching record

```
USAGE
  $ sfdx shane:data:id:query -o <string> -w <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -o, --object=object                                                               (required) object

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -w, --where=where                                                                 (required) SOQL where clause for
                                                                                    your query

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:data:id:query -o User -u platformers -w "Firstname = 'Shane' and Lastname = 'McLaughlin' and username =
  'shane@platformers.org'"'
       // returns the id of the user. Use these ids between `` in other commands
```

_See code: [src/commands/shane/data/id/query.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/data/id/query.ts)_

## `sfdx shane:data:tree:import -p <filepath> -d <directory> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

similar to the original tree:import, but handles more than 200 records at a go, while still preserving relationships. Takes longer.

```
USAGE
  $ sfdx shane:data:tree:import -p <filepath> -d <directory> [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --filesfolder=filesfolder                                                     (required) folder that the plan
                                                                                    lives in

  -p, --plan=plan                                                                   (required) location of plan file

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:data:tree:import -p data/myPlan.json -d data/  // run all the data in the plan, and files mentioned are
  relative to ./data
```

_See code: [src/commands/shane/data/tree/import.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/data/tree/import.ts)_

## `sfdx shane:events:stream [-e <string>] [-d <directory>] [-r <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

```
USAGE
  $ sfdx shane:events:stream [-e <string>] [-d <directory>] [-r <integer>] [-u <string>] [--apiversion <string>]
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --dir=dir                                                                     stream the events to a folder
                                                                                    instead of the console

  -e, --event=event                                                                 the platform event's api name

  -r, --replay=replay                                                               [default: -1] replay Id to begin
                                                                                    from

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:events:stream -e SomeEvent__e // subscribe to an event stream
  sfdx shane:events:stream -e SomeEvent__e -d myDir // stream events to myDir
```

_See code: [src/commands/shane/events/stream.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/events/stream.ts)_

## `sfdx shane:github:deploybutton -d <url> -b <url> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

modify your local readme file to include a deployer link/button

```
USAGE
  $ sfdx shane:github:deploybutton -d <url> -b <url> [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --button=button
      (required) [default:
      https://raw.githubusercontent.com/mshanemc/deploy-to-sfdx/master/client-src/resources/images/sfdx_it_now.png] the
      public url where your button lives

  -d, --deployer=deployer
      (required) [default: https://hosted-scratch.herokuapp.com/] the base url for your deployer

  --json
      format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)
      [default: warn] logging level for this command invocation
```

_See code: [src/commands/shane/github/deploybutton.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/github/deploybutton.ts)_

## `sfdx shane:github:package:install -g <string> -r <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

installs a package from github using the sfdx-project.json file (v43+) OR the latestVersion.json file convention

```
USAGE
  $ sfdx shane:github:package:install -g <string> -r <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -g, --githubuser=githubuser                                                       (required) github username where the
                                                                                    package lives

  -r, --repo=repo                                                                   (required) repo where the packages
                                                                                    lives

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:github:package:install -g someUser -r someRepo -u someOrg
  // installs packageVersion (04t) from https://github.com/someUser/someRepo/sfdx-project.json or
  https://github.com/someUser/someRepo/latestVersion.json
```

_See code: [src/commands/shane/github/package/install.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/github/package/install.ts)_

## `sfdx shane:github:src:install -g <string> -r <string> [-p <directory>] [-k] [-c] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

installs a package from github from mdapi src

```
USAGE
  $ sfdx shane:github:src:install -g <string> -r <string> [-p <directory>] [-k] [-c] [-u <string>] [--apiversion
  <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --convert                                                                     the path folder is sfdx format, not
                                                                                    mdapi, and should be converted first

  -g, --githubuser=githubuser                                                       (required) github username where the
                                                                                    package lives

  -k, --keeplocally                                                                 keep the cloned repo in local source
                                                                                    instead of deleting it

  -p, --path=path                                                                   [default: src] folder where the
                                                                                    source lives

  -r, --repo=repo                                                                   (required) repo where the packages
                                                                                    lives

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:github:src:install -g someUser -r someRepo -u someOrg
  // pulls mdapi-formatted code from https://github.com/someUser/someRepo/src and deploys to the org

  sfdx shane:github:src:install -g someUser -r someRepo -u someOrg -p my/folder/tree
  // pulls mdapi-formatted code from https://github.com/someUser/someRepo/my/folder/tree and deploys to the org
```

_See code: [src/commands/shane/github/src/install.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/github/src/install.ts)_

## `sfdx shane:group:photo [-g <string>] [-f <filepath> | -b <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Set the photo for a user by first/last name

```
USAGE
  $ sfdx shane:group:photo [-g <string>] [-f <filepath> | -b <filepath>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --banner=banner                                                               local path of the chatter banner
                                                                                    photo to use

  -f, --file=file                                                                   local path of the photo to use

  -g, --group=group                                                                 the name of the group name you want
                                                                                    to set the photo/banner for

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:group:photo -g AwesomePeople -f ~/Downloads/King.png
  // sets the chatter photo for the group named AwesomePeople using the local file

  sfdx shane:group:photo -b ~/Downloads/King.png -g AwesomePeople
  // sets the chatter banner photo for the group named AwesomePeople using the local file
```

_See code: [src/commands/shane/group/photo.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/group/photo.ts)_

## `sfdx shane:heroku:connect -a <string> -f <filepath> [-e <string>] [-p <string>] [-b] [-i] [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

set up heroku connect on an existing app to an existing org (that you may have just created)

```
USAGE
  $ sfdx shane:heroku:connect -a <string> -f <filepath> [-e <string>] [-p <string>] [-b] [-i] [-u <string>]
  [--apiversion <string>] [--verbose] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --app=app
      (required) name of the heroku app

  -b, --showbrowser
      show the browser...useful for local debugging

  -e, --environment=sandbox|production|custom
      [default: custom] environment of the salesforce org

  -f, --configfile=configfile
      (required) path to the json file exported from Heroku Connect

  -i, --instance
      salesforce instance for making login easier.  Will be read from org:display if exists...this is the override

  -p, --password=password
      pass in a password to override the one associated with your org in sfdx, or if you don't have one set properly (like
      you used `shane:user:password:set` instead of `force:user:password:generate

  -u, --targetusername=targetusername
      username or alias for the target org; overrides default target org

  --apiversion=apiversion
      override the api version used for api requests made by this command

  --json
      format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)
      [default: warn] logging level for this command invocation

  --verbose
      emit additional command output to stdout

EXAMPLES
  sfdx shane:heroku:connect -a prosaic-samurai-4564 -f assets/myConfig.json
  // auth the heroku app to the current default org, assuming password is available from force:org:display, then import
  the json config file

  sfdx shane:heroku:connect -a prosaic-samurai-4564 -f assets/myConfig.json -p p455w0rd -u myother@scratch.org
  // same, but not the default org, with a specified password
```

_See code: [src/commands/shane/heroku/connect.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/heroku/connect.ts)_

## `sfdx shane:heroku:repo:deploy -g <string> -r <string> [-n <string>] [-o <array>] [--envuser <string>] [--envpassword <string>] [-t <string>] [-d <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

deploy a heroku app that has a valid app.json.

```
USAGE
  $ sfdx shane:heroku:repo:deploy -g <string> -r <string> [-n <string>] [-o <array>] [--envuser <string>] [--envpassword
  <string>] [-t <string>] [-d <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --days=days                                                                   [default: 1] days you want the
                                                                                    heroku app to live (does nothing
                                                                                    locally)

  -g, --githubuser=githubuser                                                       (required) github username where the
                                                                                    app lives

  -n, --name=name                                                                   what do you want to Heroku app to be
                                                                                    named

  -o, --overrides=overrides                                                         an array of key-value pairs, like
                                                                                    SOME_VAR="some Value" (use quotes
                                                                                    where string have spaces!)

  -r, --repo=repo                                                                   (required) repo where the app lives

  -t, --team=team                                                                   assign this new app to an existing
                                                                                    heroku team

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --envpassword=envpassword                                                         grab the default scratch org
                                                                                    password and set it to this Heroku
                                                                                    environment var

  --envuser=envuser                                                                 grab the default scratch org
                                                                                    username and set it to this Heroku
                                                                                    environment var

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:heroku:repo:deploy -g someUser -r someRepo
  // deploys code from https://github.com/someUser/someRepo that has a valid app.json
```

_See code: [src/commands/shane/heroku/repo/deploy.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/heroku/repo/deploy.ts)_

## `sfdx shane:iot:activation -n <string> [-r] [-d] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Activate an iot orchestration by name

```
USAGE
  $ sfdx shane:iot:activation -n <string> [-r] [-d] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --deactivate                                                                  deactivate the orchestration

  -n, --name=name                                                                   (required) API name of the
                                                                                    orchestration

  -r, --reset                                                                       reset all instances of the
                                                                                    orchestration

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:iot:activate -n orchName -r
  // activates the orchestration, including the context if necessary, optionally resetting all the instances

  sfdx shane:iot:activate -n orchName -d
  // deactivates the orchestration, without resetting all the instances
```

_See code: [src/commands/shane/iot/activation.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/iot/activation.ts)_

## `sfdx shane:label:add -t <string> [--bundle <string>] [-n <string>] [-d <string>] [--protected] [--categories <array>] [-l <string>] [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create a remote site setting in the local source. Push it when you're done

```
USAGE
  $ sfdx shane:label:add -t <string> [--bundle <string>] [-n <string>] [-d <string>] [--protected] [--categories
  <array>] [-l <string>] [-t <directory>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --description=description                                                     description for your label
  -l, --language=language                                                           [default: en_US] language code
  -n, --name=name                                                                   api name for your label

  -t, --target=target                                                               [default: force-app/main/default]
                                                                                    where to create the folder (if it
                                                                                    doesn't exist already) and
                                                                                    file...defaults to
                                                                                    force-app/main/default

  -t, --text=text                                                                   (required) the text you want to turn
                                                                                    into a label

  --bundle=bundle                                                                   [default: CustomLabels] label bundle
                                                                                    when you want to organize them more

  --categories=categories                                                           categories to add to your custom
                                                                                    label

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --protected                                                                       mark as protected (packaged,
                                                                                    subscribers cannot change the label

EXAMPLE
  sfdx shane:label:add -t "This is some Text"
  // create a custom label with the displayed text and all the defaults
```

_See code: [src/commands/shane/label/add.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/label/add.ts)_

## `sfdx shane:listview:secure [-d <directory>] [-o <directory>] [-p] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Find list views that are shared everywhere and makes them shared internally only. Local source modification only--to use this command to fix an entire org, retrieve all your objects and then deploy the updated files

```
USAGE
  $ sfdx shane:listview:secure [-d <directory>] [-o <directory>] [-p] [--verbose] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --directory=directory                                                         [default: force-app/main/default]
                                                                                    Where is all this metadata? defaults
                                                                                    to force-app/main/default

  -o, --object=object                                                               only modify list views for a single
                                                                                    object.  Api name, including __c if
                                                                                    custom

  -p, --noprompt                                                                    Do not prompt for confirmation

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --verbose                                                                         emit additional command output to
                                                                                    stdout

EXAMPLES
  sfdx shane:listview:secure -o Account
  // add 'all internal users' sharing to any list view on Account without defined sharing

  sfdx shane:listview:secure
  // add 'all internal users' sharing to any list view in local source without defined sharing
```

_See code: [src/commands/shane/listview/secure.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/listview/secure.ts)_

## `sfdx shane:lwc:create -n <string> -d <directory> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create a lwc locally without need for sfdx project

```
USAGE
  $ sfdx shane:lwc:create -n <string> -d <directory> [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --directory=directory                                                         (required) where to create the new
                                                                                    lwc's folder

  -n, --name=name                                                                   (required) name it
                                                                                    headsDownCamelCase

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:lwc:create -n someLWC -d modules/namespace
  // creates lwc in the given folder path
```

_See code: [src/commands/shane/lwc/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/lwc/create.ts)_

## `sfdx shane:lwc:css:merge -f <filepath> -c <directory> [-l <filepath>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

take css from existing file(s), extract component-level relevant selectors and save to a LWC's css file

```
USAGE
  $ sfdx shane:lwc:css:merge -f <filepath> -c <directory> [-l <filepath>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --component=component                                                         (required) component directory where
                                                                                    template and js live

  -f, --file=file                                                                   (required) file containing all css
                                                                                    selectors to select from

  -l, --localcss=localcss                                                           local css file to merge with
                                                                                    contents of --file

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:lwc:css:merge -c modules/namespace/myComp -f some/big_file.css
  // overwrites modules/namespace/myComp/myComp.css with relevant css selectors from big_file.css

  sfdx shane:lwc:css:merge -c modules/namespace/myComp -f some/big_file.css -l modules/namespace/myComp/local.css
  // overwrites modules/namespace/myComp/myComp.css with relevant css selectors from big_file.css PLUS any relevant
  selectors from modules/namespace/myComp/local.css
```

_See code: [src/commands/shane/lwc/css/merge.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/lwc/css/merge.ts)_

## `sfdx shane:mdapi:describe [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

what's in the org?

```
USAGE
  $ sfdx shane:mdapi:describe [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:mdapi:describe -u someOrg
  // list the metadata available in the org
```

_See code: [src/commands/shane/mdapi/describe.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/mdapi/describe.ts)_

## `sfdx shane:mdapi:list -t <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

what's in the org?

```
USAGE
  $ sfdx shane:mdapi:list -t <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -t, --type=type                                                                   (required) pull only a specific
                                                                                    type.  See the metadata api docs for
                                                                                    type names

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:mdapi:list -u someOrg -t CustomObject
  // what metadata exists for a specific type
```

_See code: [src/commands/shane/mdapi/list.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/mdapi/list.ts)_

## `sfdx shane:mdapi:package:get -p <string> [-t <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Gets package from an org, converts, and merges it into the local source

```
USAGE
  $ sfdx shane:mdapi:package:get -p <string> [-t <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -p, --packagename=packagename                                                     (required) the name of the package
                                                                                    you want to retrieve

  -t, --target=target                                                               [default: force-app] where to
                                                                                    convert the result to...defaults to
                                                                                    force-app

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:mdapi:package:get -p MyPkg -u someOrg
  // pulls a package from the org and converts/merges it into force-app

  sfdx shane:mdapi:package:get -p MyPkg -u someOrg -t someDir
  // pulls a package from the org and converts/merges it into /someDir
```

_See code: [src/commands/shane/mdapi/package/get.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/mdapi/package/get.ts)_

## `sfdx shane:mdapi:package:xml -p <filepath> [-t <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

gets metadata form an org based on a local package.xml, converts, and merges it into the local source

```
USAGE
  $ sfdx shane:mdapi:package:xml -p <filepath> [-t <directory>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -p, --xmlpath=xmlpath                                                             (required) the location of the
                                                                                    package.xml you want to use

  -t, --target=target                                                               [default: force-app] where to
                                                                                    convert the result to...defaults to
                                                                                    force-app

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:mdapi:package:xml -p someFolder/package.xml -u someOrg
  // pulls a metadat from the org and converts/merges it into force-app

  sfdx shane:mdapi:package:xml -p someFolder/package.xml -u someOrg -t someDir
  // pulls a package from the org and converts/merges it into /someDir
```

_See code: [src/commands/shane/mdapi/package/xml.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/mdapi/package/xml.ts)_

## `sfdx shane:mdapi:pull [-c | --all] [-p | undefined] [--wave | undefined] [-s | undefined | -o <string>] [-i | undefined] [--reporting | undefined] [-t <string> | undefined] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

gets unpackaged metadata for you

```
USAGE
  $ sfdx shane:mdapi:pull [-c | --all] [-p | undefined] [--wave | undefined] [-s | undefined | -o <string>] [-i |
  undefined] [--reporting | undefined] [-t <string> | undefined] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --code                                                                        ApexClass,ApexTrigger,ApexComponent,
                                                                                    ApexPage,AuraDefinitionBundle,Static
                                                                                    Resource

  -i, --ui                                                                          CompactLayout,Layout,ListView,Custom
                                                                                    Tab,AppMenu,CustomApplication,Custom
                                                                                    PageWebLink,HomePageComponent,HomePa
                                                                                    geLayout,PathAssistant,WebLink,Custo
                                                                                    mLabels,FlexiPage,QuickAction

  -o, --object=object                                                               pull metadata for a single object

  -p, --perms                                                                       PermissionSet,Profile,Role,CustomPer
                                                                                    mission,Group

  -s, --schema                                                                      ExternalDataSource,CustomMetadata,Re
                                                                                    cordType,GlobalValueSet,CustomField,
                                                                                    CustomObject,StandardValueSet

  -t, --type=type                                                                   pull only a specific type.  See the
                                                                                    metadata api docs for type names

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --all                                                                             Pulls just about everything.  Don't
                                                                                    use this flag with any other subset
                                                                                    of metadata.  Not recommended for
                                                                                    really large metadata orgs because
                                                                                    it'll overflow stdout

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --reporting                                                                       Report,Dashboard

  --wave                                                                            WaveApplication,WaveDashboard,WaveDa
                                                                                    taflow,WaveLens,WaveTemplateBundle,W
                                                                                    avexmd,WaveDataset

EXAMPLES
  sfdx shane:mdapi:pull -c -u someOrg
  // pulls code kinda stuff from the org and converts/merges it into your project's default pkgDir

  sfdx shane:mdapi:pull -u someOrg
  // pulls all the external data source metadata from the org and converts/merges it into your project's default pkgDir
```

_See code: [src/commands/shane/mdapi/pull.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/mdapi/pull.ts)_

## `sfdx shane:mdapi:push [-d <directory>] [-k] [-r <directory>] [-w <integer>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

convert and deploy the packaged source

```
USAGE
  $ sfdx shane:mdapi:push [-d <directory>] [-k] [-r <directory>] [-w <integer>] [-u <string>] [--apiversion <string>]
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --convertedfolder=convertedfolder                                             [default: mdapiout] where to store
                                                                                    the mdapi-converted source

  -k, --keepconverted                                                               Don't automatically delete the
                                                                                    converted source

  -r, --source=source                                                               [default: force-app] deploy a
                                                                                    specific folder that's not force-app

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -w, --deploymenttimelimit=deploymenttimelimit                                     [default: 200] How many minutes to
                                                                                    wait for the deployment to finish

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:mdapi:push -u someOrg
  // convert to mdapi format and push to the given org
```

_See code: [src/commands/shane/mdapi/push.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/mdapi/push.ts)_

## `sfdx shane:msgchannel:create -n <string> [-d <string>] [-t <directory>] [-e] [-f <array>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create a lightning message channel locally

```
USAGE
  $ sfdx shane:msgchannel:create -n <string> [-d <string>] [-t <directory>] [-e] [-f <array>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --description=description                                                     [default: added from sfdx plugin]
                                                                                    optional description so you can
                                                                                    remember why you added this and what
                                                                                    it's for

  -e, --exposed                                                                     accessible outside your namespace
                                                                                    (this is PERMANENT!)

  -f, --fields=fields                                                               fields to create on the message
                                                                                    channel

  -n, --name=name                                                                   (required) name it (Salesforce API
                                                                                    compliant name)

  -t, --target=target                                                               [default: force-app/main/default]
                                                                                    where to create the folder (if it
                                                                                    doesn't exist already) and
                                                                                    file...defaults to
                                                                                    force-app/main/default

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:msgchannel:create -n wkrp -d "it's a message channel, yo" -f Field1,Field2,Field3
  // creates a messageChannel with the given name, description, and fields
```

_See code: [src/commands/shane/msgchannel/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/msgchannel/create.ts)_

## `sfdx shane:object:create [-t <string>] [-l <string>] [-a <string>] [-p <string>] [--description <string>] [--enterprise] [--sharingmodel <string>] [--activities] [--search] [--reports] [--history] [--feeds] [--nametype <string>] [--namefieldlabel <string>] [--autonumberformat <string>] [--visibility <string>] [--highvolume] [-i] [-d <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create an object in local source. Only **c (limited support), **b (big objects) and events \_\_e are currently supported

```
USAGE
  $ sfdx shane:object:create [-t <string>] [-l <string>] [-a <string>] [-p <string>] [--description <string>]
  [--enterprise] [--sharingmodel <string>] [--activities] [--search] [--reports] [--history] [--feeds] [--nametype
  <string>] [--namefieldlabel <string>] [--autonumberformat <string>] [--visibility <string>] [--highvolume] [-i] [-d
  <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --api=api                                                                     api name.  Ends with one of the
                                                                                    supported types: [__b, __e]

  -d, --directory=directory                                                         [default: force-app/main/default]
                                                                                    where to create the folder (if it
                                                                                    doesn't exist already) and
                                                                                    file...defaults to
                                                                                    force-app/main/default

  -i, --interactive                                                                 fully interactive--ask me every
                                                                                    possible question.

  -l, --label=label                                                                 label for the UI

  -p, --plural=plural                                                               plural label for the UI

  -t, --type=custom|cmdt|big|event                                                  type of object

  --activities                                                                      the enableActivities flag on an
                                                                                    object (invalid for __b, __e)

  --autonumberformat=autonumberformat                                               the display format for the
                                                                                    autonumbering

  --description=description                                                         [default: added from sfdx plugin]
                                                                                    optional description so you can
                                                                                    remember why you added this and what
                                                                                    it's for

  --enterprise                                                                      enable bulk/sharing/streaming

  --feeds                                                                           the enableFeeds flag on an object
                                                                                    (invalid for __b, __e)

  --highvolume                                                                      high volume, valid only for platform
                                                                                    events (__e)

  --history                                                                         the enableHistory flag on an object
                                                                                    (invalid for __b, __e)

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --namefieldlabel=namefieldlabel                                                   [default: Name] the label for the
                                                                                    name field

  --nametype=Text|AutoNumber                                                        name field type

  --reports                                                                         the enableReports flag on an object
                                                                                    (invalid for __b, __e)

  --search                                                                          the enableSearch flag on an object
                                                                                    (invalid for __b, __e)

  --sharingmodel=Read|ReadWrite|Private                                             [default: ReadWrite] sharing model

  --visibility=Public|Protected|PackageProtected                                    [default: Public] visibility for
                                                                                    custom metadata types

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

_See code: [src/commands/shane/object/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/object/create.ts)_

## `sfdx shane:object:fat -o <string> [-m <integer>] [-y <integer>] [--description <string>] [-d <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

add or update a field audit trail retention policy on an object. Modifies local source--you still need to push/deploy

```
USAGE
  $ sfdx shane:object:fat -o <string> [-m <integer>] [-y <integer>] [--description <string>] [-d <directory>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --directory=directory                                                         [default: force-app/main/default]
                                                                                    Where is all this metadata? defaults
                                                                                    to force-app/main/default

  -m, --archiveaftermonths=archiveaftermonths                                       [default: 18] archive after this
                                                                                    number of months

  -o, --object=object                                                               (required) object to manage the
                                                                                    policy for

  -y, --archiveretentionyears=archiveretentionyears                                 [default: 10] Archive for this many
                                                                                    years

  --description=description                                                         optional friendly description for
                                                                                    the policy

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

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

_See code: [src/commands/shane/object/fat.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/object/fat.ts)_

## `sfdx shane:object:field [-o <string>] [-n <string>] [-a <string>] [-t <string>] [--description <string>] [--default <string>] [-r] [-u] [--externalid] [--trackhistory] [--helptext <string>] [-l <integer>] [-s <integer>] [--precision <integer>] [--lookupobject <string>] [--relname <string>] [--picklistvalues <array>] [--picklistdefaultfirst] [--indexposition <integer>] [--indexappend] [--indexdirection <string>] [--noindex] [-i] [-d <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create or add fields to an existing object

```
USAGE
  $ sfdx shane:object:field [-o <string>] [-n <string>] [-a <string>] [-t <string>] [--description <string>] [--default
  <string>] [-r] [-u] [--externalid] [--trackhistory] [--helptext <string>] [-l <integer>] [-s <integer>] [--precision
  <integer>] [--lookupobject <string>] [--relname <string>] [--picklistvalues <array>] [--picklistdefaultfirst]
  [--indexposition <integer>] [--indexappend] [--indexdirection <string>] [--noindex] [-i] [-d <directory>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --api=api
      API name for the field

  -d, --directory=directory
      [default: force-app/main/default] Where is this object metadata? defaults to force-app/main/default

  -i, --interactive
      fully interactive--ask me every possible question.

  -l, --length=length
      length (for text fields and text area)

  -n, --name=name
      Label for the field

  -o, --object=object
      API name of an object to add a field to

  -r, --required
      field is required

  -s, --scale=scale
      places right of the decimal

  -t, --type=type
      field type.  Big Objects: Text,Number,DateTime,Lookup,LongTextArea.  Events:
      Text,Number,DateTime,Date,LongTextArea,Checkbox.  Regular Objects:
      Text,Number,DateTime,Date,LongTextArea,Checkbox,Url,Email,Phone,Currency,Picklist,Html,Location

  -u, --unique
      field must be unique

  --default=default
      required for checkbox fields.  Express in Salesforce formula language (good luck with that!)

  --description=description
      optional description for the field so you remember what it's for next year

  --externalid
      use as an external id

  --helptext=helptext
      optional inline help text

  --indexappend
      put next in the big object index

  --indexdirection=ASC|DESC
      sort direction for the big object index

  --indexposition=indexposition
      put in a specific position in the big object index (0 is the first element).  You're responsible for dealing with
      producing a sane array

  --json
      format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)
      [default: warn] logging level for this command invocation

  --lookupobject=lookupobject
      API name of the object the lookup goes to

  --noindex
      do not add this field to the index

  --picklistdefaultfirst
      use the first value in the picklist as the default

  --picklistvalues=picklistvalues
      values for the picklist

  --precision=precision
      maximum allowed digits of a number, including whole and decimal places

  --relname=relname
      API name for the lookup relationship

  --trackhistory
      enable history tracking on the field

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

_See code: [src/commands/shane/object/field.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/object/field.ts)_

## `sfdx shane:object:fields:describe -o <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

what fields are on the object?

```
USAGE
  $ sfdx shane:object:fields:describe -o <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -o, --object=object                                                               (required) the object to describe

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:object:fields:describe -o Account -u someOrg
  // list the fields (with type/label) on account
```

_See code: [src/commands/shane/object/fields/describe.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/object/fields/describe.ts)_

## `sfdx shane:object:perms:align [-d <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

align profiles with

```
USAGE
  $ sfdx shane:object:perms:align [-d <directory>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --directory=directory                                                         [default: force-app/main/default]
                                                                                    Where is all this metadata?

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:object:perms:align
  // go through all the profiles/permsets in force-app/main/default and remove references to stuff that isn't in local
  source
```

_See code: [src/commands/shane/object/perms/align.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/object/perms/align.ts)_

## `sfdx shane:object:powerofone -o <string> [-l <string>] [-a <string>] [-d <string>] [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

add a "power of one" formula field to any object

```
USAGE
  $ sfdx shane:object:powerofone -o <string> [-l <string>] [-a <string>] [-d <string>] [-t <directory>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --api=api                                                                     [default: Power_Of_One__c] api name
                                                                                    (will include the __c for you if you
                                                                                    don't add it here

  -d, --description=description                                                     [default: Power of one is used for
                                                                                    formulas, reporting, etc] optional
                                                                                    description so you can remember why
                                                                                    you added this and what it's for

  -l, --label=label                                                                 [default: Power Of One] label

  -o, --object=object                                                               (required) API name of the object to
                                                                                    add the field to

  -t, --target=target                                                               [default: force-app/main/default]
                                                                                    where to create the folder (if it
                                                                                    doesn't exist already) and
                                                                                    file...defaults to
                                                                                    force-app/main/default

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:object:powerofone -a Poo -l "Power of One" -o User
  // create a field with api name Poo__c and label "Power of One" on the user object with the default description in the
  default folder
```

_See code: [src/commands/shane/object/powerofone.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/object/powerofone.ts)_

## `sfdx shane:object:recordtype -o <string> -l <string> [-n <string>] [-d <string>] [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create a new record type for an object

```
USAGE
  $ sfdx shane:object:recordtype -o <string> -l <string> [-n <string>] [-d <string>] [-t <directory>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --description=description                                                     [default: Created by
                                                                                    shane:sfdx:plugins] optional
                                                                                    description so you can remember why
                                                                                    you added this and what it's for

  -l, --label=label                                                                 (required) [default: Power Of One]
                                                                                    label

  -n, --name=name                                                                   Name for the record Type (defaults
                                                                                    to label if not provided)

  -o, --object=object                                                               (required) API name of the object to
                                                                                    add the record type to

  -t, --target=target                                                               [default: force-app/main/default]
                                                                                    where to create the file...defaults
                                                                                    to force-app/main/default

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:object:recordtype -o Something__c -l 'MyRecordType'
  // create a recordtype named MyRecordType and label MyRecordType on the Something__c object with the default
  description in the default folder
```

_See code: [src/commands/shane/object/recordtype.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/object/recordtype.ts)_

## `sfdx shane:object:tab -o <string> -i <integer> [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create a tab from a custom object, and you have to pick an icon

```
USAGE
  $ sfdx shane:object:tab -o <string> -i <integer> [-t <directory>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -i, --icon=icon                                                                   (required) icon number from
                                                                                    https://lightningdesignsystem.com/ic
                                                                                    ons/#custom but only up to 100

  -o, --object=object                                                               (required) object api name

  -t, --target=target                                                               [default: force-app/main/default]
                                                                                    where to create the folder (if it
                                                                                    doesn't exist already) and
                                                                                    file...defaults to
                                                                                    force-app/main/default

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:object:tab -o SomeObject__c -i 86
  // create a tab for the object using icon #86 from https://lightningdesignsystem.com/icons/#custom
```

_See code: [src/commands/shane/object/tab.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/object/tab.ts)_

## `sfdx shane:object:unperm -o <string> [-d <directory>] [-s <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

remove references to an object from profiles/permsets (all or a specific one)

```
USAGE
  $ sfdx shane:object:unperm -o <string> [-d <directory>] [-s <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --directory=directory                                                         [default: force-app/main/default]
                                                                                    Where is all this metadata? defaults
                                                                                    to force-app/main/default

  -o, --object=object                                                               (required) remove all references to
                                                                                    an object from profiles or permsets

  -s, --specific=specific                                                           specify a profile or permset by name
                                                                                    to only remove it from that one

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:object:unperm -o OpportunitySplit
  // go through all the profiles/permsets in force-app/main/default and remove the object, field, recordtypes and layout
  assignments (profile only) for the named object
```

_See code: [src/commands/shane/object/unperm.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/object/unperm.ts)_

## `sfdx shane:org:componentlibrary [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

opens the lightning component library for the specified org

```
USAGE
  $ sfdx shane:org:componentlibrary [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:org:componentlibrary
  // opens /componentReference/suite.app on the default scratch org

  sfdx shane:org:componentlibrary -u someOrgAlias
  // opens library for specified org
```

_See code: [src/commands/shane/org/componentlibrary.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/org/componentlibrary.ts)_

## `sfdx shane:org:create --userprefix <string> -o <string> [-i <string>] [-f <filepath>] [-a <string>] [-d <integer>] [--wait <integer>] [-c] [-n] [-s] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create an org with a friendly username. wraps force:org:create

```
USAGE
  $ sfdx shane:org:create --userprefix <string> -o <string> [-i <string>] [-f <filepath>] [-a <string>] [-d <integer>]
  [--wait <integer>] [-c] [-n] [-s] [--verbose] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --setalias=setalias                                                           set an alias for for the created
                                                                                    scratch org

  -c, --noancestors                                                                 do not include second-generation
                                                                                    package ancestors in the scratch org

  -d, --durationdays=durationdays                                                   [default: 7] duration of the scratch
                                                                                    org (in days) (default:7, min:1,
                                                                                    max:30)

  -f, --definitionfile=definitionfile                                               [default:
                                                                                    config/project-scratch-def.json]
                                                                                    path to a scratch org definition
                                                                                    file.  Default =
                                                                                    config/project-scratch-def.json

  -i, --clientid=clientid                                                           connected app consumer key

  -n, --nonamespace                                                                 creates the scratch org with no
                                                                                    namespace

  -o, --userdomain=userdomain                                                       (required) last part of the
                                                                                    generated username (after the @
                                                                                    sign).  Example: 'demo.org' produces
                                                                                    shane1@demo.org, shane2@demo.org

  -s, --setdefaultusername                                                          set the created org as the default
                                                                                    username

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --userprefix=userprefix                                                           (required) first part of the
                                                                                    generated username.  Example:
                                                                                    'shane' produces shane1@demo.org,
                                                                                    shane2@demo.org

  --verbose                                                                         emit additional command output to
                                                                                    stdout

  --wait=wait                                                                       [default: 20] the streaming client
                                                                                    socket timeout (in minutes)
                                                                                    (default:20, min:2)

EXAMPLES
  sfdx shane:org:create --userprefix shane -o org.test
  // creates an org from the default project config/project-scratch-def.json but with username shane[i]@org.test where i
  is a unique sequence number for that -u/-o combination

  sfdx shane:org:create --userprefix shane -o org.test -a sydneyBristow -d 30 -v myOtherHub -f config/thatOtherFile.json
  // above, but with an alias, a longer duration, and not the default hub, and not the default config file
```

_See code: [src/commands/shane/org/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/org/create.ts)_

## `sfdx shane:org:delete [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

delete the default scratch org. Won't prompt you for confirmation

```
USAGE
  $ sfdx shane:org:delete [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

ALIASES
  $ sfdx shane:org:destroy

EXAMPLE
  sfdx shane:org:delete // deletes the current default scratch org
```

_See code: [src/commands/shane/org/delete.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/org/delete.ts)_

## `sfdx shane:org:domain:cors [--all] [--liveagent] [-t <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

whitelist the org's domain as a CORS

```
USAGE
  $ sfdx shane:org:domain:cors [--all] [--liveagent] [-t <directory>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -t, --target=target                                                               [default: force-app/main/default]
                                                                                    where to create the folder (if it
                                                                                    doesn't exist already) and
                                                                                    file...defaults to
                                                                                    force-app/main/default

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --all                                                                             do all of Salesforce, not just this
                                                                                    org's custom domain

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --liveagent                                                                       whitelist all of LiveAgent urls

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:org:domain:cors
```

_See code: [src/commands/shane/org/domain/cors.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/org/domain/cors.ts)_

## `sfdx shane:org:domain:csp [--all] [--liveagent] [-t <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

whitelist the org's domain as a CSP Trusted Site

```
USAGE
  $ sfdx shane:org:domain:csp [--all] [--liveagent] [-t <directory>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -t, --target=target                                                               [default: force-app/main/default]
                                                                                    where to create the folder (if it
                                                                                    doesn't exist already) and
                                                                                    file...defaults to
                                                                                    force-app/main/default

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --all                                                                             do all of Salesforce, not just this
                                                                                    org's custom domain

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --liveagent                                                                       whitelist all of LiveAgent urls

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:org:domain:cors
```

_See code: [src/commands/shane/org/domain/csp.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/org/domain/csp.ts)_

## `sfdx shane:org:domain:verify [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Verifies that a domain was successfully setup with MyDomain

```
USAGE
  $ sfdx shane:org:domain:verify [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:org:domain:verify
```

_See code: [src/commands/shane/org/domain/verify.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/org/domain/verify.ts)_

## `sfdx shane:org:metadatacoverage [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

opens the metadata coverage report page

```
USAGE
  $ sfdx shane:org:metadatacoverage [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:org:metadatacoverage
  // opens /mdcoverage/report.jsp on the default scratch org

  sfdx shane:org:metadatacoverage -u someOrgAlias
  // opens report for specified org
```

_See code: [src/commands/shane/org/metadatacoverage.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/org/metadatacoverage.ts)_

## `sfdx shane:org:reauth [-r] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

reauthenticates (generates a new authinfo) for a scratch org, optionally insisting on custom domain being ready. Requires a hub

```
USAGE
  $ sfdx shane:org:reauth [-r] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -r, --requirecustomdomain                                                         keep trying until you get back an
                                                                                    org with a custom domain on it

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:org:reauth
       // reauths, and takes what it can get

  sfdx shane:org:reauth --requirecustomdomain
       // will try each minute, up to 60 minutes, until an org with a valid mydomain is ready
```

_See code: [src/commands/shane/org/reauth.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/org/reauth.ts)_

## `sfdx shane:org:refreshtoken [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Outputs a refresh token from an org that you've already authenticated sfdx to. PLEASE BE CAREFUL WITH THIS AND TREAT IT AS A PASSWORD

```
USAGE
  $ sfdx shane:org:refreshtoken [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:org:refreshtoken -u someAliasOrUsername
  // prints the refresh token for some org that you've already connected to
```

_See code: [src/commands/shane/org/refreshtoken.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/org/refreshtoken.ts)_

## `sfdx shane:package2:version:bump [-M | -m | -p] [-c] [-r] [-t <string>] [-v <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

bump the major/minor version number in the packageDirectory

```
USAGE
  $ sfdx shane:package2:version:bump [-M | -m | -p] [-c] [-r] [-t <string>] [-v <string>] [--apiversion <string>]
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -M, --major                                                                       Bump the major version by 1, sets
                                                                                    minor,build to 0

  -c, --create                                                                      create a new packageVersion from the
                                                                                    new versionNumber

  -m, --minor                                                                       Bump the minor version by 1

  -p, --patch                                                                       Bump the patch version by 1

  -r, --release                                                                     set the newly version as released
                                                                                    (out of Beta).  Implies create
                                                                                    whether you flag it or not :)

  -t, --target=target                                                               [default: force-app] name of your
                                                                                    package directory (defaults to
                                                                                    force-app)

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

ALIASES
  $ sfdx shane:package:version:bump

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

_See code: [src/commands/shane/package2/version/bump.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/package2/version/bump.ts)_

## `sfdx shane:permset:check -o <string> [-f <string>] [--users | --permsets | --profiles] [--fieldlevel <string>] [--objectlevel <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

who has access to what

```
USAGE
  $ sfdx shane:permset:check -o <string> [-f <string>] [--users | --permsets | --profiles] [--fieldlevel <string>]
  [--objectlevel <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --field=field                                                                 what field to check

  -o, --object=object                                                               (required) what object to check
                                                                                    perms on

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --fieldlevel=Read|Edit                                                            [default: Read] what level of perms
                                                                                    are you looking for

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --objectlevel=Read|Edit|Create|Delete|ViewAll|ModifyAll                           [default: Read] what level of perms
                                                                                    are you looking for

  --permsets                                                                        return names/ids of permission sets

  --profiles                                                                        return names/ids of profiles

  --users                                                                           return names/ids of users with those
                                                                                    profiles and/or permission sets

EXAMPLES
  sfdx shane:permset:check -o Project__c --profiles --permsets
       // list the profiles and permsets that have Read access to the object

  sfdx shane:permset:check -o Project__c -f Due_Date__c --fieldlevel Edit --profiles --permsets
       // list the profiles and permsets that have Edit access to the field on the object

  sfdx shane:permset:check -o Project__c -f Due_Date__c --users
       // list the users that have Read access to the field on the object, and the profile/permset(s) that are granting
  it
```

_See code: [src/commands/shane/permset/check.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/permset/check.ts)_

## `sfdx shane:permset:create -n <string> [-f <string> -o <string>] [-r <string> undefined] [-a <string>] [-d <directory>] [-t] [-c] [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create or add stuff to a permset with maximum access

```
USAGE
  $ sfdx shane:permset:create -n <string> [-f <string> -o <string>] [-r <string> undefined] [-a <string>] [-d
  <directory>] [-t] [-c] [-u <string>] [--apiversion <string>] [--verbose] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --application=application                                                     API name of an application to add
                                                                                    perms for.  If blank, then you mean
                                                                                    all the applications

  -c, --checkpermissionable                                                         some fields' permissions can't be
                                                                                    deducted from metadata, use describe
                                                                                    on org to check if field is
                                                                                    permissionable

  -d, --directory=directory                                                         [default: force-app/main/default]
                                                                                    Where is all this metadata? defaults
                                                                                    to force-app/main/default

  -f, --field=field                                                                 API name of an field to add perms
                                                                                    for.  Required --object If blank,
                                                                                    then you mean all the fields

  -n, --name=name                                                                   (required) path to existing permset.
                                                                                    If it exists, new perms will be
                                                                                    added to it.  If not, then it'll be
                                                                                    created for you

  -o, --object=object                                                               API name of an object to add perms
                                                                                    for.  If blank, then you mean ALL
                                                                                    the objects and ALL their fields and
                                                                                    ALL their tabs

  -r, --recordtype=recordtype                                                       API name of a record type to add
                                                                                    perms for.  Required --object If
                                                                                    blank, then you mean all the record
                                                                                    types

  -t, --tab                                                                         also add the tab for the specified
                                                                                    object (or all objects if there is
                                                                                    no specified objects)

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --verbose                                                                         emit additional command output to
                                                                                    stdout

EXAMPLES
  sfdx shane:permset:create -n MyPermSet1 -o Something__c -f Some_Field__c
       // create a permset in force-app/main/default for the object/field.  If MyPermSet1 doesn't exist, it will be
  created.

  sfdx shane:permset:create -n MyPermSet1 -o Something__c
       // create a permset in force-app/main/default for every field on Something__c.

  sfdx shane:permset:create -n MyPermSet1
       // create a permset in force-app/main/default for every field on every object!

  sfdx shane:permset:create -n MyPermSet1 -t
       // create a permset in force-app/main/default for every field on every object.  If there's a tab for any of those
  objects, add that tab to the permset, too

  sfdx shane:permset:create -n MyPermSet1 -c
       // create a permset in force-app/main/default for every field on every object, checking on org that all fields
  are permissionable
```

_See code: [src/commands/shane/permset/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/permset/create.ts)_

## `sfdx shane:profile:convert -n <string> -p <string> [-d <directory>] [-e | -c] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

convert a profile into a permset

```
USAGE
  $ sfdx shane:profile:convert -n <string> -p <string> [-d <directory>] [-e | -c] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --skinnyclone                                                                 create a new profile that's the
                                                                                    original profile less permset (does
                                                                                    not modify original profile)

  -d, --directory=directory                                                         [default: force-app/main/default]
                                                                                    Where is all this metadata? defaults
                                                                                    to force-app/main/default

  -e, --editprofile                                                                 remove metadata from original
                                                                                    profile

  -n, --name=name                                                                   (required) path to existing permset.
                                                                                    If it exists, new perms will be
                                                                                    added to it.  If not, then it'll be
                                                                                    created for you

  -p, --profile=profile                                                             (required) API name of an profile to
                                                                                    convert.  If blank, then you mean
                                                                                    ALL the objects and ALL their fields
                                                                                    and ALL their tabs

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:profile:convert -p Admin -n MyNewPermSet -e
  // create a permset in force-app/main/default from the Admin profile (profiles/Admin).  If MyNewPermSet doesn't exist,
  it will be created.  Content is removed from Admin profile (-e)

  sfdx shane:profile:convert -p Admin -n MyNewPermSet -c
  // create a permset in force-app/main/default from the Admin profile (profiles/Admin).  If MyNewPermSet doesn't exist,
  it will be created.  Leaves the original Admin profile and creates an Admin_Skinny profile that has everything in the
  permset removed (-c)
```

_See code: [src/commands/shane/profile/convert.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/profile/convert.ts)_

## `sfdx shane:profile:whitelist -n <string> [-d <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

whitelist the whole internet for a profile (no ip verification or 2FA/OTP challenges in dev)

```
USAGE
  $ sfdx shane:profile:whitelist -n <string> [-d <directory>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --directory=directory                                                         [default: force-app/main/default]
                                                                                    Where is all this metadata? defaults
                                                                                    to force-app/main/default

  -n, --name=name                                                                   (required) profile name

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:profile:whitelist -n Admin
  // add loginIpRanges of 0.0.0.0 to 255.255.255.255 to an existing profile, or create one if it doesn't exist
```

_See code: [src/commands/shane/profile/whitelist.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/profile/whitelist.ts)_

## `sfdx shane:project:create -n <string> [-g <string>] [-v <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

creates an sfdx project

```
USAGE
  $ sfdx shane:project:create -n <string> [-g <string>] [-v <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -g, --gitremote=gitremote                                                         full github url for the
                                                                                    remote...overrides the default
                                                                                    generated from git config user.name
                                                                                    and project name

  -n, --name=name                                                                   (required) name and path for the
                                                                                    project

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:project:create -n myProject
  // create a project in the folder with all the default structure
```

_See code: [src/commands/shane/project/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/project/create.ts)_

## `sfdx shane:remotesite:create -u <url> -n <string> [-d <string>] [-t <directory>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create a remote site setting in the local source. Push it when you're done

```
USAGE
  $ sfdx shane:remotesite:create -u <url> -n <string> [-d <string>] [-t <directory>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --description=description                                                     [default: added from sfdx plugin]
                                                                                    optional description so you can
                                                                                    remember why you added this and what
                                                                                    it's for

  -n, --name=name                                                                   (required) name it (Salesforce API
                                                                                    compliant name)

  -t, --target=target                                                               [default: force-app/main/default]
                                                                                    where to create the folder (if it
                                                                                    doesn't exist already) and
                                                                                    file...defaults to
                                                                                    force-app/main/default

  -u, --url=url                                                                     (required) url that you want to
                                                                                    allow callouts to

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:remotesite:create -n Test -u https://www.google.com
  // create a remote site setting in force-app/main/default

  sfdx shane:remotesite:create -n Test -u https://www.google.com -d "my description" -t myOtherDirectory/main/default
  // create a remote site setting in myOtherDirectory/main/default with a description
```

_See code: [src/commands/shane/remotesite/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/remotesite/create.ts)_

## `sfdx shane:static:create -n <string> -y <string> [-d <string>] [-t <directory>] [-p] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create a static resource locally

```
USAGE
  $ sfdx shane:static:create -n <string> -y <string> [-d <string>] [-t <directory>] [-p] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --description=description                                                     [default: added from sfdx plugin]
                                                                                    optional description so you can
                                                                                    remember why you added this and what
                                                                                    it's for

  -n, --name=name                                                                   (required) name it (Salesforce API
                                                                                    compliant name)

  -p, --public                                                                      mark the cache control public

  -t, --target=target                                                               [default: force-app/main/default]
                                                                                    where to create the folder (if it
                                                                                    doesn't exist already) and
                                                                                    file...defaults to
                                                                                    force-app/main/default

  -y, --type=zip|css|js|text|xml                                                    (required) choose one of the
                                                                                    following: zip, css, js, text, xml

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:static:create -n myJSResource -y js
  // creates /staticresources/myJSResource.js (empty file) and  /staticresources/myJSResource.resource-meta.xml

  sfdx shane:static:create -n myZipResource -y js -d "my description" -t myOtherDirectory/main/default
  // create an empty folder (zips when pushed), the meta.xml, with a description in a non-default directory.
```

_See code: [src/commands/shane/static/create.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/static/create.ts)_

## `sfdx shane:theme:activate -n <string> [-b] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Activate a LightningExperienceTheme via metadata api. Makes no permanent changes to local source

```
USAGE
  $ sfdx shane:theme:activate -n <string> [-b] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --showbrowser                                                                 show the browser...useful for local
                                                                                    debugging

  -n, --name=name                                                                   (required) name of the theme to
                                                                                    activate

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/shane/theme/activate.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/theme/activate.ts)_

## `sfdx shane:tsp:username:update [-n <email>] [-d <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

change the username on all transaction security policies

```
USAGE
  $ sfdx shane:tsp:username:update [-n <email>] [-d <directory>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --directory=directory                                                         [default: force-app/main/default]
                                                                                    Where is all this metadata? defaults
                                                                                    to force-app/main/default

  -n, --newusername=newusername                                                     manually specify the username,
                                                                                    ignoring your default or any -u

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

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

_See code: [src/commands/shane/tsp/username/update.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/tsp/username/update.ts)_

## `sfdx shane:uiapi:objectinfo -o <string> [--outputfile <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

get a ui api response from the objectinfo endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_object_info.htm

```
USAGE
  $ sfdx shane:uiapi:objectinfo -o <string> [--outputfile <filepath>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -o, --object=object                                                               (required) object api name

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --outputfile=outputfile                                                           local path to save the output to

EXAMPLES
  sfdx shane:uiapi:objectinfo -o Account --json
       // returns ui-api objectinfo for Account

  sfdx shane:uiapi:objectinfo -o Account --json --outputfile accountObjectInfo.json
       // returns ui-api objectinfo for Account and saves it to a local file
```

_See code: [src/commands/shane/uiapi/objectinfo.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/uiapi/objectinfo.ts)_

## `sfdx shane:uiapi:record -r <string> -f <array> [--optionalfields <array>] [--outputfile <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

get a ui api response from the getrecord endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_record_get.htm

```
USAGE
  $ sfdx shane:uiapi:record -r <string> -f <array> [--optionalfields <array>] [--outputfile <filepath>] [-u <string>]
  [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --fields=fields                                                               (required) fields to return.
                                                                                    Specify with the object API name,
                                                                                    like Account.Name, Account.Phone,
                                                                                    etc.  If not visible to the running
                                                                                    user, an error is thrown

  -r, --recordid=recordid                                                           (required) single recordId to
                                                                                    generate the data/metadata

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --optionalfields=optionalfields                                                   optional fields to return.  If not
                                                                                    visible to the running user, the
                                                                                    field is just omitted

  --outputfile=outputfile                                                           local path to save the output to

EXAMPLE
  sfdx shane:uiapi:record -r 001R0000003I6CoIAK -f Account.Name --optionalfields
  Account.AnnualRevenue,AccountAccount.Number --json
  // default ui-api response for a getrecord.
```

_See code: [src/commands/shane/uiapi/record.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/uiapi/record.ts)_

## `sfdx shane:uiapi:recordui [-r <string> | --recordids <array>] [-l <array>] [-m <array>] [--outputfile <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

get a ui api response from the record-ui endpoint: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_resources_record_ui.htm

```
USAGE
  $ sfdx shane:uiapi:recordui [-r <string> | --recordids <array>] [-l <array>] [-m <array>] [--outputfile <filepath>]
  [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -l, --layouttypes=layouttypes                                                     which layout (Compact, Full or both)

  -m, --modes=modes                                                                 which mode (Create, Edit, View, or
                                                                                    combo)

  -r, --recordid=recordid                                                           single recordId to generate the
                                                                                    data/metadata

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --outputfile=outputfile                                                           local path to save the output to

  --recordids=recordids                                                             array of recordIds to generate the
                                                                                    data/metadata

EXAMPLE
  sfdx shane:uiapi:recordui -r 001R0000003I6CoIAK --json
  // default ui-api response for a single recordId
```

_See code: [src/commands/shane/uiapi/recordui.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/uiapi/recordui.ts)_

## `sfdx shane:user:allPhotos [-r <url>] [-f <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

set the chatter photos of anyone who has not set theirs already to encourage them to do so

```
USAGE
  $ sfdx shane:user:allPhotos [-r <url>] [-f <directory>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --folder=folder                                                               optional local folder of photos.
                                                                                    Overrides --repo

  -r, --repo=repo                                                                   [default:
                                                                                    https://github.com/mshanemc/badProfi
                                                                                    lePhotos] optional alternate repo of
                                                                                    photos, which contains a folder of
                                                                                    photos named /img

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:user:allphotos -u someAlias
```

_See code: [src/commands/shane/user/allPhotos.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/user/allPhotos.ts)_

## `sfdx shane:user:lightning:debug [-g <string>] [-l <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

set the user to debug mode

```
USAGE
  $ sfdx shane:user:lightning:debug [-g <string>] [-l <string>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -g, --firstname=firstname                                                         first (given) name of the
                                                                                    user--keeping -f for file for
                                                                                    consistency

  -l, --lastname=lastname                                                           last name of the user

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:user:lightning:debug
       // puts the default user in lightning debug mode

  sfdx shane:user:lightning:debug -g Sarah -l McLaughlin
       // puts the named user in lightning debug mode
```

_See code: [src/commands/shane/user/lightning/debug.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/user/lightning/debug.ts)_

## `sfdx shane:user:loginurl [-p <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

generate a long-lived shareable login url for the org

```
USAGE
  $ sfdx shane:user:loginurl [-p <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -p, --starturl=starturl                                                           url to open

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:user:loginurl
       // generates a url including un and pw query strings to simplify logging into the scratch org

  sfdx shane:user:loginurl -p /lightning/setup/ObjectManager/home
       // same, but sets the start url to ObjectManager
```

_See code: [src/commands/shane/user/loginurl.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/user/loginurl.ts)_

## `sfdx shane:user:password:set -g <string> -l <string> -p <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Set the password for a user by first/last name

```
USAGE
  $ sfdx shane:user:password:set -g <string> -l <string> -p <string> [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -g, --firstname=firstname                                                         (required) first (given) name of the
                                                                                    user--keeping -f for file for
                                                                                    consistency

  -l, --lastname=lastname                                                           (required) last name of the user

  -p, --password=password                                                           (required) the password you want the
                                                                                    user to have

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:user:password:set -p sfdx1234 -g User -l User
  // sets the password for User User to sfdx1234
```

_See code: [src/commands/shane/user/password/set.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/user/password/set.ts)_

## `sfdx shane:user:permset:assign -n <string> [-g <string> -l <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Assign a permset to a user by first/last name, or just the default user. Does not error if permset is already assigned

```
USAGE
  $ sfdx shane:user:permset:assign -n <string> [-g <string> -l <string>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -g, --firstname=firstname                                                         first (given) name of the
                                                                                    user--keeping -f for file for
                                                                                    consistency

  -l, --lastname=lastname                                                           last name of the user

  -n, --name=name                                                                   (required) the value of the permset
                                                                                    name or label field

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:user:permset:assign -n thePermSet -g User -l User
```

_See code: [src/commands/shane/user/permset/assign.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/user/permset/assign.ts)_

## `sfdx shane:user:photo -l <string> [-g <string>] [-f <filepath> | -b <filepath>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Set the photo for a user by first/last name

```
USAGE
  $ sfdx shane:user:photo -l <string> [-g <string>] [-f <filepath> | -b <filepath>] [-u <string>] [--apiversion
  <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --banner=banner                                                               local path of the chatter banner
                                                                                    photo to use

  -f, --file=file                                                                   local path of the photo to use

  -g, --firstname=firstname                                                         first (given) name of the
                                                                                    user--keeping -f for file for
                                                                                    consistency

  -l, --lastname=lastname                                                           (required) last name of the user

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx shane:user:photo -f ~/Downloads/King.png -g User -l User
  // sets the chatter photo for the user named User User using the local file

  sfdx shane:user:photo -b ~/Downloads/King.png -g User -l User
  // sets the chatter banner photo for the user named User User using the local file

  sfdx shane:user:photo -f ~/Downloads/King.png -b ~/Downloads/OtherPhoto.jpg -g User -l User
  // sets the chatter banner photo AND user photo at the same time
```

_See code: [src/commands/shane/user/photo.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/user/photo.ts)_

## `sfdx shane:user:psl -l <string> -n <filepath> [-g <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Assign a permset license already in an org for a user

```
USAGE
  $ sfdx shane:user:psl -l <string> -n <filepath> [-g <string>] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -g, --firstname=firstname                                                         first (given) name of the
                                                                                    user--keeping -f for file for
                                                                                    consistency

  -l, --lastname=lastname                                                           (required) last name of the user

  -n, --name=name                                                                   (required) developer name or label
                                                                                    of the PermSetLicense

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx shane:user:psl -n SomePSL -g User -l User
  // assign the PSL named 'somePSL' for the user named User User
```

_See code: [src/commands/shane/user/psl.ts](https://github.com/mshanemc/shane-sfdx-plugins/blob/v4.29.0/src/commands/shane/user/psl.ts)_

<!-- commandsstop -->

## How-to-Contribute

I take PRs from users. CI tests are going to run with [heroku-ci](https://devcenter.heroku.com/articles/heroku-ci).

If you want to run tests locally, you'll need a dev hub already auth'd, and also a heroku api key (you could avoid that last part by putting .skip on the whole heroku test I guess).

Tests are really mostly integration tests, using jest. I'm as concerned about sfdx cli/mdapi bugs/changes as I am about your bugs and my bugs and that stuff is rather nasty (and somewhat pointless) to try to mock out. If you want to, that's cool.

### Suggestions to test for...

1. that your commands get all the parameters in, correctly
2. if you modify sfdx source code, that whatever your plugin is making is still deployable
3. that it properly returns both --json and non---json scenarios (I've forgotten this a few times and it's bit me)
4. if you're calling Salesforce rest apis, that it works

I had to use puppeteer inside some of the commands to get around non-api-enabled features, so feel free to use it in your tests it you want to open some org.

Be sure to clean up after your tests (delete scratch orgs, etc).
