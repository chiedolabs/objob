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
        shallow = true;
      }
    }

    if(!shallow) {
      resp[keyChain] = subject[keyChain];
    }
  }
  return resp;
};
