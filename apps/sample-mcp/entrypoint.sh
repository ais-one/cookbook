#!/bin/sh

# Clean up any env file
rm -rf ./.env.*

# Download secrets to env file
doppler secrets download --no-file --format env-no-quotes > ./.env.$NODE_ENV

# Wrap the KNEXFILE value in single quotes directly in the env file
sed -i "s|^KNEXFILE=\(.*\)$|KNEXFILE='\1'|" ./.env.$NODE_ENV

# Run your app (it will read env vars from the modified file as needed)
exec node index.js --env-file=.env.$NODE_ENV