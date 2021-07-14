const { ThreadWorker } = require('poolifier')
const calculus = require('./calculus')

module.exports = new ThreadWorker(calculus.execute, {
    maxInactiveTime: 60000,
    async: false
})