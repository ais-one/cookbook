# ARG <name>[=<default value>]
# E.G.
# ARG SETTINGS
# RUN ./run/setup $SETTINGS

# Create image based on the official Node 6 image from the dockerhub
# FROM node:12
FROM node:12-alpine


# Expose the port the app runs in
EXPOSE 3000

# websocket
EXPOSE 3001

# Create a directory where our app will be placed, use workdir for now
# RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Set Environment Variables Here
ENV NODE_ENV=development
# ENV DB_USER=test
# ENV DB_PASSWORD=

# Copy dependency definitions
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package.json package-lock*.json ./
COPY package*.json ./


# Install dependecies
# If you are building your code for production
# RUN npm ci --only=production
RUN npm install --only=production && npm cache clean --force

# Get all the code needed to run the app
COPY . .
# TOREMOVE
# COPY index.js app.js appname.js ./
# COPY common common/
# COPY common-app common-app/
# COPY example-app example-app/

# Install dependencies
RUN cd example-app && npm install --only=production && npm cache clean --force

# Front end build - TO TEST
# RUN cd example-app/web/spa && npm install && npm cache clean --force && npm run build
# RUN cp -rf example-app/web/spa/dist example-app/public


# RUN cd example-app/web && rm -rf spa
# remove the frontend stuffs
# RUN cd example-app && rm -rf web

# Serve the app
# https://www.docker.com/blog/keep-nodejs-rockin-in-docker/
# do not use file watchers or process managers in production
CMD ["node", "index.js"]

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
