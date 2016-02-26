import fs from 'fs';
import path from 'path';

function SentenceGenerator(options) {
  const { file, count, punctuation } = options;

  this.file = file;
  this.count = count || 10;
  this.punctuation = punctuation || false;
  this.init();
}

SentenceGenerator.prototype.init = function() {
  const data = fs.readFileSync(this.file).toString();
  this.tree = {};

  splitDataIntoSentences(data).forEach(sentence => {
    sentence.split(' ')
      .filter(word => word.trim() !== '')
      .map((word, i, words) => this.mapWordsByAppearance(i, words));
    });

  return this;
};

SentenceGenerator.prototype.write = function() {
  this.sentence = '';

  let word = beginCapitalized(this.tree);
  this.sentence = word;

  while (this.tree[word] && !this.shouldStopWriting()) {
    word = select(this.tree[word]);
    this.sentence += ' ' + word;
  }

  this.sentence = this.punctuation ? punctuate(this.sentence.trim()) : this.sentence.trim();

  return this.sentence;
};

SentenceGenerator.prototype.shouldStopWriting = function() {
  return this.sentence.split(' ').length > this.count - 2;
};

SentenceGenerator.prototype.mapWordsByAppearance = function(idx, words) {
  const current = normalize(words[idx]);
  const next = normalize(words[idx + 1]);

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
  const sentenceGenerator = new SentenceGenerator(options)

  return function generator() {
    return sentenceGenerator.write();
  };
};