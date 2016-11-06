"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compose;
function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  var firstFn = fns[fns.length - 1];
  var remainingFns = fns.slice(0, -1);
  return function (x) {
    return remainingFns.reduceRight(function (acc, fn) {
      return fn(acc);
    }, firstFn(x));
  };
}
module.exports = exports["default"];