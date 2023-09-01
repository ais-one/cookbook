/**
 * @typedef { import("./types").Person } Person
 * @typedef { import("./types-address").Address } Address
*/


/**
 * @type {Person}
 */
const testModel = {
  name: 'aa',
  age: 123,
  address: {
    street: 'aaa',
    zip: 123
  }
}

/**
 * @type {Address}
 */
const testAddr = {
  street: 'bbb',
  zip: 456
}

/**
 * @arg {number} a
 * @arg {number} b
 * @returns {number}
 */
const add = (a, b) => {
  console.log(testAddr)
  console.log(testModel)
  return a + b
}

add(1,2)
