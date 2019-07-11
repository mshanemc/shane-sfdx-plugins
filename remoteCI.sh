echo "hello from a CI test-script"
# Save a keyfile
mkdir -p app
mkdir -p app/tmp
echo "$JWTKEY" > app/tmp/server.key
# Auth to SFDX
sfdx force:auth:jwt:grant --clientid $CONSUMERKEY --username $HUB_USERNAME --jwtkeyfile app/tmp/server.key --setdefaultdevhubusername -a hub
