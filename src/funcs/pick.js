import type from 'type-of';
import expand from './expand';
import flatten from './flatten';
import clone from './clone';

/**
 * Returns an object only with the given keys. If an array is passed, it will return an array of each given object only having the picked keys.
 *
 * @example
 * let x = {
 *  c: 3,
 *  d: {e: 4, f: [5,6]},
 *  g: [7, 8]
 * }
 *
 * ob.pick(x, ['d.e','d.f[].0','g[].1']);
 * // → {d: {e: 4, f: [5]}, g: [8]}
 *
 * @param {object|any[]} subject The object or array of objects to perform the pick operation on
 * @param {string|string[]} input The keys or key you would like to pick
 * @returns {object|any[]} The object or array of objects with only the picked keys.
 */
let pick = (subject, input = []) => {
  subject = clone(subject);
  let flattened = flatten(subject);
  let updatedFlattened = {};

  for(let key in flattened) {
    if(type(input) === 'array') {
      let matchFound = false;
      for(let inputKey of input) {
        let re = new RegExp('^'.inputKey+'\\..*','g');
        if(key.match(re) || key === inputKey) {
          matchFound = true;
        }
      }

      if(matchFound === true) {
        updatedFlattened[key] = flattened[key];
      }
    } else {
      let re = new RegExp('^'+input+'\\.','g');
      if(key.match(re) || key === input) {
        updatedFlattened[key] = flattened[key];
      }
    }
  }
  return expand(updatedFlattened);
};

export default pick;
