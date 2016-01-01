"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var makeFlattenedShallow = exports.makeFlattenedShallow = function makeFlattenedShallow(subject) {
  var resp = {};

  for (var keyChain in subject) {
    var shallow = false;

    for (var keyChain2 in subject) {
      if (keyChain !== keyChain2 && keyChain2.indexOf(keyChain) === 0) {
        shallow = true;
      }
    }

    if (!shallow) {
      resp[keyChain] = subject[keyChain];
    }
  }
  return resp;
};