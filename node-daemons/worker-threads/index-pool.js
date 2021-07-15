'use strict'

// no change in worker pool needed

const {StaticPool} = require("node-worker-threads-pool");

let num = 40;

//Create a static worker pool with 8 workers
const pool = new StaticPool({
  size: 8,
  task: "./worker.js"
});

//Get a worker from the pool and execute the task
pool.exec({num: num}).then(result => {
  console.log(`${result.num}th Fibonacci Number: ${result.fib}`);
});
