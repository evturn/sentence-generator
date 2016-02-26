const normalize = (word) => {
  return word !== undefined ? word.replace(/\.$/ig, '') : '';
};

const punctuate = (sentence) => {
  const hasPunctuation = /(!|\?|,|;|-|\(|&|:|\.)$/.test(sentence);

  return hasPunctuation ? sentence : `${sentence}.`;
};

const splitDataIntoSentences = (file) => {
  return file.split(/(?:\. |\n)/ig);
};

const filterByCapitalization = (obj) => {
  return Object.keys(obj).filter(word => {
    const [letter] = word;

    return letter >= 'A' && letter <= 'Z';
  });
};

const beginCapitalized = (tree) => {
  const capitalized = filterByCapitalization(tree);

  return capitalized[~~(Math.random() * capitalized.length)];
};

const select = (obj) => {
  const keys = Object.keys(obj);
  const sum = keys.reduce((p, c) => p + obj[c], 0);

  if (!Number.isFinite(sum)) {
    throw new Error('All values in object must be a numeric value');
  }

  const select = ~~(Math.random() * sum);

  for (let i = 0, count = 0; i < keys.length; i++) {
    count += obj[keys[i]];
    if (count > select) {
      return keys[i];
    }
  }
};