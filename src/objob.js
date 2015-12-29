'use strict';
let type = function(x) {
  if( Object.prototype.toString.call(x) === '[object Array]' ) {
    return 'array';
  } else if(typeof x === 'object') {
    return 'object';
  }
};

Array.prototype.getUnique = function (createArray) {
  createArray = createArray === true ? true : false;
  let temp = JSON.stringify(this);
  temp = JSON.parse(temp);
  if (createArray) {
    let unique = temp.filter((elem, pos) => {
      return temp.indexOf(elem) === pos;
    });
    return unique;
  }
  else {
    let unique = this.filter((elem, pos) => {
      return this.indexOf(elem) === pos;
    });
    this.length = 0;
    this.splice(0, 0, unique);
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
        for(let i = 0; i < x.length; x++){
          for(let k in x) {
            keys.push(k);
          }
        }
      } else if(type(x) === 'object') {
        for(let k in x) {
          keys.push(k);
        };
      }
      return keys.getUnique();
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
