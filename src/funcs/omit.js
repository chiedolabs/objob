import type from 'type-of';
import clone from './clone';
import flatten from './flatten';
import expand from './expand';

/**
 * Returns an object without the given keys or an array with each object not having the given keys.
 *
 * @example
 * let x = {
 *  c: 3,
 *  d: {e: 4, f: [5,6]},
 *  g: [7, 8]
 * }
 *
 * ob.omit(x, ['d.e','d.f[].0','g[].1']);
 * // → {
 * //  c:3,
 * //  d: {
 * //    f: [6]
 * //  },
 * //  g:[7]
 * //}
 *
 * @example
 * let x = [
 *  3,
 *  {e: 4, f: [5,6]},
 *  [7, 8]
 * ]
 *
 * ob.omit(x, ['[]1.e','[]1.f[].0','[]2[].1']);
 * // → {
 * //  3,
 * //  {
 * //    f: [6]
 * //  },
 * //  [7]
 * //}
 *
 * @param {object|any[]} subject The object or array to perform the omit operation on.
 * @param {string|string[]} input The keys or key of the object or nested object that you would like to omit.
 * @returns {object|any[]} The object or array of objects without the omited keys
 */
let omit = function(subject, input = []){
  subject = clone(subject);
  let flattened = flatten(subject);
  let updatedFlattened = {};

  for(let key in flattened) {
    if(type(input) === 'array') {
      let matchFound = false;
      for(let inputKey of input) {
        let re = new RegExp('^'+inputKey+'\\..*','g');
        if(key.match(re) || key === inputKey) {
          matchFound = true;
        }
      }

      if(matchFound === false) {
        updatedFlattened[key] = flattened[key];
      }
    } else {
      let re = new RegExp('^'+input+'\\..*','g');
      if(!key.match(re) && key !== input) {
        updatedFlattened[key] = flattened[key];
      }
    }
  }
  return expand(updatedFlattened);
};

export default omit;
