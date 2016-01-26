'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _stringContains = require('string-contains');

var _stringContains2 = _interopRequireDefault(_stringContains);

var _functions = require('../functions');

var _keys2 = require('./keys');

var _keys3 = _interopRequireDefault(_keys2);

var _merge = require('./merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Takes a flattened object and expands it back to a full object or array of objects.
 *
 * @example
 *
 * let x = {
 *  'a.b.c': 1,
 *  'a.b.d': [2,3]
 *  'a.b.d[].0': 2,
 *  'a.b.d[].1': 3,
 * }
 *
 * ob.expand(x)
 * // → {
 * // a: {
 * //   b: {
 * //   c: 1,
 * //   d: [2,3]
 * // }}}
 *
 * @example
 * let x = {
 *  '[]0[].0.a.b.c': 1,
 *  '[]1.b.d': [2,3]
 *  '[]1.b.d[].0': 2
 *  '[]1.b.d[].1': 3
 * }
 *
 * ob.expand(x)
 * // → [
 * // [{
 * //   a: {
 * //     b: {
 * //       c: 1,
 * //     },
 * //   },
 * // }],
 * // {
 * //   b: {
 * //     d: [2,3]
 * //   }
 * // }
 * //]
 *
 * @param {object} subject The object to expand
 * @returns {object|any[]} The expanded object or array of objects.
 */
var expand = function expand(subject) {
  var depth = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

  var res = undefined;
  subject = (0, _functions.makeFlattenedShallow)(subject);

  var keyChains = (0, _keys3.default)(subject);

  var isArray = false;
  if (true) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keyChains[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var i = _step.value;

        if (i.startsWith('[]')) {
          isArray = true;
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
  }

  // if array, things need to be handled just a little bit differently
  if (isArray) {
    res = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = keyChains[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var keyChain = _step2.value;

        // This converts something like []0.name.name or []0[].name.name to 0
        var firstKey = keyChain.split('.')[0]; // eg []0[]
        var fullIndex = firstKey.substr(2); // eg. 0[]
        var index = fullIndex.replace('[]', ''); // eg 0
        var nestedKeyChain = keyChain.replace(firstKey + '.', '');

        var tmp = {};
        // Make sure tmp is set correctly based on the object type
        if ((0, _typeOf2.default)(res[index]) === 'array' || fullIndex.endsWith('[]')) {
          tmp['[]' + nestedKeyChain] = subject[keyChain];
        } else {
          tmp[nestedKeyChain] = subject[keyChain];
        }

        if (keyChain.split('.').length === 1) {
          // If there is no nested data just add to the array
          res[index] = subject[keyChain];
        } else if ((0, _typeOf2.default)(res[index]) === 'object' || (0, _typeOf2.default)(res[index]) === 'array') {
          // If the next keyChain is an object
          res[index] = (0, _merge2.default)(res[index], expand(tmp, depth + 1));
        } else if (fullIndex.endsWith('[]')) {
          res[index] = expand(tmp, depth + 1);
        } else {
          res[index] = expand(tmp, depth + 1);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  } else if (keyChains.length === 1) {
    // When the object is just {'example.example': y}
    // One key and one value
    var tmp = {};
    var keyChain = keyChains[0]; // something like 'first.another.another'
    var value = subject[keyChain];
    var count = undefined;

    res = tmp; // Pointing to tmp so that we have a place holder before nesting
    count = 1;
    var _keys = keyChain.split('.');
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = _keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var key = _step3.value;

        if (count === _keys.length) {
          tmp[key.replace('[]', '')] = value;
        } else {
          var _isArray = (0, _stringContains2.default)(key, '[]');
          if (_isArray) {
            key = key.replace('[]', '');
            tmp[key] = [];
          } else {
            tmp[key] = {};
          }

          tmp = tmp[key];
        }
        count++;
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  } else {
    // If multiple keychains in the object, simplify our logic a bit
    res = {};
    for (var i in subject) {
      var tmp = {};
      tmp[i] = subject[i];
      res = (0, _merge2.default)(res, expand(tmp, depth + 1));
    }
  }
  return res;
};

exports.default = expand;