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
 * @param {(object|object[])} x the multiline string
 * @returns {(object|object[])}
 */
let ob = function (x) {
  if(type(x) !== 'array' && type(x) !== 'object') {
    return undefined;
  }

  return {
    keys:() => {
      let keys = [];

      if(type(x) === 'array') {
        for(let i = 0; i < x.length; i++){
          for(let k in x[i]) {
            keys.push(k);
          }
        }
      } else if(type(x) === 'object') {
        for(let k in x) {
          keys.push(k);
        };
      }

      return uniques(keys);
    },
    many: () => {
    },
    with: () => {
    },
    without:() => {
    },
  };
};

export default ob;
