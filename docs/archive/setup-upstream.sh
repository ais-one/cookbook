#!/bin/bash

## Setup to allow incoming merge from upstream template update
# run this script once only after you `clone`, or `fork` or `delete .git and run git init`
## - Updating the template - commit and push to remote before running commands below
# git fetch upstream # includes tags
# git pull upstream <branch or tag> --no-rebase
## There may be some template related merge conflicts to resolve.


# set upstream
UPSTREAM_REPO_URL=https://github.com/ais-one/novex-kit.git

## template clone or fork
echo
echo "NOTE: add chmod +x flag for this script to work"
echo "setup-upstream.sh running..."
echo
echo "You must clone new project from template or fork"
echo

git remote add upstream $UPSTREAM_REPO_URL
git remote set-url --push upstream no_push
git remote -v
