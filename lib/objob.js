'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uniques = require('uniques');

var _uniques2 = _interopRequireDefault(_uniques);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var type = function type(x) {
  if (Object.prototype.toString.call(x) === '[object Array]') {
    return 'array';
  } else if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object') {
    return 'object';
  }
};

var getNestedObject = function getNestedObject(ob, key) {
  var keys = key.split('.');
  var newOb = {};

  if (keys.length > 1) {
    // Get the key without the fist word separated by a period
    var newKey = key.replace(/^(\w|\di|_|$)*./g, '');
    newOb[keys[0]] = getNestedObject(ob[keys[0]], newKey);
  } else {
    newOb[key] = ob[key];
  }

  return newOb;
};

/**
 * Returns an objob object
 *
 * @param {(object|object[])} subject
 * @returns {(object|object[])}
 */
var ob = function ob(subject) {
  if (type(subject) !== 'array' && type(subject) !== 'object') {
    return undefined;
  }

  return {
    keys: function keys() {
      var keys = [];

      if (type(subject) === 'array') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = subject[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            keys = keys.concat(ob(i).keys());
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
      } else {
        for (var k in subject) {
          keys.push(k);
        };
      }

      return (0, _uniques2.default)(keys);
    },
    values: function values() {
      var values = [];

      if (type(subject) === 'array') {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = subject[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var i = _step2.value;

            values = values.concat(ob(i).values());
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
      } else {
        for (var k in subject) {
          values.push(subject[k]);
        };
      }

      return (0, _uniques2.default)(values);
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
    with: function _with() {
      var keys = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var resp = undefined;

      if (type(subject) === 'array') {
        resp = [];

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = subject[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var i = _step3.value;

            resp = resp.concat(ob(i).with(keys));
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
        resp = {};

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = keys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var key = _step4.value;

            if (key.split('.').length > 1) {
              var searchKey = key.replace(/^(\w|\di|_|$)*./g, '');
              var currentKey = key.replace('.' + searchKey, '');
              resp[currentKey] = getNestedObject(subject[currentKey], searchKey);
            } else {
              resp[key] = subject[key];
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
      }

      return resp;
    },
    without: function without() {
      var keys = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var allKeys = this.keys(subject);
      var keysToKeep = [];

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = allKeys[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var subjectKey = _step5.value;

          var keepKey = true;

          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = keys[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var keyToRemove = _step6.value;

              if (subjectKey === keyToRemove) {
                keepKey = false;
              }
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

          if (keepKey) {
            keysToKeep.push(subjectKey);
          }
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

      return this.with(keysToKeep);
    }
  };
};

exports.default = ob;