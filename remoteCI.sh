echo "hello from a CI test-script"
# Save a keyfile
echo $JWTKEY
$JWTKEY > server.key
# Auth to SFDX
sfdx force:auth:jwt:grant --cliendId $CONSUMERKEY --username $HUB_USERNAME --jwtkeyfile server.key --setdefaultdevhubusername -a hub
