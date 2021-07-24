# ARG <name>[=<default value>]
# E.G.
# ARG SETTINGS
# RUN ./run/init-stuff $SETTINGS

ARG NODE_VERSION=14
FROM node:${NODE_VERSION}-alpine AS build
RUN apk update && apk add python make g++ && rm -rf /var/cache/apk/*
WORKDIR /app
COPY package*.json ./
# RUN npm ci --only=production ../../@es-labs causes problems
RUN npm i @es-labs/esm@latest @es-labs/node@latest
RUN npm i --only=production
COPY . .


# FROM gcr.io/distroless/nodejs:debug
FROM gcr.io/distroless/nodejs:${NODE_VERSION} AS uat
WORKDIR /app
COPY --from=build /app .

ARG ARG_API_PORT=3000
ARG ARG_NODE_ENV=uat
ARG ARG_VAULT=
EXPOSE $ARG_API_PORT
EXPOSE 3001
ENV API_PORT $ARG_API_PORT
ENV NODE_ENV $ARG_NODE_ENV
ENV VAULT $ARG_VAULT
ENV PORT $ARG_API_PORT
CMD ["index.js"]

FROM build AS development
WORKDIR /app

ARG ARG_API_PORT=3000
ARG ARG_NODE_ENV=development
ARG ARG_VAULT=
ENV NODE_ENV=$ARG_NODE_ENV
ENV API_PORT $ARG_API_PORT
ENV VAULT $ARG_VAULT
ENV PORT $ARG_API_PORT
EXPOSE $ARG_API_PORT
RUN npm install --only=development
COPY --from=build /app .
CMD ["node", "index.js"]

FROM development AS test
ARG ARG_API_PORT=3000
ARG ARG_NODE_ENV=development
ARG ARG_VAULT=
ENV NODE_ENV=$ARG_NODE_ENV
ENV API_PORT $ARG_API_PORT
ENV VAULT $ARG_VAULT
ENV PORT $ARG_API_PORT
CMD ["npm", "test"]

# # Create image based on the official Node 6 image from the dockerhub
# # FROM node:12
# FROM node:12-alpine AS stago0
# # RUN apk update && apk add python && rm -rf /var/cache/apk/*
# RUN apk update && apk add python make g++ && rm -rf /var/cache/apk/*

# # available in build time only
# ARG ARG_API_PORT=3000
# ARG ARG_NODE_ENV=development
# ARG ARG_VAULT=

# # Expose the port the app runs in
# EXPOSE $ARG_API_PORT

# # websocket
# EXPOSE 3001

# # Create a directory where our app will be placed, use workdir for now
# # RUN mkdir -p /usr/src/app

# # Change directory so that our commands run inside this new directory
# WORKDIR /usr/src/app

# # Set Environment Variables Here - available in run time or should be passed in ?
# ENV API_PORT $ARG_API_PORT
# ENV NODE_ENV $ARG_NODE_ENV
# ENV VAULT $ARG_VAULT

# # PORT for GCP Cloud Run
# ENV PORT $ARG_API_PORT

# # Copy dependency definitions
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# # COPY package.json package-lock*.json ./
# COPY package*.json ./

# # Install dependecies here before other copy so you do not bust the cache
# # If you are building your code for production
# RUN npm install
# # RUN npm install --only=production && npm cache clean --force

# # Get all the code needed to run the app
# COPY . .
# --from=stage0 /usr/src/app /usr/src/app

# # Serve the app
# # https://www.docker.com/blog/keep-nodejs-rockin-in-docker/
# # do not use file watchers or process managers in production
# # CMD npm test
# CMD npm run test

# WORKDIR ${foo}   # WORKDIR /bar
# ADD . $foo       # ADD . /bar
# COPY \$foo /quux # COPY $foo /quux (\ will do literal copy...)
# VOLUME ["/var/www", "/var/log/apache2", "/etc/apache2"]
# ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
# USER <user>[:<group>] or
# USER <UID>[:<GID>]
# # Executed as cmd /S /C echo hello
# SHELL ["cmd", "/S", "/C"]
# RUN echo hello
# # Executed as powershell -command Write-Host hello
# SHELL ["powershell", "-command"]
# RUN Write-Host hello
