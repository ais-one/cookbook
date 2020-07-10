The files development.* are for development environment

For others please create seperate files with the environment name in front. e.g. for uat, it is uat.deploy

development.pem
- VM PEM (if needed)

development.deploy
- URL=username and url to VM (if needed)
- WEB=<folder name>,<gs://>;<folder name>,<gs://>
- GCP_PROJECT_ID=

development.env.js
- settings for development environment

development.gcp.json
- GCP service account JSON