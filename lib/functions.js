'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEmptyObjectOrArray = exports.makeFlattenedShallow = undefined;

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        if (remainder.includes('.') && remainder.split('.').length === 2) {
          shallow = true;
        }
      }
    }

    if (isEmptyObjectOrArray(subject[keyChain])) {
      shallow = false;
    }

    if (!shallow) {
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
var isEmptyObjectOrArray = exports.isEmptyObjectOrArray = function isEmptyObjectOrArray(subject) {
  if ((0, _typeOf2.default)(subject) === 'object' || (0, _typeOf2.default)(subject) === 'array') {
    if (Object.keys(subject).length === 0) {
      return true;
    }
  }

  return false;
};