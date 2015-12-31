'use strict';

import uniques from 'uniques';

let type = function(x) {
  if( Object.prototype.toString.call(x) === '[object Array]' ) {
    return 'array';
  } else if(typeof x === 'object') {
    return 'object';
  } else {
    return typeof x;
  }
};

let makeShallow = (subject) => {
  let resp = {};

  for(let keyChain in subject){
    let shallow = false;

    for(let keyChain2 in subject){
      if(keyChain !== keyChain2 && keyChain2.indexOf(keyChain) === 0) {
        shallow = true;
      }
    }

    if(!shallow) {
      resp[keyChain] = subject[keyChain];
    }
  }
  return resp;
};

/**
 * Returns an objob object
 *
 * @param {(object|object[])} subject
 * @returns {(object|object[])}
 */
let ob = function (subject) {

  return {
    deselect: function(keys = []){
      let allKeys = ob(ob(subject).flatten()).keys();
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

      return ob(subject).select(keysToKeep);
    },
    expand: function(){
      let res;

      if(type(subject) === 'array') {
        res = [];

        for(let i of subject){
          res = res.concat(ob(i).expand());
        }

        return res;
      } else {
        subject = makeShallow(subject);

        // Get the empty object ready for the data
        for(let keyChain in subject){

          let subkeys = keyChain.split('.');
          let tmp = {};
          let obj = tmp;

          let count = 1;
          for(let subkey of subkeys) {
            // Set the value if the end of the keys
            console.log('Line');
            console.log(tmp);
            console.log(count);
            console.log(subkeys.length);
            if(count === subkeys.length && type(tmp) === 'object') {
              subkey = subkey.replace(/\[\]/g, '');
              tmp[subkey] = subject[keyChain];
            } else if(type(tmp) === 'array') {
              tmp[subkey] = subject[keyChain];
            } else {
              // If array create the array, else create the object
              if(subkey.indexOf('[]') !== -1){
                subkey = subkey.replace(/\[\]/g, '');
                tmp[subkey] = [];
              } else {
                tmp[subkey] = {};
              }
              tmp = tmp[subkey];
            }
            count++;
          }

          // TODO: Figure out how to make the data ony do a shallow copy.
          // Right now, body is copying all the data for body.feet for example.
          // I only really want one level of information from each key. The rest can be
          // discarded
          res = {...res, ...obj};
        }
      }
      return res;
    },
    flatten: function(prefix='', shallow=false, counter = 0){
      let res;

      if(type(subject) === 'array' && counter === 0) {
        res = [];

        for(let i of subject){
          res = res.concat(ob(i).flatten(prefix, shallow, counter++));
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

            if(type(subject[i]) === 'array' && shallow) {
              res = {...res, ...ob(subject[i][0]).flatten(tmpPrefix, shallow, counter++)};
            } else {
              res = {...res, ...ob(subject[i]).flatten(tmpPrefix, shallow, counter++)};
            }
          }
        }
      }
      return res;
    },
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
    select: (keys = []) => {
      let resp;

      if(type(subject) === 'array') {
        resp = [];

        for(let i of subject){
          resp = resp.concat(ob(i).select(keys));
        }
      } else {
        resp = {};

        let flat = ob(subject).flatten();

        for (let actualKey in flat){
          for (let desiredKey of keys){
            if(actualKey === desiredKey) {
              resp[actualKey] = flat[actualKey];
            }
          }
        }
        resp = ob(resp).expand();
      }

      return resp;
    },
    shallow: () => {
      let x = ob(subject).flatten();
      x = makeShallow(x);

      return ob(x).expand();
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
  };
};

if (typeof module !== 'undefined') {
  module.exports = ob;
}
