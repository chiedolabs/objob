'use strict';

var _uniques = require('uniques');

var _uniques2 = _interopRequireDefault(_uniques);

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _stringContains = require('string-contains');

var _stringContains2 = _interopRequireDefault(_stringContains);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _functions = require('./functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace
 * @version 2.0.0
 * */
var ob = {
  /**
   * Performs a deep clone of an object or array.
   *
   * @example
   * let x = {
   *  a: 1,
   *  b: 2,
   *  c: 3,
   * }
   *
   * y = ob.clone(x)
   * y === x
   * // → false
   *
   * @param {object|object[]} subject The object or array to clone.
   * @returns {object|object[]} The cloned object or arraay
   */
  clone: function clone(subject) {
    return ob.expand(ob.flatten(subject));
  },
  /**
   * Returns an object without the given keys or an array with each object not having the given keys.
   * @example <caption>Basic usage.</caption>
   * let x = {
   *  a: 1,
   *  b: 2,
   *  c: 3,
   * }
   *
   * ob.deselect(x, ['a','b']);
   * // → {c: 3}
   * @example <caption>Advanced usage.</caption>
   * let x = {
   *  c: 3,
   *  d: {e: 4, f: [5,6]},
   *  g: [7, 8]
   * }
   *
   * ob.deselect(x, ['d.e','d.f[].0','g[].1']);
   * // → {c: 3, d: {f:[6]}, g:[7]}
   *
   * @param {object|object[]} subject The object or array to perform the deselect operation on.
   * @param {string[]} keys The keys of the object or nested object that you would like to deselect.
   * @returns {object|object[]} The object or array of objects without the deselected keys
   */
  deselect: function deselect(subject) {
    var keys = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    var allKeys = ob.keys(ob.flatten(subject));
    var keysToKeep = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = allKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var subjectKey = _step.value;

        var keepKey = true;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var keyToRemove = _step2.value;

            if (subjectKey === keyToRemove) {
              keepKey = false;
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

        if (keepKey) {
          keysToKeep.push(subjectKey);
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

    return ob.select(subject, keysToKeep);
  },
  /**
   * Takes a flattened object and expands it back to a full object or array of objects.
   *
   * @example
   * let x = {
   *  'a.b.c': 1,
   *  'a.b.d': [2,3]
   *  'a.b.d[].0': 2,
   *  'a.b.d[].1': 3',
   * }
   *
   * ob.expand(x)
   * // → {a: {b: {c: 1, d: [2,3]}}}
   *
   * @param {object} subject The object to expand
   * @returns {object|object[]} The expanded object or array of objects.
   */
  expand: function expand(subject) {
    var depth = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

    var res = undefined;
    subject = (0, _functions.makeFlattenedShallow)(subject);

    // Determine if an array is represented by the flattened object
    var rootObjectPresent = true;
    if (depth === 1) {
      rootObjectPresent = false;
      for (var key in subject) {
        var rootArrayPresent = key.match(/^\d/ig);

        rootObjectPresent = rootObjectPresent || !rootArrayPresent;
      }
    }

    if (rootObjectPresent === false && depth === 1) {
      res = [];
      for (var key in subject) {
        res.push(subject[key]);
      }
    } else {
      var keyChains = ob.keys(subject);

      // When the object is just {'example.example': y}
      // One key and one value
      if (keyChains.length === 1) {
        var tmp = {};
        var keyChain = keyChains[0]; // something like 'first.another.another'
        var value = subject[keyChain];
        var count = undefined;

        res = tmp; // Poining to tmp so that we have a place holder before nesting
        count = 1;
        var keys = keyChain.split('.');
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var key = _step3.value;

            if (count === keys.length) {
              tmp[key] = value;
            } else {
              var isArray = (0, _stringContains2.default)(key, '[]');
              if (isArray) {
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
          res = (0, _deepmerge2.default)(res, ob.expand(tmp, ++depth));
        }
      }
    }
    return res;
  },
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
   *  'a.b.c': 1,
   *  'a.b.d': [2,3]
   *  'a.b.d[].0': 2,
   *  'a.b.d[].1': 3',
   * }
   *
   * @param {object|object[]} subject The object or array of objects to perform the flattening on
   * @returns {object} The flat representation of the object
   */
  flatten: function flatten(subject) {
    var prefix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
    var depth = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    var res = undefined;

    if ((0, _typeOf2.default)(subject) === 'array' && depth === 1) {
      res = [];

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = subject[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var i = _step4.value;

          res = res.concat(ob.flatten(i, prefix, ++depth));
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return res;
    } else {
      res = {};

      if ((0, _typeOf2.default)(subject) === 'object' || (0, _typeOf2.default)(subject) === 'array') {

        for (var i in subject) {
          var tmpPrefix = undefined;
          if (prefix === '') {
            tmpPrefix = '' + i;
          } else {
            tmpPrefix = prefix + '.' + i;
          }

          if ((0, _typeOf2.default)(subject[i]) === 'array') {
            tmpPrefix = tmpPrefix + '[]';
          }

          res[tmpPrefix] = subject[i];

          res = (0, _deepmerge2.default)(res, ob.flatten(subject[i], tmpPrefix, ++depth));
        }
      }
    }
    return res;
  },
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
   * @param {object|object[]} subject The object or array of objects whose keys you wish to retrieve.
   * @returns {string[]} The keys
   */
  keys: function keys(subject) {
    var keys = [];

    if ((0, _typeOf2.default)(subject) === 'array') {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = subject[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var i = _step5.value;

          keys = keys.concat(ob.keys(i));
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return (0, _uniques2.default)(keys);
    } else if ((0, _typeOf2.default)(subject) === 'object') {
      for (var k in subject) {
        keys = keys.concat(ob.keys(k));
      };
      return (0, _uniques2.default)(keys);
    } else {
      keys.push(subject);
      return (0, _uniques2.default)(keys);
    }
  },
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
   * ob.removeUndefs(x)
   * // → {
   *   b: {
   *     d: 2,
   *   },
   *   e: [1, 2]
   * }
   *
   *
   * @param {object|object[]} subject The object or array of objects you would like to remove undefined values from.
   * @returns {object|object[]} The object or array of objects without any undefined values
   */
  removeUndefs: function removeUndefs(subject) {
    // Make sure we don't mutate the original object
    subject = ob.clone(subject);

    var res = undefined;

    if ((0, _typeOf2.default)(subject) === 'array') {
      res = [];
      for (var key in subject) {
        if (subject[key] === undefined) {} else {
          res.push(ob.removeUndefs(subject[key]));
        }
      }
    } else if ((0, _typeOf2.default)(subject) === 'object') {
      for (var key in subject) {
        if (subject[key] === undefined) {
          delete subject[key];
        } else {
          subject[key] = ob.removeUndefs(subject[key]);
        }
      }

      return subject;
    } else {
      return subject;
    }

    return res;
  },
  /**
   * Returns an object only with the given keys. If an array is passed, it will return an array of each given object only having the selected keys.
   *
   * @example <caption>Basic usage.</caption>
   * let x = {
   *  a: 1,
   *  b: 2,
   *  c: 3,
   * }
   *
   * ob.select(x, ['a','b']);
   * // → {a: 1, b: 2}
   *
   * @example <caption>Advanced usage.</caption>
   * let x = {
   *  c: 3,
   *  d: {e: 4, f: [5,6]},
   *  g: [7, 8]
   * }
   *
   * ob.select(x, ['d.e','d.f[].0','g[].1']);
   * // → {d: {e: 4, f: [5]}, g: [8]}
   *
   * @param {object|object[]} subject The object or array of objects to perform the select operation on
   * @param {string[]} keys The keys you would like to select
   * @returns {object|object[]} The object or array of objects with only the selected keys.
   */
  select: function select(subject) {
    var keys = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    var resp = undefined;

    if ((0, _typeOf2.default)(subject) === 'array') {
      resp = [];

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = subject[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var i = _step6.value;

          resp = resp.concat(ob.select(i, keys));
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    } else {
      resp = {};

      var flat = ob.flatten(subject);

      for (var actualKey in flat) {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = keys[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var desiredKey = _step7.value;

            if (actualKey === desiredKey) {
              resp[actualKey] = flat[actualKey];
            }
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
      }
      resp = ob.expand(resp);
    }

    return resp;
  },
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
   * @param {object|object[]} subject The object or array of objects to get the values of
   * @returns {any[]}
   */
  values: function values(subject) {
    var values = [];

    if ((0, _typeOf2.default)(subject) === 'array') {
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = subject[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var i = _step8.value;

          values = values.concat(ob.values(i));
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      return (0, _uniques2.default)(values);
    } else if ((0, _typeOf2.default)(subject) === 'object') {
      for (var k in subject) {
        values = values.concat(ob.values(subject[k]));
      };
      return (0, _uniques2.default)(values);
    } else {
      values.push(subject);
      return (0, _uniques2.default)(values);
    }
  }
};

if (typeof module !== 'undefined') {
  module.exports = ob;
}