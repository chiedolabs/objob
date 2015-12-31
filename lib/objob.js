'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _uniques = require('uniques');

var _uniques2 = _interopRequireDefault(_uniques);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var type = function type(x) {
  if (Object.prototype.toString.call(x) === '[object Array]') {
    return 'array';
  } else if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object') {
    return 'object';
  } else {
    return typeof x === 'undefined' ? 'undefined' : _typeof(x);
  }
};

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

      var allKeys = ob(subject).keys();
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

      console.log(keysToKeep);
      return this.select(keysToKeep);
    },
    expand: function expand() {
      var res = undefined;

      if (type(subject) === 'array') {
        res = [];

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = subject[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var i = _step3.value;

            res = res.concat(ob(i).expand());
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

        return res;
      } else {

        // Get the empty object ready for the data
        for (var keyChain in subject) {
          var subkeys = keyChain.split('.');
          var tmp = {};
          var obj = tmp;

          var count = 1;
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = subkeys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var subkey = _step4.value;

              // Set the value if the end of the keys
              if (count === subkeys.length) {
                tmp[subkey.replace(/\[\]/g, '')] = subject[keyChain];
              } else {
                // If array create the array, else create the object
                if (subkey.indexOf('[]') !== -1) {
                  subkey = subkey.replace(/\[\]/g, '');
                  tmp[subkey] = [];
                } else {
                  tmp[subkey] = {};
                }
                tmp = tmp[subkey];
                count++;
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

          for (var i in obj) {
            if (obj[i] === null || obj[i] === undefined) {
              delete obj[i];
            }
          }
          res = _extends({}, obj, res);
        }
      }
      return res;
    },
    flatten: function flatten() {
      var prefix = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var shallow = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var counter = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      var res = undefined;

      if (type(subject) === 'array' && counter === 0) {
        res = [];

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = subject[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var i = _step5.value;

            res = res.concat(ob(i).flatten(prefix, shallow, counter++));
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

        return res;
      } else {
        res = {};

        if (type(subject) === 'object' || type(subject) === 'array') {

          for (var i in subject) {
            var tmpPrefix = undefined;
            if (prefix === '') {
              tmpPrefix = '' + i;
            } else {
              tmpPrefix = prefix + '.' + i;
            }

            if (type(subject[i]) === 'array') {
              tmpPrefix = tmpPrefix + '[]';
            }

            res[tmpPrefix] = subject[i];

            if (type(subject[i]) === 'array' && shallow) {
              res = _extends({}, res, ob(subject[i][0]).flatten(tmpPrefix, shallow, counter++));
            } else {
              res = _extends({}, res, ob(subject[i]).flatten(tmpPrefix, shallow, counter++));
            }
          }
        }
      }
      return res;
    },
    keys: function keys() {
      var keys = [];

      if (type(subject) === 'array') {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = subject[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var i = _step6.value;

            keys = keys.concat(ob(i).keys());
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
        for (var k in subject) {
          keys.push(k);
        };
      }

      return (0, _uniques2.default)(keys);
    },
    many: function many() {
      var num = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];

      var arr = [];

      if (type(subject) === 'array') {
        return subject;
      } else {
        for (var i = 0; i < num; i++) {
          arr.push(subject);
        }
      }

      return arr;
    },
    select: function select() {
      var keys = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var resp = undefined;

      if (type(subject) === 'array') {
        resp = [];

        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = subject[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var i = _step7.value;

            resp = resp.concat(ob(i).select(keys));
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
      } else {
        resp = {};

        var flat = ob(subject).flatten();

        for (var actualKey in flat) {
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = keys[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var desiredKey = _step8.value;

              if (actualKey === desiredKey) {
                resp[actualKey] = flat[actualKey];
              }
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
        }
        resp = ob(resp).expand();
      }

      return resp;
    },
    values: function values() {
      var values = [];

      if (type(subject) === 'array') {
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = subject[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var i = _step9.value;

            values = values.concat(ob(i).values());
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
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