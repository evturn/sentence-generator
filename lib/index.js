'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SentenceGenerator(options) {
  var file = options.file;
  var count = options.count;
  var punctuation = options.punctuation;


  this.file = file;
  this.count = count || 10;
  this.punctuation = punctuation || false;
  this.init();
}

SentenceGenerator.prototype.init = function () {
  var _this = this;

  var data = _fs2.default.readFileSync(this.file).toString();
  this.tree = {};

  splitDataIntoSentences(data).forEach(function (sentence) {
    sentence.split(' ').filter(function (word) {
      return word.trim() !== '';
    }).map(function (word, i, words) {
      return _this.mapWordsByAppearance(i, words);
    });
  });

  return this;
};

SentenceGenerator.prototype.write = function () {
  this.sentence = '';

  var word = beginCapitalized(this.tree);
  this.sentence = word;

  while (this.tree[word] && !this.shouldStopWriting()) {
    word = select(this.tree[word]);
    this.sentence += ' ' + word;
  }

  this.sentence = this.punctuation ? punctuate(this.sentence.trim()) : this.sentence.trim();

  return this.sentence;
};

SentenceGenerator.prototype.shouldStopWriting = function () {
  return this.sentence.split(' ').length > this.count - 2;
};

SentenceGenerator.prototype.mapWordsByAppearance = function (idx, words) {
  var current = normalize(words[idx]);
  var next = normalize(words[idx + 1]);

  if (!this.tree[current]) {
    this.tree[current] = {};
  }

  if (!this.tree[current][next]) {
    this.tree[current][next] = 1;
  } else {
    this.tree[current][next] += 1;
  }
};

module.exports = function createSentenceGenerator(options) {
  var sentenceGenerator = new SentenceGenerator(options);

  return function generator() {
    return sentenceGenerator.write();
  };
};
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var normalize = function normalize(word) {
  return word !== undefined ? word.replace(/\.$/ig, '') : '';
};

var punctuate = function punctuate(sentence) {
  var hasPunctuation = /(!|\?|,|;|-|\(|&|:|\.)$/.test(sentence);

  return hasPunctuation ? sentence : sentence + '.';
};

var splitDataIntoSentences = function splitDataIntoSentences(file) {
  return file.split(/(?:\. |\n)/ig);
};

var filterByCapitalization = function filterByCapitalization(obj) {
  return Object.keys(obj).filter(function (word) {
    var _word = _slicedToArray(word, 1);

    var letter = _word[0];


    return letter >= 'A' && letter <= 'Z';
  });
};

var beginCapitalized = function beginCapitalized(tree) {
  var capitalized = filterByCapitalization(tree);

  return capitalized[~ ~(Math.random() * capitalized.length)];
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
