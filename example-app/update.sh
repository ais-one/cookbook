# TBD copy common-lib/esm to <example-app>/lib/esm
echo Copying files from common-lib
cp ../common-lib/esm/t4t-validate.js ./lib/esm
cp ../common-lib/esm/datetime.js ./lib/esm
cp ../common-lib/esm/sleep.js ./lib/esm
cp ../common-lib/esm/util.js ./lib/esm

echo Done...
if [ "$CI" != "true" ]; then
  echo press enter key to exit
  read # pause exit in windows
fi
