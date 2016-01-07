'use strict';

var _uniques = require('uniques');

var _uniques2 = _interopRequireDefault(_uniques);

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _stringContains = require('string-contains');

var _stringContains2 = _interopRequireDefault(_stringContains);

var _functions = require('./functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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
  clone: function clone(subject) {
    if ((0, _typeOf2.default)(subject) === 'object' || (0, _typeOf2.default)(subject) === 'array') {
      return ob.expand(ob.flatten(subject));
    } else {
      return subject;
    }
  },
  /**
   * Returns an object without the given keys or an array with each object not having the given keys.
   *
   * @example
   * let x = {
   *  c: 3,
   *  d: {e: 4, f: [5,6]},
   *  g: [7, 8]
   * }
   *
   * ob.omit(x, ['d.e','d.f[].0','g[].1']);
   * // → {
   * //  c:3,
   * //  d: {
   * //    f: [6]
   * //  },
   * //  g:[7]
   * //}
   *
   * @example
   * let x = [
   *  3,
   *  {e: 4, f: [5,6]},
   *  [7, 8]
   * ]
   *
   * ob.omit(x, ['[]1.e','[]1.f[].0','[]2[].1']);
   * // → {
   * //  3,
   * //  {
   * //    f: [6]
   * //  },
   * //  [7]
   * //}
   *
   * @param {object|any[]} subject The object or array to perform the omit operation on.
   * @param {string|string[]} keys The keys of the object or nested object that you would like to omit.
   * @returns {object|any[]} The object or array of objects without the omited keys
   */
  omit: function omit(subject) {
    var keys = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    subject = ob.clone(subject);
    var subjectKeys = ob.keys(ob.flatten(subject));
    var keysToKeep = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = subjectKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var subjectKey = _step.value;

        var keepKey = true;

        if ((0, _typeOf2.default)(keys) === 'array') {
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
        } else if ((0, _typeOf2.default)(keys) === 'string') {
          if (subjectKey === keys) {
            keepKey = false;
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

    return ob.pick(subject, keysToKeep);
  },
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
  equals: function equals(subject, subject2) {
    subject = ob.flatten(subject);
    subject2 = ob.flatten(subject2);
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
  },
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
  expand: function expand(subject) {
    var depth = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

    var res = undefined;
    subject = (0, _functions.makeFlattenedShallow)(subject);

    var keyChains = ob.keys(subject);

    var isArray = false;
    if (true) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = keyChains[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var i = _step3.value;

          if (i.startsWith('[]')) {
            isArray = true;
          }
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
    }

    // if a top level array, things need to be handled just a little bit differently
    if (isArray) {
      res = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = keyChains[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var keyChain = _step4.value;

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
            res[index] = ob.merge(res[index], ob.expand(tmp, depth + 1));
          } else if (fullIndex.endsWith('[]')) {
            res[index] = ob.expand(tmp, depth + 1);
          } else {
            res[index] = ob.expand(tmp, depth + 1);
          }
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
    } else if (keyChains.length === 1) {
      // When the object is just {'example.example': y}
      // One key and one value
      var tmp = {};
      var keyChain = keyChains[0]; // something like 'first.another.another'
      var value = subject[keyChain];
      var count = undefined;

      res = tmp; // Pointing to tmp so that we have a place holder before nesting
      count = 1;
      var keys = keyChain.split('.');
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = keys[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var key = _step5.value;

          if (count === keys.length) {
            tmp[key] = value;
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
    } else {
      // If multiple keychains in the object, simplify our logic a bit
      res = {};
      for (var i in subject) {
        var tmp = {};
        tmp[i] = subject[i];
        res = ob.merge(res, ob.expand(tmp, depth + 1));
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
  flatten: function flatten(subject) {
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
          res = ob.merge(res, ob.flatten(subject[i], tmpPrefix, depth + 1));
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
   * @param {object|any[]} subject The object or array of objects whose keys you wish to retrieve.
   * @param {boolean} [unique=true] Whether the result should contain duplicates or not
   * @returns {string[]} The keys
   */
  keys: function keys(subject) {
    var unique = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    var keys = [];

    if ((0, _typeOf2.default)(subject) === 'array') {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = subject[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var i = _step6.value;

          keys = keys.concat(ob.keys(i));
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
    } else if ((0, _typeOf2.default)(subject) === 'object') {
      for (var k in subject) {
        keys = keys.concat(ob.keys(k));
      };
    } else {
      keys.push(subject);
    }
    if (unique) {
      return (0, _uniques2.default)(keys);
    } else {
      return keys;
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
   * ob.filter(x)
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
  filter: function filter(subject, validate) {
    subject = ob.clone(subject);

    var res = undefined;
    if ((0, _typeOf2.default)(subject) === 'array') {
      res = [];
      for (var key in subject) {
        if (validate(subject[key])) {
          res.push(ob.filter(subject[key], validate));
        }
      }
      subject = res;
    } else if ((0, _typeOf2.default)(subject) === 'object') {
      for (var key in subject) {
        if (validate(subject[key]) === true) {
          subject[key] = ob.filter(subject[key], validate);
        } else {
          delete subject[key];
        }
      }
    }

    return subject;
  },
  /**
   * Merges the enumerable attributes of two objects deeply.
   *
   * @example
   * let x = {
   *  a: {b: 1},
   * }
   *
   * let y = {
   *  a: {c: 1},
   * }
   *
   * ob.merge(x, y);
   * // → {a: {b: 1, c:1}}
   *
   * @param {object|any[]} target The object or array of objects to merge into
   * @param {object|any[]} src The object or array of objects to merge from
   * @returns {object|any[]} The merged object or array
   */
  merge: function merge(target, src) {
    var array = Array.isArray(src);
    var dst = array && [] || {};

    if (array) {
      target = target || [];
      dst = dst.concat(target);
      src.forEach(function (e, i) {
        if (typeof dst[i] === 'undefined') {
          dst[i] = e;
        } else if ((typeof e === 'undefined' ? 'undefined' : _typeof(e)) === 'object') {
          dst[i] = ob.merge(target[i], e);
        } else {
          if (target.indexOf(e) === -1) {
            dst.push(e);
          }
        }
      });
    } else {
      if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') {
        Object.keys(target).forEach(function (key) {
          dst[key] = target[key];
        });
      }
      Object.keys(src).forEach(function (key) {
        if (_typeof(src[key]) !== 'object' || !src[key]) {
          dst[key] = src[key];
        } else {
          if (!target[key]) {
            dst[key] = src[key];
          } else {
            dst[key] = ob.merge(target[key], src[key]);
          }
        }
      });
    }

    return dst;
  },
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
   * @param {string|string[]} keys The keys you would like to pick
   * @returns {object|any[]} The object or array of objects with only the picked keys.
   */
  pick: function pick(subject) {
    var keys = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    subject = ob.clone(subject);
    var resp = undefined;

    resp = {};

    var flat = ob.flatten(subject);

    for (var actualKey in flat) {
      if ((0, _typeOf2.default)(keys) === 'array') {
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
      } else if ((0, _typeOf2.default)(keys) === 'string') {
        if (actualKey === keys) {
          resp[actualKey] = flat[actualKey];
        }
      }
    }

    return ob.expand(resp);
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
   * @param {object|any[]} subject The object or array of objects to get the values of
   * @param {boolean} [unique=true] Whether the result should contain duplicates or not
   * @returns {any[]}
   */
  values: function values(subject) {
    var unique = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

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
    } else if ((0, _typeOf2.default)(subject) === 'object') {
      for (var k in subject) {
        values = values.concat(ob.values(subject[k]));
      };
    } else {
      values.push(subject);
    }
    if (unique) {
      return (0, _uniques2.default)(values);
    } else {
      return values;
    }
  }
};

if (typeof module !== 'undefined') {
  module.exports = ob;
}