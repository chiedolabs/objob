'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _merge = require('./merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Takes an object and return a flattened representation of that object that has one level of depth. This allows you to do complex operations on your object while it's in a format that's easier to work with.
 *
 * @example
 * let x = {
 *   a:{
 *     b:{
 *       c: 1,
 *       d: [2,3]
 *     }
 *  }
 * }
 *
 * ob.flatten(x)
 * // → {
 * // 'a.b.c': 1,
 * // 'a.b.d': [2,3]
 * // 'a.b.d[].0': 2,
 * // 'a.b.d[].1': 3',
 * //}
 *
 * @example
 * let x = [
 *  [{
 *    a: {
 *      b: {
 *        c: 1,
 *      },
 *    },
 *  }],
 *  {
 *    b: {
 *      d: [2,3]
 *    }
 *  }
 * ]
 *
 * // → {
 * // '[]0[].0.a.b.c': 1,
 * // '[]1.b.d': [2,3]
 * // '[]1.b.d[].0': 2
 * // '[]1.b.d[].1': 3
 * //}
 *
 *
 * @param {object|any[]} subject The object or array of objects to perform the flattening on
 * @returns {object} The flat representation of the object
 */
var flatten = function flatten(subject) {
  var prefix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
  var depth = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  var res = {};

  if ((0, _typeOf2.default)(subject) === 'object' || (0, _typeOf2.default)(subject) === 'array') {
    for (var i in subject) {
      var tmpPrefix = undefined;
      if (prefix === '') {
        tmpPrefix = '' + i;
      } else {
        tmpPrefix = prefix + '.' + i;
      }
      // If we're dealing with an array at the top level, we need to prefix it with [] to make it clear that we're dealing with
      // an array as opposed to an object
      if (depth === 1 && (0, _typeOf2.default)(subject) === 'array') {
        tmpPrefix = '[]' + tmpPrefix;
      }

      if ((0, _typeOf2.default)(subject[i]) === 'array') {
        tmpPrefix = tmpPrefix + '[]';
      }

      res[tmpPrefix] = subject[i];

      if ((0, _typeOf2.default)(subject[i]) === 'array' || (0, _typeOf2.default)(subject[i]) === 'object') {
        res = (0, _merge2.default)(res, flatten(subject[i], tmpPrefix, depth + 1));
      }
    }
  }

  return res;
};

exports.default = flatten;