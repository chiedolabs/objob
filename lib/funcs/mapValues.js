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

var _functions = require('../functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the object with each value being run throuh the function. (Better description needed. lol)
 *
 * @example
 *
 * let x = {
 *  a: 1,
 *  d: {f: 4, g: [1,2,3]}
 * }
 *
 * ob.mapValues(x, (x) => x*3 )
 * // → {
 * // a: 3,
 * // d: {f: 12, g: [3,6,9]}
 * //}
 * @param {object|any[]} subject The object or array to compare to
 * @param {function} func The function to operate on each value
 * @returns {object|any[]}
 */
var mapValues = function mapValues(subject, func) {
  subject = (0, _flatten2.default)(subject);
  var shallowSubject = (0, _functions.makeFlattenedShallow)(subject);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(shallowSubject)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if ((0, _typeOf2.default)(shallowSubject[key]) !== 'object' && (0, _typeOf2.default)(shallowSubject[key]) !== 'array') {
        shallowSubject[key] = func(shallowSubject[key]);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return (0, _expand2.default)(shallowSubject);
};

exports.default = mapValues;