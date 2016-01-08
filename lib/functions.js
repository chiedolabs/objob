'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 *  Returns a shallow version of the shallow object to remove redundancy
 *  and simplify complex operations.
 *
 *  @param {object} subject the flattened object to perform the operation on.
 *  @returns {object}
 */
var makeFlattenedShallow = exports.makeFlattenedShallow = function makeFlattenedShallow(subject) {
  var resp = {};

  for (var keyChain in subject) {
    var shallow = false;

    for (var keyChain2 in subject) {
      if (keyChain !== keyChain2 && keyChain2.indexOf(keyChain) === 0) {
        // also make sure that if the different still contains a period
        // otherwise we could be dealing with similar keys like 'name' and 'names'
        var remainder = keyChain2.replace(keyChain);
        if (remainder.includes('.') && remainder.split('.').length === 1) {
          shallow = true;
        }
      }
    }

    if (!shallow) {
      resp[keyChain] = subject[keyChain];
    }
  }
  return resp;
};