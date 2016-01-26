'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
var merge = function merge(target, src) {
  var array = Array.isArray(src);
  var dst = array && [] || {};

  if (array) {
    target = target || [];
    dst = dst.concat(target);
    src.forEach(function (e, i) {
      if (typeof dst[i] === 'undefined') {
        dst[i] = e;
      } else if ((typeof e === 'undefined' ? 'undefined' : _typeof(e)) === 'object') {
        dst[i] = merge(target[i], e);
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
          dst[key] = merge(target[key], src[key]);
        }
      }
    });
  }

  return dst;
};

exports.default = merge;