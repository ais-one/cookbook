/**
 * wait asynchronously for ms milliseconds
 * @param {number} ms - milliseconds to sleep
 * @returns
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
