## Issues

TOREMOVE THIS FILE

Things Changed...
- express/services -> express/shutdown
- express/preroute -> express/preRoute
- express/postroute -> express/postRoute
- errorMiddleware



# "scripts": {
#   "start": "cross-env NODE_ENV=production node ./bin/www",
#   "dev": "cross-env NODE_ENV=development PORT=3001 DEBUG=app:* nodemon --ignore '*.test.js' --watch src bin/www",
#   "db:migrate:make": "knex migrate:make",
#   "db:migrate": "knex migrate:latest",
#   "db:migrate:rollback": "knex migrate:rollback",
#   "db:seed:make": "knex seed:make",
#   "db:seed": "knex seed:run"
# },
# "dependencies": {
#   "debug": "~2.6.9",
# },
# "devDependencies": {
#   "cross-env": "^6.0.3",
#   "husky": "^4.2.5",
#   "nodemon": "^1.19.4"
# },
# "husky": {
#   "hooks": {
#     "pre-commit": "npm run jsfmt && npm run jslint"
#   }
# }
