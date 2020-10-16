# ARG <name>[=<default value>]
# E.G.
# ARG SETTINGS
# RUN ./run/init-stuff $SETTINGS

# Create image based on the official Node 6 image from the dockerhub
# FROM node:12
FROM node:12-alpine
# RUN apk update && apk add python && rm -rf /var/cache/apk/*
RUN apk update && apk add python make g++ && rm -rf /var/cache/apk/*

# available in build time only
ARG ARG_API_PORT=3000
ARG ARG_NODE_ENV=development
ARG ARG_VAULT=

# Expose the port the app runs in
EXPOSE $ARG_API_PORT

# websocket
EXPOSE 3001

# Create a directory where our app will be placed, use workdir for now
# RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Set Environment Variables Here - available in run time or should be passed in ?
ENV API_PORT $ARG_API_PORT
ENV NODE_ENV $ARG_NODE_ENV
ENV VAULT $ARG_VAULT

# PORT for GCP Cloud Run
ENV PORT $ARG_API_PORT

# Copy dependency definitions
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package.json package-lock*.json ./
COPY package*.json ./

# Install dependecies here before other copy so you do not bust the cache
# If you are building your code for production
RUN npm ci --only=production
# RUN npm install --only=production && npm cache clean --force

# Get all the code needed to run the app
COPY . .

# Serve the app
# https://www.docker.com/blog/keep-nodejs-rockin-in-docker/
# do not use file watchers or process managers in production
CMD node index.js

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


# FROM gcr.io/distroless/nodejs:debug
# FROM gcr.io/distroless/nodejs
# WORKDIR /user/src/app
# COPY package*.json ./
# RUN npm ci --only=production
# COPY --from=stage1 /usr/src/app /usr/src/app
# EXPOSE 3000
# CMD index.js
