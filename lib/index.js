'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SentenceGenerator(options) {
  this.file = options.file;
  this.count = options.count || 10;
  this.tree = {};
  this.sentence = '';

  this.init();
}

SentenceGenerator.prototype.init = function () {
  var data = _fs2.default.readFileSync(this.file).toString();
  var currentWord = capitalize(this.createTree(data));
  this.sentence = currentWord;

  while (this.tree[currentWord] && !this.shouldStopWriting()) {
    currentWord = select(this.tree[currentWord]);
    this.sentence += ' ' + currentWord;
  }

  return this.sentence.trim();
};

SentenceGenerator.prototype.shouldStopWriting = function () {
  return this.sentence.split(' ').length > this.count - 2;
};

SentenceGenerator.prototype.createTree = function (data) {
  var _this = this;

  injectNewlines(data.toString()).forEach(function (lines) {
    lines.split(' ').filter(function (word) {
      return word.trim() !== '';
    }).map(function (word, i, words) {
      var current = normalize(words[i]);
      var next = normalize(words[i + 1]);

      if (!_this.tree[current]) {
        _this.tree[current] = {};
      }

      if (!_this.tree[current][next]) {
        _this.tree[current][next] = 1;
      } else {
        _this.tree[current][next] += 1;
      }
    });
  });

  return this.tree;
};

module.exports = function createSentenceGenerator(options) {
  return function generator() {
    var gen = new SentenceGenerator(options);
    return gen.sentence;
  };
};
'use strict';

var normalize = function normalize(word) {
  if (word === undefined) {
    return '';
  }

  return word.replace(/\.$/ig, '');
};

var injectNewlines = function injectNewlines(file) {
  return file.split(/(?:\. |\n)/ig);
};

var capitalize = function capitalize(wordList) {
  var tmpList = Object.keys(wordList).filter(function (word) {
    return word[0] >= 'A' && word[0] <= 'Z';
  });

  return tmpList[~ ~(Math.random() * tmpList.length)];
};

var select = function select(obj) {
  var keys = Object.keys(obj);
  var sum = keys.reduce(function (p, c) {
    return p + obj[c];
  }, 0);

  if (!Number.isFinite(sum)) {
    throw new Error('All values in object must be a numeric value');
  }

  var select = ~ ~(Math.random() * sum);

  for (var i = 0, count = 0; i < keys.length; i++) {
    count += obj[keys[i]];
    if (count > select) {
      return keys[i];
    }
  }
};

var assureDataType = function assureDataType(files) {
  if (typeof files === 'string') {
    return [files];
  } else if (typeof files === 'array') {
    return files;
  } else {
    throw new Error('File(s) must be string or array');
  }
};
