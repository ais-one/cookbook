const {Worker} = require("worker_threads");
const {StaticPool} = require("node-worker-threads-pool");
const calculus = require('./calculus')
const {FixedThreadPool} = require('poolifier')


// 1 -------------------
const asynch_calculus = (num) => {
    return new Promise((resolve, reject) => {
        resolve(calculus.execute(num))
    })
}

// 2 -------------------
const worker_calculus = (num) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./project_modules/worker.js");
        worker.on("message", result => {
            resolve(result.output)
        });
        worker.postMessage({num: num});
    })
}

// 3 -------------------
const worker_made = new Worker("./project_modules/worker.js");
const worker_made_calculus = (num) => {
    return new Promise((resolve, reject) => {
        worker_made.on("message", result => {
            resolve(result.output)
        });
        worker_made.postMessage({num: num});
    })
}

// 4 -------------------
const staticPool = new StaticPool({
    size: 3,
    task: "./project_modules/worker.js"
});
const worker_pool_calculus = (num) => {
    return new Promise((resolve, reject) => {
        staticPool.exec({num: num}).then((result) => {
            resolve(result.output)
        });
    })
}

// 5 -------------------
const pool = new FixedThreadPool(3,
    './project_modules/poolifierWorker.js',
    {errorHandler: (e) => console.error(e), onlineHandler: () => console.log('worker is online')})
pool.emitter.on('busy', () => console.log('Pool is busy'))
const worker_pool_calculus2 = (num) => {
    return new Promise((resolve, reject) => {
        pool.execute(num).then((result) => {
            resolve(result)
        });
    })
}

// 6 -------------------

let numberOfThreads = 10;
const workerArray = [];
for (let n = 0; n < numberOfThreads; n++) {
    workerArray.push(new Worker("./project_modules/worker.js"))
}
let i = 0;
const worker_array_calculus = (num,threads) => {
    return new Promise((resolve, reject) => {
        let workerNum = i % threads;
        console.log('worker num:', workerNum)
        workerArray[workerNum].on("message", result => {
            resolve(result.output)
        });
        workerArray[workerNum].postMessage({num: num});
        i++;
    })
}


module.exports = {

    asynch_calculus,

    worker_calculus,

    worker_made_calculus,

    worker_pool_calculus,
    worker_pool_calculus2,

    worker_array_calculus
}




