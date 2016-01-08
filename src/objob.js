'use strict';

import uniques from 'uniques';
import type from 'type-of';
import contains from 'string-contains';
import { makeFlattenedShallow } from './functions';

/**
 * @namespace
 * @version 2.0.0
 * */
let ob = {
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
  clone: function(subject){
    if(type(subject) === 'object' || type(subject) === 'array') {
      return ob.expand(ob.flatten(subject));
    } else {
      return subject;
    }
  },
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
   * @param {string|string[]} keys The keys of the object or nested object that you would like to omit.
   * @returns {object|any[]} The object or array of objects without the omited keys
   */
  omit: function(subject, keys = []){
    subject = ob.clone(subject);
    let subjectKeys = ob.keys(ob.flatten(subject));
    let keysToKeep = [];

    for( let subjectKey of subjectKeys ) {
      let keepKey = true;

      if(type(keys) === 'array') {
        for( let keyToRemove of keys ){
          if(subjectKey === keyToRemove){
            keepKey = false;
          }
        }
      } else if(type(keys) === 'string') {
        if(subjectKey === keys){
          keepKey = false;
        }
      }

      if(keepKey){
        keysToKeep.push(subjectKey);
      }

    }

    return ob.pick(subject, keysToKeep);
  },
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
  equals: function(subject, subject2){
    subject = ob.flatten(subject);
    subject2 = ob.flatten(subject2);
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
  },
  /**
   * Takes a flattened object and expands it back to a full object or array of objects.
   *
   * @example
   *
   * let x = {
   *  'a.b.c': 1,
   *  'a.b.d': [2,3]
   *  'a.b.d[].0': 2,
   *  'a.b.d[].1': 3,
   * }
   *
   * ob.expand(x)
   * // → {
   * // a: {
   * //   b: {
   * //   c: 1,
   * //   d: [2,3]
   * // }}}
   *
   * @example
   * let x = {
   *  '[]0[].0.a.b.c': 1,
   *  '[]1.b.d': [2,3]
   *  '[]1.b.d[].0': 2
   *  '[]1.b.d[].1': 3
   * }
   *
   * ob.expand(x)
   * // → [
   * // [{
   * //   a: {
   * //     b: {
   * //       c: 1,
   * //     },
   * //   },
   * // }],
   * // {
   * //   b: {
   * //     d: [2,3]
   * //   }
   * // }
   * //]
   *
   * @param {object} subject The object to expand
   * @returns {object|any[]} The expanded object or array of objects.
   */
  expand: function(subject, depth = 1){
    let res;
    subject = makeFlattenedShallow(subject);

    let keyChains =  ob.keys(subject);

    let isArray = false;
    if(true) {
      for(let i of keyChains) {
        if(i.startsWith('[]')) {
          isArray = true;
        }
      }
    }

    // if array, things need to be handled just a little bit differently
    if(isArray) {
      res = [];
      for(let keyChain of keyChains) {
        // This converts something like []0.name.name or []0[].name.name to 0
        const firstKey = keyChain.split('.')[0]; // eg []0[]
        const fullIndex = firstKey.substr(2); // eg. 0[]
        const index = fullIndex.replace('[]', ''); // eg 0
        const nestedKeyChain = keyChain.replace(firstKey + '.', '');

        let tmp = {};
        // Make sure tmp is set correctly based on the object type
        if(type(res[index]) === 'array' || fullIndex.endsWith('[]')) {
          tmp['[]'+nestedKeyChain] = subject[keyChain];
        } else {
          tmp[nestedKeyChain] = subject[keyChain];
        }

        if(keyChain.split('.').length === 1) {
          // If there is no nested data just add to the array
          res[index] = subject[keyChain];
        } else if(type(res[index]) === 'object' || type(res[index]) === 'array') {
          // If the next keyChain is an object
          res[index] = ob.merge(res[index], ob.expand(tmp, depth+1));
        } else if(fullIndex.endsWith('[]')) {
          res[index] = ob.expand(tmp, depth+1);
        } else {
          res[index] = ob.expand(tmp, depth+1);
        }
      }
    } else if(keyChains.length === 1) {
      // When the object is just {'example.example': y}
      // One key and one value
      let tmp = {};
      let keyChain = keyChains[0]; // something like 'first.another.another'
      let value = subject[keyChain];
      let count;

      res = tmp; // Pointing to tmp so that we have a place holder before nesting
      count = 1;
      let keys = keyChain.split('.');
      for(let key of keys) {
        if(count === keys.length) {
          tmp[key.replace('[]','')] = value;
        } else {
          let isArray = contains(key, '[]');
          if(isArray) {
            key = key.replace('[]','');
            tmp[key] = [];
          } else {
            tmp[key] = {};
          }

          tmp = tmp[key];
        }
        count++;
      }

    } else {
      // If multiple keychains in the object, simplify our logic a bit
      res = {};
      for(let i in subject) {
        let tmp = {};
        tmp[i] = subject[i];
        res = ob.merge(res, ob.expand(tmp, depth+1));
      }
    }
    return res;
  },
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
  flatten: function(subject, prefix='', depth = 1){
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
          res = ob.merge(res, ob.flatten(subject[i],tmpPrefix, depth+1));
        }
      }
    }

    return res;
  },
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
  keys:function(subject, unique=true) {
    let keys = [];

    if(type(subject) === 'array') {
      for(let i of subject){
        keys = keys.concat(ob.keys(i));
      }

    } else if(type(subject) === 'object') {
      for(let k in subject) {
        keys = keys.concat(ob.keys(k));
      };
    } else {
      keys.push(subject);
    }
    if(unique) {
      return uniques(keys);
    } else {
      return keys;
    }
  },
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
  filter: (subject, validate) => {
    subject = ob.clone(subject);

    let res;
    if(type(subject) === 'array') {
      res = [];
      for(let key in subject) {
        if(validate(subject[key])) {
          res.push(ob.filter(subject[key], validate));
        }
      }
      subject = res;
    } else if(type(subject) === 'object') {
      for(let key in subject) {
        if(validate(subject[key]) === true ) {
          subject[key] = ob.filter(subject[key], validate);
        } else {
          delete subject[key];
        }
      }
    }

    return subject;
  },
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
  mapValues: function(subject, func){
    subject = ob.flatten(subject);
    let shallowSubject = makeFlattenedShallow(subject);

    for(let key of Object.keys(shallowSubject)) {
      if(type(shallowSubject[key]) !== 'object' && type(shallowSubject[key]) !== 'array') {
        shallowSubject[key] = func(shallowSubject[key]);
      }
    }

    return ob.expand(shallowSubject);
  },
  /**
   * Merges the enumerable attributes of two objects deeply.
   *
   * @example
   * let x = {
   *  a: {b: 1},
   * }
   *
   * let y = {
   *  a: {c: 1},
   * }
   *
   * ob.merge(x, y);
   * // → {a: {b: 1, c:1}}
   *
   * @param {object|any[]} target The object or array of objects to merge into
   * @param {object|any[]} src The object or array of objects to merge from
   * @returns {object|any[]} The merged object or array
   */
  merge: function(target, src) {
    let array = Array.isArray(src);
    let dst = array && [] || {};

    if (array) {
      target = target || [];
      dst = dst.concat(target);
      src.forEach((e, i) => {
        if (typeof dst[i] === 'undefined') {
          dst[i] = e;
        } else if (typeof e === 'object') {
          dst[i] = ob.merge(target[i], e);
        } else {
          if (target.indexOf(e) === -1) {
            dst.push(e);
          }
        }
      });
    } else {
      if (target && typeof target === 'object') {
        Object.keys(target).forEach((key) => {
          dst[key] = target[key];
        });
      }
      Object.keys(src).forEach((key) => {
        if (typeof src[key] !== 'object' || !src[key]) {
          dst[key] = src[key];
        }
        else {
          if (!target[key]) {
            dst[key] = src[key];
          } else {
            dst[key] = ob.merge(target[key], src[key]);
          }
        }
      });
    }

    return dst;
  },
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
   * @param {string|string[]} keys The keys you would like to pick
   * @returns {object|any[]} The object or array of objects with only the picked keys.
   */
  pick: (subject, keys = []) => {
    subject = ob.clone(subject);
    let resp;

    resp = {};

    let flat = ob.flatten(subject);

    for (let actualKey in flat){
      if(type(keys) === 'array') {
        for (let desiredKey of keys){
          if(actualKey === desiredKey) {
            resp[actualKey] = flat[actualKey];
          }
        }
      } else if(type(keys) === 'string') {
        if(actualKey === keys) {
          resp[actualKey] = flat[actualKey];
        }
      }
    }

    return ob.expand(resp);
  },
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
  values:(subject, unique=true) => {
    let values = [];

    if(type(subject) === 'array') {
      for(let i of subject){
        values = values.concat(ob.values(i));
      }

    } else if(type(subject) === 'object') {
      for(let k in subject) {
        values = values.concat(ob.values(subject[k]));
      };
    } else {
      values.push(subject);
    }
    if(unique) {
      return uniques(values);
    } else {
      return values;
    }
  },
};

if (typeof module !== 'undefined') {
  module.exports = ob;
}
