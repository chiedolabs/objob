'use strict';

import uniques from 'uniques';

let type = function(x) {
  if( Object.prototype.toString.call(x) === '[object Array]' ) {
    return 'array';
  } else if(typeof x === 'object') {
    return 'object';
  }
};

let getNestedObject = function(ob, key) {
  let keys = key.split('.');
  let newOb = {};

  if(keys.length > 1) {
    // Get the key without the fist word separated by a period
    let newKey = key.replace(/^(\w|\di|_|$)*./g, '');
    newOb[keys[0]] = getNestedObject(ob[keys[0]], newKey);

  } else {
    newOb[key] = ob[key];
  }

  return newOb;
};

/**
 * Returns an objob object
 *
 * @param {(object|object[])} subject
 * @returns {(object|object[])}
 */
let ob = function (subject) {
  if(type(subject) !== 'array' && type(subject) !== 'object') {
    return undefined;
  }

  return {
    keys:function() {
      let keys = [];

      if(type(subject) === 'array') {
        for(let i of subject){
          keys = keys.concat(ob(i).keys());
        }
      } else {
        for(let k in subject) {
          keys.push(k);
        };
      }

      return uniques(keys);
    },
    values:() => {
      let values = [];

      if(type(subject) === 'array') {
        for(let i of subject){
          values = values.concat(ob(i).values());
        }
      } else {
        for(let k in subject) {
          values.push(subject[k]);
        };
      }

      return uniques(values);
    },
    many: (num = 2) => {
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
    with: (keys = []) => {
      let resp;

      if(type(subject) === 'array') {
        resp = [];

        for(let i of subject){
          resp = resp.concat(ob(i).with(keys));
        }
      } else {
        resp = {};

        for (let key of keys) {
          if(key.split('.').length > 1) {
            let searchKey = key.replace(/^(\w|\di|_|$)*./g, '');
            let currentKey = key.replace('.'+searchKey, '');
            resp[currentKey] = getNestedObject(subject[currentKey], searchKey);
          } else {
            resp[key] = subject[key];
          }
        }
      }

      return resp;
    },
    without: function(keys = []){
      let allKeys = this.keys(subject);
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

      return this.with(keysToKeep);
    },
  };
};

if (typeof module !== 'undefined') {
  module.exports = ob;
}
