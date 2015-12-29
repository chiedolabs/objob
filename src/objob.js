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
      } else if(type(subject) === 'object') {
        for(let k in subject) {
          keys.push(k);
        };
      }

      return uniques(keys);
    },
    many: (num = 2) => {
      let arr;
      if(type(subject) === 'array') {
        return subject;
      } else if(type(subject) === 'object') {
        for(let i = 0; i < num.length; i++){
          arr.push(subject);
        }
      }

      return arr;
    },
    with: () => {
    },
    without:() => {
    },
  };
};

export default ob;
