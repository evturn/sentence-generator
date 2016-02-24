import fs from 'fs';
import path from 'path';

function SentenceGenerator(options) {
  this.files = assureDataType(options.files);
  this.wordCount = options.wordCount || 10;
  this.wordTree = {};
  this.sentence = '';

  Promise.all(this.concatWordsToSentence())
    .then(values => {
      const [sentence] = values;

      return options.success(sentence);
    });
}

SentenceGenerator.prototype.concatWordsToSentence = function() {
  return this.files.map(file => {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }

        let currentWord = capitalize(this.createWordTree(data));
        this.sentence = currentWord;

        while (this.wordTree[currentWord] && !this.shouldStopWriting()) {
          currentWord = select(this.wordTree[currentWord]);
          this.sentence += ' ' + currentWord;
        }

        resolve(this.sentence.trim());
      })
    })
  });
};

SentenceGenerator.prototype.shouldStopWriting = function() {
  return this.sentence.split(' ').length > this.wordCount - 2;
};

SentenceGenerator.prototype.createWordTree = function(data) {
  injectNewlines(data.toString()).forEach(lines => {
      lines
        .split(' ')
        .filter(word => word.trim() !== '')
        .map((word, i, words) => {
          let current = normalize(words[i]);
          let next = normalize(words[i + 1]);

          if (!this.wordTree[current]) {
            this.wordTree[current] = {};
          }

          if (!this.wordTree[current][next]) {
            this.wordTree[current][next] = 1;
          } else {
            this.wordTree[current][next] += 1;
          }
        });
    });

  return this.wordTree;
};

module.exports = function createSentenceGenerator(options) {
  return function generator() {
    return new SentenceGenerator(options);
  }
};