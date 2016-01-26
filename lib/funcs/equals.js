'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flatten = require('./flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _functions = require('../functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns true if two objects or arrays have the same contents as one another.
 *
 * @example
 *
 * let x = {
 *  a: 1,
 *  d: {f: 4}
 * }
 *
 * let y = {
 *  a: 1,
 *  d: {f: 4}
 * }
 *
 * ob.equals(x, y)
 * // → true
 *
 * ob.equals([x, x], [y, y])
 * // → true
 *
 * @param {object|any[]} subject The object or array to compare to
 * @param {object|any[]} subject2 The object or compare against
 * @returns {boolean}
 */
var equals = function equals(subject, subject2) {
  subject = (0, _flatten2.default)(subject);
  subject2 = (0, _flatten2.default)(subject2);
  var notEqual = false;

  if (Object.keys(subject).length !== Object.keys(subject2).length) {
    notEqual = true;
  }

  var shallowSubject = (0, _functions.makeFlattenedShallow)(subject);
  var shallowSubject2 = (0, _functions.makeFlattenedShallow)(subject2);
  for (var key in Object.keys(shallowSubject)) {
    if (shallowSubject[key] !== shallowSubject2[key]) {
      notEqual = true;
    }
  }

  return !notEqual;
};

exports.default = equals;