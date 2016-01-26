'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _uniques = require('uniques');

var _uniques2 = _interopRequireDefault(_uniques);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Return all keys for an object recursively, including keys in objects that are in arrays.
 *
 * @example
 * let x = {
 *   a: 1,
 *   b: 2,
 *   c: 3
 * }
 *
 * ob.keys(x)
 * // → ['a','b','c']
 *
 * @example
 * let x = [{ a: 1, b: 2, c: 3}, {d: 1}]
 *
 * ob.keys(x)
 * // → ['a','b','c', 'd']
 *
 * @param {object|any[]} subject The object or array of objects whose keys you wish to retrieve.
 * @param {boolean} [unique=true] Whether the result should contain duplicates or not
 * @returns {string[]} The keys
 */
var keys = function keys(subject) {
  var unique = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  var localKeys = [];

  if ((0, _typeOf2.default)(subject) === 'array') {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = subject[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var i = _step.value;

        localKeys = localKeys.concat(keys(i));
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
  } else if ((0, _typeOf2.default)(subject) === 'object') {
    for (var k in subject) {
      localKeys = localKeys.concat(keys(k));
    };
  } else {
    localKeys.push(subject);
  }
  if (unique) {
    return (0, _uniques2.default)(localKeys);
  } else {
    return localKeys;
  }
};

exports.default = keys;