'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var type = function type(x) {
  if (Object.prototype.toString.call(x) === '[object Array]') {
    return 'array';
  } else if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object') {
    return 'object';
  }
};

Array.prototype.getUnique = function (createArray) {
  var _this = this;

  createArray = createArray === true ? true : false;
  var temp = JSON.stringify(this);
  temp = JSON.parse(temp);
  if (createArray) {
    var unique = temp.filter(function (elem, pos) {
      return temp.indexOf(elem) === pos;
    });
    return unique;
  } else {
    var unique = this.filter(function (elem, pos) {
      return _this.indexOf(elem) === pos;
    });
    this.length = 0;
    this.splice(0, 0, unique);
  }
};

/**
 * Returns an objob object
 *
 * @param {(object|object[])} x the multiline string
 * @returns {(object|object[])}
 */
var ob = function ob(x) {
  if (type(x) !== 'array' && type(x) !== 'object') {
    return undefined;
  }

  return {
    keys: function keys() {
      var keys = [];

      if (type(x) === 'array') {
        for (var i = 0; i < x.length; x++) {
          for (var k in x) {
            keys.push(k);
          }
        }
      } else if (type(x) === 'object') {
        for (var k in x) {
          keys.push(k);
        };
      }
      return keys.getUnique();
    },
    many: function many() {},
    with: function _with() {},
    without: function without() {}
  };
};

exports.default = ob;