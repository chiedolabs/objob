'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _flatten = require('./flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _expand = require('./expand');

var _expand2 = _interopRequireDefault(_expand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Performs a deep clone of an object or array.
 *
 * @example
 * let x = {
 *  a: 1,
 *  d: {f: 4}
 * }
 *
 * y = ob.clone(x)
 *
 * (x.a === y.a && x.d.f === y.d.f)
 * // → true
 *
 * y === x
 * // → false
 *
 * @param {object|any[]} subject The object or array to clone.
 * @returns {object|any[]} The cloned object or arraay
 */
var clone = function clone(subject) {
  if ((0, _typeOf2.default)(subject) === 'object' || (0, _typeOf2.default)(subject) === 'array') {
    return (0, _expand2.default)((0, _flatten2.default)(subject));
  } else {
    return subject;
  }
};

exports.default = clone;