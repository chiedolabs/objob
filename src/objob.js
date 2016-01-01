'use strict';

import uniques from 'uniques';
import type from 'type-of';
import contains from 'string-contains';

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

      subject = makeShallow(subject);

      if(type(subject) === 'array') {
        res = [];
        for(let i in subject) {
          res.push(subject[i]);
        }
      } else if(type(subject)) {
        let keyChains =  ob(subject).keys();

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
              // If we're at the last key, then set the value
              if(type(tmp) === 'array') {
                tmp.push(ob(value).expand());
              } else {
                // May not even need the expand here
                tmp[key] = value;
              }
            } else {
              let isArray = contains(key, '[]');
              if(isArray) {
                key = key.replace('[]','');
                tmp[key] = [];
                tmp = tmp[key];
              } else {
                if(type(tmp) === 'array') {
                  tmp.push({});
                  tmp = tmp[tmp.length - 1];
                } else {
                  tmp[key] = {};
                  tmp = tmp[key];
                }
              }
            }
            count++;
          }

        } else {
          // If multiple keychains in the object, simplify our logic a bit
          res = {};
          for(let i in subject) {
            let tmp = {};
            tmp[i] = subject[i];
            console.dir(res);
            console.dir(ob(tmp).expand());
            res = {...res, ...ob(tmp).expand()};
          }
        }
      } else {
        // Base case
        return subject;
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
