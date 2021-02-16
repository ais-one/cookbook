(async function() {
console.log('To be called by cron', __filename)
await require('@eslab/node/config')(process.cwd()) //  first thing to run
console.log('Its better for cron call an API than to run this')
process.exit(0)
}())