'use strict';

var _clone = require('./funcs/clone');

var _clone2 = _interopRequireDefault(_clone);

var _expand = require('./funcs/expand');

var _expand2 = _interopRequireDefault(_expand);

var _equals = require('./funcs/equals');

var _equals2 = _interopRequireDefault(_equals);

var _filter = require('./funcs/filter');

var _filter2 = _interopRequireDefault(_filter);

var _flatten = require('./funcs/flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _omit = require('./funcs/omit');

var _omit2 = _interopRequireDefault(_omit);

var _keys = require('./funcs/keys');

var _keys2 = _interopRequireDefault(_keys);

var _mapValues = require('./funcs/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _merge = require('./funcs/merge');

var _merge2 = _interopRequireDefault(_merge);

var _pick = require('./funcs/pick');

var _pick2 = _interopRequireDefault(_pick);

var _values = require('./funcs/values');

var _values2 = _interopRequireDefault(_values);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace
 * @version 2.0.0
 * */
var ob = {
  clone: _clone2.default,
  expand: _expand2.default,
  equals: _equals2.default,
  filter: _filter2.default,
  flatten: _flatten2.default,
  keys: _keys2.default,
  mapValues: _mapValues2.default,
  merge: _merge2.default,
  omit: _omit2.default,
  pick: _pick2.default,
  values: _values2.default
};

if (typeof module !== 'undefined') {
  module.exports = ob;
}