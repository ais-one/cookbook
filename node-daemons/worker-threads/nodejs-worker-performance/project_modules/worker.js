//worker.js
const {parentPort} = require("worker_threads");
const calculus = require('./calculus')

parentPort.on("message", data => {
    parentPort.postMessage({input: data.num, output: calculus.execute(data.num)});
});

