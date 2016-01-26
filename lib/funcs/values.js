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
 * Returns all values for a given object or array recursively.
 *
 * @example
 * let x = {
 *   a: 1,
 *   b: 2,
 *   c: 3
 * }
 *
 * ob.values(x)
 * // → [1, 2, 3]
 *
 * @example
 * let x = {
 *   a: 1,
 *   b: 2,
 *   c: 3,
 *   d: [4]
 * }
 *
 * ob.values(x)
 * // → [1, 2, 3, 4]
 *
 * @param {object|any[]} subject The object or array of objects to get the values of
 * @param {boolean} [unique=true] Whether the result should contain duplicates or not
 * @returns {any[]}
 */
var values = function values(subject) {
  var unique = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  var localValues = [];

  if ((0, _typeOf2.default)(subject) === 'array') {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = subject[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var i = _step.value;

        localValues = localValues.concat(values(i));
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
      localValues = localValues.concat(values(subject[k]));
    };
  } else {
    localValues.push(subject);
  }
  if (unique) {
    return (0, _uniques2.default)(localValues);
  } else {
    return localValues;
  }
};

exports.default = values;