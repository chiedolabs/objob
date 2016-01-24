import type from 'type-of';
import clone from './clone';

/**
 * Removes all keys with undefined values from an object and/or arrays of objects.
 *
 * @example
 * let x = {
 *   a: undefined,
 *   b: {
 *     c: undefined,
 *     d: 2,
 *   },
 *   e: [undefined, 1, 2]
 * }
 *
 * ob.filter(x, (x) => x !== undefined))
 * // → {
 * //  b: {
 * //    d: 2,
 * //  },
 * //  e: [1, 2]
 * //}
 *
 *
 * @param {object|any[]} subject The object or array of objects you would like to remove undefined values from.
 * @param {function} validate The function to perform for the filter.
 * @returns {object|any[]} The object or array of objects without any undefined values
 */
let filter =  (subject, validate) => {
  subject = clone(subject);

  let res;
  if(type(subject) === 'array') {
    res = [];
    for(let key in subject) {
      if(validate(subject[key])) {
        res.push(filter(subject[key], validate));
      }
    }
    subject = res;
  } else if(type(subject) === 'object') {
    for(let key in subject) {
      if(validate(subject[key]) === true ) {
        subject[key] = filter(subject[key], validate);
      } else {
        delete subject[key];
      }
    }
  }

  return subject;
};

export default filter;
