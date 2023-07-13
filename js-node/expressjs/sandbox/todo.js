// https://stackoverflow.com/questions/58136102/deploy-individual-services-from-a-monorepo-using-github-actions
// https://dev.to/ruppysuppy/7-cool-html-elements-nobody-uses-330c
// https://snyk.io/blog/best-practices-create-modern-npm-package

require('dotenv').config({ multiline: true })

console.log(process.env.TEST_MULTILINE)

console.log(JSON.parse(process.env.TEST_JSON))