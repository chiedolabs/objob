import type from 'type-of';
import flatten from './flatten';
import expand from './expand';

/**
 * Performs a deep clone of an object or array.
 *
 * @example
 * let x = {
 *  a: 1,
 *  d: {f: 4}
 * }
 *
 * y = ob.clone(x)
 *
 * (x.a === y.a && x.d.f === y.d.f)
 * // → true
 *
 * y === x
 * // → false
 *
 * @param {object|any[]} subject The object or array to clone.
 * @returns {object|any[]} The cloned object or arraay
 */
let clone = function(subject){
  if(type(subject) === 'object' || type(subject) === 'array') {
    return expand(flatten(subject));
  } else {
    return subject;
  }
};

export default clone;
