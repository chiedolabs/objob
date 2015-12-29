'use strict';

import uniques from 'uniques';

let type = function(x) {
  if( Object.prototype.toString.call(x) === '[object Array]' ) {
    return 'array';
  } else if(typeof x === 'object') {
    return 'object';
  }
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
    keys:() => {
      let keys = [];

      if(type(subject) === 'array') {
        for(let i = 0; i < subject.length; i++){
          for(let k in subject[i]) {
            keys.push(k);
          }
        }
      } else {
        for(let k in subject) {
          keys.push(k);
        };
      }

      return uniques(keys);
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

        for (let key of keys) {
          for(let i in subject) {
            resp[i] = resp[i] || resp;
            resp[i][key] = subject[key];
          }
        }
      } else {
        resp = {};

        for (let key of keys) {
          resp[key] = subject[key];
        }
      }

      return resp;
    },
    without:() => {
    },
  };
};

export default ob;
