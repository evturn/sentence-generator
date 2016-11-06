'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (content) {
  var createGenerator = (0, _compose2.default)(removeEmptyValues, replaceTerminatingPeriods, splitOnWhitespace, splitOnEOL);

  var data = createGenerator(content).reduce(function (acc, xs) {
    xs.map(mapWordToContext(xs)).filter(function (x) {
      return x.next;
    }).reduce(reduceAllContexts, acc);
    return acc;
  }, { bank: {}, leads: [] });

  return function (_) {
    return selectNextRecurse(data);
  };
};

function splitOnEOL(xs) {
  return xs.split(/(?:\. |\n)/ig);
}

function splitOnWhitespace(xs) {
  return xs.map(function (x) {
    return x.split(' ');
  });
}

function replaceTerminatingPeriods(xs) {
  return xs.map(function (ys) {
    return ys.map(function (y) {
      return y.replace(/\.$/ig, '').trim();
    });
  });
}

function removeEmptyValues(xs) {
  return xs.filter(function (x) {
    return !!x || x.length;
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