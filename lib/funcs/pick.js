'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _expand = require('./expand');

var _expand2 = _interopRequireDefault(_expand);

var _flatten = require('./flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _clone = require('./clone');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns an object only with the given keys. If an array is passed, it will return an array of each given object only having the picked keys.
 *
 * @example
 * let x = {
 *  c: 3,
 *  d: {e: 4, f: [5,6]},
 *  g: [7, 8]
 * }
 *
 * ob.pick(x, ['d.e','d.f[].0','g[].1']);
 * // → {d: {e: 4, f: [5]}, g: [8]}
 *
 * @param {object|any[]} subject The object or array of objects to perform the pick operation on
 * @param {string|string[]} input The keys or key you would like to pick
 * @returns {object|any[]} The object or array of objects with only the picked keys.
 */
var pick = function pick(subject) {
  var input = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  subject = (0, _clone2.default)(subject);
  var flattened = (0, _flatten2.default)(subject);
  var updatedFlattened = {};

  for (var key in flattened) {
    if ((0, _typeOf2.default)(input) === 'array') {
      var matchFound = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var inputKey = _step.value;

          var re = new RegExp('^'.inputKey + '\\..*', 'g');
          if (key.match(re) || key === inputKey) {
            matchFound = true;
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

      if (matchFound === true) {
        updatedFlattened[key] = flattened[key];
      }
    } else {
      var re = new RegExp('^' + input + '\\.', 'g');
      if (key.match(re) || key === input) {
        updatedFlattened[key] = flattened[key];
      }
    }
  }
  return (0, _expand2.default)(updatedFlattened);
};

exports.default = pick;