import flatten from './flatten';
import { makeFlattenedShallow } from '../functions';

/**
 * Returns true if two objects or arrays have the same contents as one another.
 *
 * @example
 *
 * let x = {
 *  a: 1,
 *  d: {f: 4}
 * }
 *
 * let y = {
 *  a: 1,
 *  d: {f: 4}
 * }
 *
 * ob.equals(x, y)
 * // → true
 *
 * ob.equals([x, x], [y, y])
 * // → true
 *
 * @param {object|any[]} subject The object or array to compare to
 * @param {object|any[]} subject2 The object or compare against
 * @returns {boolean}
 */
let equals = function(subject, subject2){
  subject = flatten(subject);
  subject2 = flatten(subject2);
  let notEqual = false;

  if(Object.keys(subject).length !== Object.keys(subject2).length) {
    notEqual = true;
  }

  let shallowSubject = makeFlattenedShallow(subject);
  let shallowSubject2 = makeFlattenedShallow(subject2);
  for(let key in Object.keys(shallowSubject)) {
    if(shallowSubject[key] !== shallowSubject2[key]) {
      notEqual = true;
    }
  }

  return !notEqual;
};

export default equals;
