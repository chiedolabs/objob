import type from 'type-of';

/*
 *  Returns a shallow version of the shallow object to remove redundancy
 *  and simplify complex operations.
 *
 *  @param {object} subject the flattened object to perform the operation on.
 *  @returns {object}
 */
export let makeFlattenedShallow = (subject) => {
  let resp = {};

  for(let keyChain in subject){
    let shallow = false;

    for(let keyChain2 in subject){
      if(keyChain !== keyChain2 && keyChain2.indexOf(keyChain) === 0) {
        // also make sure that if the different still contains a period
        // otherwise we could be dealing with similar keys like 'name' and 'names'
        let remainder = keyChain2.replace(keyChain);
        if(remainder.includes('.') && remainder.split('.').length === 2) {
          shallow = true;
        }
      }
    }

    if(isEmptyObjectOrArray(subject[keyChain])) {
      shallow = false;
    }

    if(!shallow) {
      resp[keyChain] = subject[keyChain];
    }
  }
  return resp;
};


/*
 *  Returns true if we're dealing with an empty array or object
 *
 *  @param {object} subject the array or object to check
 *  @returns {boolean}
 */
export let isEmptyObjectOrArray = function(subject) {
  if(type(subject) === 'object' || type(subject) === 'array'){
    if(Object.keys(subject).length === 0) {
      return true;
    }
  }

  return false;
};
