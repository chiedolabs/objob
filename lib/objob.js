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
 * Returns an objob object
 *
 * @param {(object|object[])} subject
 * @returns {(object|object[])}
 */
var ob = function ob(subject) {

  return {
    deselect: function deselect() {
      var keys = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var allKeys = ob(ob(subject).flatten()).keys();
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

      return ob(subject).select(keysToKeep);
    },
    expand: function expand() {
      var depth = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

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
        var keyChains = ob(subject).keys();

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
            res = (0, _deepmerge2.default)(res, ob(tmp).expand(++depth));
          }
        }
      }
      return res;
      //return ob(res).removeUndefs();
    },
    flatten: function flatten() {
      var prefix = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var depth = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      var res = undefined;

      if ((0, _typeOf2.default)(subject) === 'array' && depth === 1) {
        res = [];

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = subject[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var i = _step4.value;

            res = res.concat(ob(i).flatten(prefix, ++depth));
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

            res = (0, _deepmerge2.default)(res, ob(subject[i]).flatten(tmpPrefix, ++depth));
          }
        }
      }
      return res;
    },
    keys: function keys() {
      var keys = [];

      if ((0, _typeOf2.default)(subject) === 'array') {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = subject[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var i = _step5.value;

            keys = keys.concat(ob(i).keys());
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
        for (var k in subject) {
          keys.push(k);
        };
      }

      return (0, _uniques2.default)(keys);
    },
    many: function many() {
      var num = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];

      var arr = [];

      if ((0, _typeOf2.default)(subject) === 'array') {
        return subject;
      } else {
        for (var i = 0; i < num; i++) {
          arr.push(subject);
        }
      }

      return arr;
    },
    removeUndefs: function removeUndefs() {
      var res = undefined;

      if ((0, _typeOf2.default)(subject) === 'array') {
        res = [];
        for (var key in subject) {
          if (subject[key] === undefined) {} else {
            res.push(ob(subject[key]).removeUndefs());
          }
        }
      } else if ((0, _typeOf2.default)(subject) === 'object') {
        for (var key in subject) {
          if (subject[key] === undefined) {
            delete subject[key];
          } else {
            subject[key] = ob(subject[key]).removeUndefs();
          }
        }

        return subject;
      } else {
        return subject;
      }

      return res;
    },
    select: function select() {
      var keys = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var resp = undefined;

      if ((0, _typeOf2.default)(subject) === 'array') {
        resp = [];

        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = subject[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var i = _step6.value;

            resp = resp.concat(ob(i).select(keys));
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

        var flat = ob(subject).flatten();

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
        resp = ob(resp).expand();
      }

      return resp;
    },
    shallow: function shallow() {
      var x = ob(subject).flatten();
      x = (0, _functions.makeFlattenedShallow)(x);

      return ob(x).expand();
    },
    values: function values() {
      var values = [];

      if ((0, _typeOf2.default)(subject) === 'array') {
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = subject[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var i = _step8.value;

            values = values.concat(ob(i).values());
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
      } else {
        for (var k in subject) {
          values.push(subject[k]);
        };
      }

      return (0, _uniques2.default)(values);
    }
  };
};

if (typeof module !== 'undefined') {
  module.exports = ob;
}