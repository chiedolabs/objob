'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _clone = require('./clone');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Removes all keys with undefined values from an object and/or arrays of objects.
 *
 * @example
 * let x = {
 *   a: undefined,
 *   b: {
 *     c: undefined,
 *     d: 2,
 *   },
 *   e: [undefined, 1, 2]
 * }
 *
 * ob.filter(x, (x) => x !== undefined))
 * // → {
 * //  b: {
 * //    d: 2,
 * //  },
 * //  e: [1, 2]
 * //}
 *
 *
 * @param {object|any[]} subject The object or array of objects you would like to remove undefined values from.
 * @param {function} validate The function to perform for the filter.
 * @returns {object|any[]} The object or array of objects without any undefined values
 */
var filter = function filter(subject, validate) {
  subject = (0, _clone2.default)(subject);

  var res = undefined;
  if ((0, _typeOf2.default)(subject) === 'array') {
    res = [];
    for (var key in subject) {
      if (validate(subject[key])) {
        res.push(filter(subject[key], validate));
      }
    }
    subject = res;
  } else if ((0, _typeOf2.default)(subject) === 'object') {
    for (var key in subject) {
      if (validate(subject[key]) === true) {
        subject[key] = filter(subject[key], validate);
      } else {
        delete subject[key];
      }
    }
  }

  return subject;
};

exports.default = filter;