import type from 'type-of';
import merge from './merge';

/**
 * Takes an object and return a flattened representation of that object that has one level of depth. This allows you to do complex operations on your object while it's in a format that's easier to work with.
 *
 * @example
 * let x = {
 *   a:{
 *     b:{
 *       c: 1,
 *       d: [2,3]
 *     }
 *  }
 * }
 *
 * ob.flatten(x)
 * // → {
 * // 'a.b.c': 1,
 * // 'a.b.d': [2,3]
 * // 'a.b.d[].0': 2,
 * // 'a.b.d[].1': 3',
 * //}
 *
 * @example
 * let x = [
 *  [{
 *    a: {
 *      b: {
 *        c: 1,
 *      },
 *    },
 *  }],
 *  {
 *    b: {
 *      d: [2,3]
 *    }
 *  }
 * ]
 *
 * // → {
 * // '[]0[].0.a.b.c': 1,
 * // '[]1.b.d': [2,3]
 * // '[]1.b.d[].0': 2
 * // '[]1.b.d[].1': 3
 * //}
 *
 *
 * @param {object|any[]} subject The object or array of objects to perform the flattening on
 * @returns {object} The flat representation of the object
 */
let flatten = function(subject, prefix='', depth = 1){
  let res = {};

  if(type(subject) === 'object' || type(subject) === 'array'){
    for(let i in subject) {
      let tmpPrefix;
      if(prefix === '') {
        tmpPrefix = `${i}`;
      } else {
        tmpPrefix = `${prefix}.${i}`;
      }
      // If we're dealing with an array at the top level, we need to prefix it with [] to make it clear that we're dealing with
      // an array as opposed to an object
      if(depth === 1 && type(subject) === 'array') {
        tmpPrefix = `[]${tmpPrefix}`;
      }

      if(type(subject[i]) === 'array') {
        tmpPrefix = tmpPrefix + '[]';
      }

      res[tmpPrefix] = subject[i];

      if(type(subject[i]) === 'array' || type(subject[i]) === 'object') {
        res = merge(res, flatten(subject[i],tmpPrefix, depth+1));
      }
    }
  }

  return res;
};

export default flatten;
