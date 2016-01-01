'use strict';

import uniques from 'uniques';
import type from 'type-of';
import contains from 'string-contains';
import merge from 'deepmerge';
import { makeFlattenedShallow } from './functions';

/*
 *
 *  @namespace ob
 */
let ob = {
  /*
   *  Returns an object without the given keys.
   *
   *  @param {string[]} keys
   *  @returns {object}
   */
  deselect: function(subject, keys = []){
    let allKeys = ob.keys(ob.flatten(subject));
    let keysToKeep = [];

    for( let subjectKey of allKeys ) {
      let keepKey = true;

      for( let keyToRemove of keys ){
        if(subjectKey === keyToRemove){
          keepKey = false;
        }
      }

      if(keepKey){
        keysToKeep.push(subjectKey);
      }
    }

    return ob.select(subject, keysToKeep);
  },
  /*
   *  Takes a flattened object or array and expands it back to a full object
   *  or array.
   *
   *  @returns {object|object[]}
   */
  expand: function(subject, depth = 1){
    let res;
    subject = makeFlattenedShallow(subject);

    // Determine if an array is represented by the flattened object
    let rootObjectPresent = true;
    if(depth === 1) {
      rootObjectPresent = false;
      for(let key in subject) {
        let rootArrayPresent = key.match(/^\d/ig);

        rootObjectPresent = (rootObjectPresent || !rootArrayPresent);
      }
    }

    if(rootObjectPresent === false && depth === 1) {
      res = [];
      for(let key in subject) {
        res.push(subject[key]);
      }
    } else {
      let keyChains =  ob.keys(subject);

      // When the object is just {'example.example': y}
      // One key and one value
      if(keyChains.length === 1) {
        let tmp = {};
        let keyChain = keyChains[0]; // something like 'first.another.another'
        let value = subject[keyChain];
        let count;

        res = tmp; // Poining to tmp so that we have a place holder before nesting
        count = 1;
        let keys = keyChain.split('.');
        for(let key of keys) {
          if(count === keys.length) {
            tmp[key] = value;
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
          res = merge(res, ob.expand(tmp, ++depth));
        }
      }
    }
    return res;
  },
  /*
   *  Takes an object or array and return a flattened representation of that object or array
   *  that has one level of depth. This allows you to do complex operations on your object
   *  while it's in a format that's easier to work with.
   *
   *  @returns {object|object[]}
   */
  flatten: function(subject, prefix='', depth = 1){
    let res;

    if(type(subject) === 'array' && depth === 1) {
      res = [];

      for(let i of subject){
        res = res.concat(ob.flatten(i, prefix, ++depth));
      }

      return res;
    } else {
      res = {};

      if(type(subject) === 'object' || type(subject) === 'array'){

        for(let i in subject) {
          let tmpPrefix;
          if(prefix === '') {
            tmpPrefix = `${i}`;
          } else {
            tmpPrefix = `${prefix}.${i}`;
          }

          if(type(subject[i]) === 'array') {
            tmpPrefix = tmpPrefix + '[]';
          }

          res[tmpPrefix] = subject[i];

          res = merge(res, ob.flatten(subject[i],tmpPrefix, ++depth));
        }
      }
    }
    return res;
  },
  /*
   * Return all keys for an object or all keys of each object in an array.
   *
   *  @returns {string[]}
   */
  keys:function(subject) {
    let keys = [];

    if(type(subject) === 'array') {
      for(let i of subject){
        keys = keys.concat(ob.keys(i));
      }
    } else {
      for(let k in subject) {
        keys.push(k);
      };
    }

    return uniques(keys);
  },
  /*
   * Returns many of the object. If an array is used, it will just return
   * the given array.
   *
   *  @returns {object[]}
   */
  many: (subject, num = 2) => {
    let arr = [];

    if(type(subject) === 'array') {
      return subject;
    } else {
      for(let i = 0; i < num; i++){
        arr.push(subject);
      }
    }

    return arr;
  },
  /*
   * Removes all keys with undefined values from an object or array
   *
   *  @returns {object|object[]}
   */
  removeUndefs: (subject) => {
    let res;

    if(type(subject) === 'array') {
      res = [];
      for(let key in subject) {
        if(subject[key] === undefined) {
        } else {
          res.push(ob.removeUndefs(subject[key]));
        }
      }
    } else if(type(subject) === 'object') {
      for(let key in subject) {
        if(subject[key] === undefined) {
          delete subject[key];
        } else {
          subject[key] = ob.removeUndefs(subject[key]);
        }
      }

      return subject;
    } else {
      return subject;
    }

    return res;
  },
  /*
   *  Returns an object only with the given keys.
   *
   *  @param {string[]} keys
   *  @returns {object}
   */
  select: (subject, keys = []) => {
    let resp;

    if(type(subject) === 'array') {
      resp = [];

      for(let i of subject){
        resp = resp.concat(ob.select(i, keys));
      }
    } else {
      resp = {};

      let flat = ob.flatten(subject);

      for (let actualKey in flat){
        for (let desiredKey of keys){
          if(actualKey === desiredKey) {
            resp[actualKey] = flat[actualKey];
          }
        }
      }
      resp = ob.expand(resp);
    }

    return resp;
  },
  /*
   * Returns all values for a given object or array as an array.
   *
   *  @returns {any[]}
   */
  values:(subject) => {
    let values = [];

    if(type(subject) === 'array') {
      for(let i of subject){
        values = values.concat(ob.values(i));
      }
    } else {
      for(let k in subject) {
        values.push(subject[k]);
      };
    }

    return uniques(values);
  },
};

if (typeof module !== 'undefined') {
  module.exports = ob;
}
