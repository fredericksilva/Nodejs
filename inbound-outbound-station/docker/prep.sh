#!/bin/bash
# This file's purpose is simple. Delete whatever nonsense "might be" in the current source folder and replace
# it with the installed stuff we have for the docker image.
#
# The reasons we need this file is to ensure we do not end up calling npm install all the time... and doing it on
# accidental cross-device installations.

echo "Deleting and Replacing Installed Node and Bower Components."

# Proceed to remove and replace installed code.
rm -rf /src/node_modules && cp -r /node_modules /src/node_modules
rm -rf /src/public/components && cp -r /bower_components /src/public/components

# Let the peoples know the result.
echo "Preparation Complete"
