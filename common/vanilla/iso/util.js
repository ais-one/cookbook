// https://www.samanthaming.com/tidbits/94-how-to-check-if-object-is-empty/
/**
 * check if object is empty, also false if not object
 * @param {any} value - time to measure the number of calls
 * @returns {boolean} -  true if empty object, false otherwise
 */
export const isEmptyObject = value => value && Object.keys(value).length === 0 && value.constructor === Object;

export const isValidObject = value => value && typeof value === 'object' && value.constructor === Object;

// backward compatiibility
export const emptyObjects = isEmptyObject;
