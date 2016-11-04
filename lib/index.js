'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _instance = require('./instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (filepath) {
  var createInstance = compose(_instance2.default, stringifyFile, readFile, resolvePath);
  return createInstance(filepath);
};

function resolvePath(filepath) {
  return _path2.default.resolve(process.cwd(), filepath);
}

function readFile(path) {
  return _fs2.default.readFileSync(path);
}

function stringifyFile(file) {
  return file.toString();
}

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
module.exports = exports['default'];
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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sentenceGenerator;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function sentenceGenerator(content) {
  var data = content.split(/(?:\. |\n)/ig).map(splitOnWhitespace).filter(function (x) {
    return x.length;
  }).reduce(function (acc, xs) {
    xs.map(mapWordToContext(xs)).filter(function (x) {
      return x.next;
    }).reduce(reduceAllContexts, acc);
    return acc;
  }, { bank: {}, leads: [] });

  return function (_) {
    return selectNextRecurse(data);
  };
}

function splitOnWhitespace(line) {
  return line.split(' ').map(function (x) {
    return x.replace(/\.$/ig, '').trim();
  }).filter(function (x) {
    return !!x;
  });
}

function mapWordToContext(xs) {
  return function (x, i) {
    return {
      value: x,
      next: xs[i + 1],
      lead: i === 0
    };
  };
}

function reduceAllContexts(acc, x) {
  if (x.lead) {
    acc.leads.push(x.value);
  }
  if (!acc.bank[x.value]) {
    acc.bank[x.value] = {};
  }
  if (!acc.bank[x.value][x.next]) {
    acc.bank[x.value][x.next] = 1;
  } else {
    acc.bank[x.value][x.next] += 1;
  }
  return acc;
}

function selectFirst(xs) {
  return xs[Math.floor(xs.length * Math.random())];
}

function selectNextRecurse(data) {
  var seed = selectFirst(data.leads);
  return recurse([seed], seed);

  function recurse(acc, x) {
    if (data.bank[x] && acc.length < 16) {
      var next = selectNext(data.bank[x]);
      return recurse([].concat(_toConsumableArray(acc), [next]), next);
    }
    return acc.join(' ');
  }
}

function selectNext(obj) {
  var keys = Object.keys(obj);
  var num = ~~(Math.random() * keys.reduce(function (acc, x) {
    return acc + obj[x];
  }, 0));

  var _keys$reduce = keys.reduce(function (acc, x) {
    if (!acc.word) {
      acc.i += obj[x];
      if (acc.i > num) {
        acc.word = x;
      }
    }
    return acc;
  }, { i: 0 }),
      word = _keys$reduce.word;

  return word;
}
module.exports = exports['default'];
