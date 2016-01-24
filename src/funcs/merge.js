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
let merge = function(target, src) {
  let array = Array.isArray(src);
  let dst = array && [] || {};

  if (array) {
    target = target || [];
    dst = dst.concat(target);
    src.forEach((e, i) => {
      if (typeof dst[i] === 'undefined') {
        dst[i] = e;
      } else if (typeof e === 'object') {
        dst[i] = merge(target[i], e);
      } else {
        if (target.indexOf(e) === -1) {
          dst.push(e);
        }
      }
    });
  } else {
    if (target && typeof target === 'object') {
      Object.keys(target).forEach((key) => {
        dst[key] = target[key];
      });
    }
    Object.keys(src).forEach((key) => {
      if (typeof src[key] !== 'object' || !src[key]) {
        dst[key] = src[key];
      }
      else {
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

export default merge;
