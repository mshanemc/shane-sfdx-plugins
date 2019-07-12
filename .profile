#!/bin/bash

# Save a keyfile
mkdir -p /app/tmp
echo "$JWTKEY" > /app/tmp/server.key

# Auth to SFDX
sfdx force:auth:jwt:grant --clientid $CONSUMERKEY --username $HUB_USERNAME --jwtkeyfile /app/tmp/server.key --setdefaultdevhubusername -a hub
sfdx plugins:link .
# do not autoupdate
export SFDX_AUTOUPDATE_DISABLE=true
# new json settings
export SFDX_JSON_TO_STDOUT=true
