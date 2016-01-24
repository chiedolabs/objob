import type from 'type-of';
import contains from 'string-contains';
import { makeFlattenedShallow } from '../functions';
import keys from './keys';
import merge from './merge';

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
let expand = function(subject, depth = 1){
  let res;
  subject = makeFlattenedShallow(subject);

  let keyChains =  keys(subject);

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
        res[index] = merge(res[index], expand(tmp, depth+1));
      } else if(fullIndex.endsWith('[]')) {
        res[index] = expand(tmp, depth+1);
      } else {
        res[index] = expand(tmp, depth+1);
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
      res = merge(res, expand(tmp, depth+1));
    }
  }
  return res;
};

export default expand;
