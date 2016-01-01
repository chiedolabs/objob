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
