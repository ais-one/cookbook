# Create image based on the official Node 6 image from the dockerhub
FROM node
# node:12-alpine

# Expose the port the app runs in
EXPOSE 3000

# websocket
EXPOSE 3001

# Create a directory where our app will be placed, use workdir for now
# RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock*.json ./

# Install dependecies
RUN npm install && npm cache clean --force

# Get all the code needed to run the app
COPY . .

# Serve the app
CMD ["node", "index.js"]



# ENV foo /bar
# WORKDIR ${foo}   # WORKDIR /bar
# ADD . $foo       # ADD . /bar
# COPY \$foo /quux # COPY $foo /quux (\ will do literal copy...)

# VOLUME ["/var/www", "/var/log/apache2", "/etc/apache2"]
# ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
# ARG <name>[=<default value>]

# USER <user>[:<group>] or
# USER <UID>[:<GID>]

# # Executed as cmd /S /C echo hello
# SHELL ["cmd", "/S", "/C"]
# RUN echo hello

# # Executed as powershell -command Write-Host hello
# SHELL ["powershell", "-command"]
# RUN Write-Host hello

# ENV DB_USER=test
# ENV DB_PASSWORD=

# https://www.docker.com/blog/keep-nodejs-rockin-in-docker/
# do not use file watchers or process managers in production
# CMD [ "node", "server.js" ]


#
# docker build -t <your username>/node-web-app .
# OR
# docker build -t node-web-app .
# docker run -p 49160:8080 -d <your username>/node-web-app
# # Print the output of your app:

# # Get container ID
# $ docker ps

# # Print app output
# $ docker logs <container id>

# # Example
# Running on http://localhost:8080

# # Enter the container
# $ docker exec -it <container id> /bin/bash