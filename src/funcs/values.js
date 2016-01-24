import type from 'type-of';
import uniques from 'uniques';

/**
 * Returns all values for a given object or array recursively.
 *
 * @example
 * let x = {
 *   a: 1,
 *   b: 2,
 *   c: 3
 * }
 *
 * ob.values(x)
 * // → [1, 2, 3]
 *
 * @example
 * let x = {
 *   a: 1,
 *   b: 2,
 *   c: 3,
 *   d: [4]
 * }
 *
 * ob.values(x)
 * // → [1, 2, 3, 4]
 *
 * @param {object|any[]} subject The object or array of objects to get the values of
 * @param {boolean} [unique=true] Whether the result should contain duplicates or not
 * @returns {any[]}
 */
let values = (subject, unique=true) => {
  let localValues = [];

  if(type(subject) === 'array') {
    for(let i of subject){
      localValues = localValues.concat(values(i));
    }

  } else if(type(subject) === 'object') {
    for(let k in subject) {
      localValues = localValues.concat(values(subject[k]));
    };
  } else {
    localValues.push(subject);
  }
  if(unique) {
    return uniques(localValues);
  } else {
    return localValues;
  }
};

export default values;
