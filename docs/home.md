
# Technical Debt Reduction

- try to use as little libraries/dependencies as possible

- use native NodeJS or Javascript
  - vee-validate from version 2 to 3 broke many things, might as well stick with HTML5 validation
  - momentjs is too big, date-fns from version 1 to 2 broke things, use native JS Date Object, Intl.DateTimeFormat, etc. instead
  - nuxt-auth could not handle 2FA or refresh token so cannot be used

# NodeJS

[nodejs.md](nodejs.md)


# Deployment And Scaling

[deployment/home.md](deployment/home.md) - WORK IN PROGRESS

# Mongo DB

[mongodb/home.md](mongodb/home.md)

# GCP

[gcp/home.md](gcp/home.md)



