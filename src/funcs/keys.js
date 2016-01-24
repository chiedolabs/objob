import type from 'type-of';
import uniques from 'uniques';

/**
 * Return all keys for an object recursively, including keys in objects that are in arrays.
 *
 * @example
 * let x = {
 *   a: 1,
 *   b: 2,
 *   c: 3
 * }
 *
 * ob.keys(x)
 * // → ['a','b','c']
 *
 * @example
 * let x = [{ a: 1, b: 2, c: 3}, {d: 1}]
 *
 * ob.keys(x)
 * // → ['a','b','c', 'd']
 *
 * @param {object|any[]} subject The object or array of objects whose keys you wish to retrieve.
 * @param {boolean} [unique=true] Whether the result should contain duplicates or not
 * @returns {string[]} The keys
 */
let keys = function(subject, unique=true) {
  let localKeys = [];

  if(type(subject) === 'array') {
    for(let i of subject){
      localKeys = localKeys.concat(keys(i));
    }

  } else if(type(subject) === 'object') {
    for(let k in subject) {
      localKeys = localKeys.concat(keys(k));
    };
  } else {
    localKeys.push(subject);
  }
  if(unique) {
    return uniques(localKeys);
  } else {
    return localKeys;
  }
};

export default keys;
