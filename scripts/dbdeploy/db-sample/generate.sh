#!/bin/bash
set -euo pipefail

npx knex --knexfile db-sample/knexfile.js migrate:latest
npx knex --knexfile db-sample/knexfile.js seed:run
