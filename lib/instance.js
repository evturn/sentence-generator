'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createGeneratorInstance;

var _output = require('./output');

var _output2 = _interopRequireDefault(_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createGeneratorInstance(data) {
  return createInstance((0, _output2.default)(data));
}

function createInstance(fn) {
  var gen = {
    value: '',

    run: function run() {
      return fn();
    },
    take: function take(x) {
      gen.clear();
      Array.from({ length: x }, function (_, i) {
        return i + 1;
      }).map(gen.concat);
      return gen.unwrap();
    },


    generate: function generate(_) {
      gen.concat();
      return gen.unwrap();
    },

    unwrap: function unwrap() {
      return gen.value.trim();
    },
    concat: function concat() {
      var next = gen.run();
      gen.value += /(!|\?|,|;|-|\(|&|:|\.)$/.test(next) ? next + ' ' : next + '. ';
    },
    clear: function clear() {
      gen.value = '';
    }
  };

  return gen;
}
module.exports = exports['default'];