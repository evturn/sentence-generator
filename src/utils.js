const normalize = (word) => {
  if (word === undefined) {
    return '';
  }

  return word.replace(/\.$/ig, '');
};

const injectNewlines = (file) => {
  return file.split(/(?:\. |\n)/ig);
};

const capitalize = (wordList) => {
  let tmpList = Object.keys(wordList).filter((word) => {
    return word[0] >= 'A' && word[0] <= 'Z';
  });

  return tmpList[~~(Math.random() * tmpList.length)];
};

const select = (obj) => {
  let keys = Object.keys(obj);
  let sum = keys.reduce((p, c) => p + obj[c], 0);

  if (!Number.isFinite(sum)) {
    throw new Error('All values in object must be a numeric value');
  }

  let select = ~~(Math.random() * sum);

  for (let i = 0, count = 0; i < keys.length; i++) {
    count += obj[keys[i]];
    if (count > select) {
      return keys[i];
    }
  }
};

const assureDataType = (files) => {
  if (typeof files === 'string') {
    return [files];
  } else if (typeof files === 'array') {
    return files;
  } else  {
    throw new Error('File(s) must be string or array');
  }
};