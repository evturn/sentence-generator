'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SentenceGenerator(options) {
  this.files = assureDataType(options.files);
  this.wordCount = options.wordCount || 10;
  this.wordTree = {};
  this.sentence = '';

  Promise.all(this.concatWordsToSentence()).then(function (values) {
    var _values = _slicedToArray(values, 1);

    var sentence = _values[0];


    return options.success(sentence);
  });
}

SentenceGenerator.prototype.concatWordsToSentence = function () {
  var _this = this;

  return this.files.map(function (file) {
    return new Promise(function (resolve, reject) {
      _fs2.default.readFile(file, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }

        var currentWord = capitalize(_this.createWordTree(data));
        _this.sentence = currentWord;

        while (_this.wordTree[currentWord] && !_this.shouldStopWriting()) {
          currentWord = select(_this.wordTree[currentWord]);
          _this.sentence += ' ' + currentWord;
        }

        resolve(_this.sentence.trim());
      });
    });
  });
};

SentenceGenerator.prototype.shouldStopWriting = function () {
  return this.sentence.split(' ').length > this.wordCount - 2;
};

SentenceGenerator.prototype.createWordTree = function (data) {
  var _this2 = this;

  injectNewlines(data.toString()).forEach(function (lines) {
    lines.split(' ').filter(function (word) {
      return word.trim() !== '';
    }).map(function (word, i, words) {
      var current = normalize(words[i]);
      var next = normalize(words[i + 1]);

      if (!_this2.wordTree[current]) {
        _this2.wordTree[current] = {};
      }

      if (!_this2.wordTree[current][next]) {
        _this2.wordTree[current][next] = 1;
      } else {
        _this2.wordTree[current][next] += 1;
      }
    });
  });

  return this.wordTree;
};

module.exports = function createSentenceGenerator(options) {
  return function generator() {
    return new SentenceGenerator(options);
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
