import fs from 'fs';
import path from 'path';

function SentenceGenerator(options) {
  const { file, count, punctuation } = options;

  this.file = file;
  this.count = count || 10;
  this.punctuation = punctuation || false;
  this.tree = {};
  this.sentence = '';

  this.init();
}

SentenceGenerator.prototype.init = function() {
  const data = fs.readFileSync(this.file).toString();

  let currentWord = capitalize(this.createTree(data));
  this.sentence = currentWord;

  while (this.tree[currentWord] && !this.shouldStopWriting()) {
    currentWord = select(this.tree[currentWord]);
    this.sentence += ' ' + currentWord;
  }

  this.sentence = this.punctuation ? punctuate(this.sentence.trim()) : this.sentence.trim();

  return this.sentence;
};

SentenceGenerator.prototype.shouldStopWriting = function() {
  return this.sentence.split(' ').length > this.count - 2;
};

SentenceGenerator.prototype.createTree = function(data) {
  splitDataIntoSentences(data).forEach(sentence => {
    sentence.split(' ').filter(word => word.trim() !== '')
      .map((word, i, words) => {
        let current = normalize(words[i]);
        let next = normalize(words[i + 1]);

        if (!this.tree[current]) {
          this.tree[current] = {};
        }

        if (!this.tree[current][next]) {
          this.tree[current][next] = 1;
        } else {
          this.tree[current][next] += 1;
        }
      });
    });

  return this.tree;
};

module.exports = function createSentenceGenerator(options) {
  return function generator() {
    const gen = new SentenceGenerator(options);
    return gen.sentence;
  }
};