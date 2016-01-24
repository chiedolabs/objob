import type from 'type-of';
import flatten from './flatten';
import expand from './expand';
import { makeFlattenedShallow } from '../functions';

/**
 * Returns the object with each value being run throuh the function. (Better description needed. lol)
 *
 * @example
 *
 * let x = {
 *  a: 1,
 *  d: {f: 4, g: [1,2,3]}
 * }
 *
 * ob.mapValues(x, (x) => x*3 )
 * // → {
 * // a: 3,
 * // d: {f: 12, g: [3,6,9]}
 * //}
 * @param {object|any[]} subject The object or array to compare to
 * @param {function} func The function to operate on each value
 * @returns {object|any[]}
 */
let mapValues =  function(subject, func){
  subject = flatten(subject);
  let shallowSubject = makeFlattenedShallow(subject);

  for(let key of Object.keys(shallowSubject)) {
    if(type(shallowSubject[key]) !== 'object' && type(shallowSubject[key]) !== 'array') {
      shallowSubject[key] = func(shallowSubject[key]);
    }
  }

  return expand(shallowSubject);
};

export default mapValues;
