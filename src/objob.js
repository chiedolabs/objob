'use strict';

import clone from './funcs/clone';
import expand from './funcs/expand';
import equals from './funcs/equals';
import filter from './funcs/filter';
import flatten from './funcs/flatten';
import omit from './funcs/omit';
import keys from './funcs/keys';
import mapValues from './funcs/mapValues';
import merge from './funcs/merge';
import pick from './funcs/pick';
import values from './funcs/values';

/**
 * @namespace
 * @version 2.0.0
 * */
let ob = {
  clone,
  expand,
  equals,
  filter,
  flatten,
  keys,
  mapValues,
  merge,
  omit,
  pick,
  values,
};

if (typeof module !== 'undefined') {
  module.exports = ob;
}
