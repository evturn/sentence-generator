[![npm version](https://badge.fury.io/js/sentence-generator.svg)](https://www.npmjs.com/package/sentence-generator)
[![Dependency Status](https://david-dm.org/evturn/sentence-generator.svg)](https://www.npmjs.com/package/sentence-generator)

## Sentence Generator

### Install
```bash
npm install --save sentence-generator
```

### Setup
```javascript
import 'SentenceGenerator' from 'sentence-generator';

const opts = {
  file: 'content.txt', // from path where node instance is running
  count: 7,            // max allowed words per sentence (defaults to 10)
  puncation: true      // end sentence with '.' if no terminating puncation (!, ?, etc) exists (defaults to false)
};

const content = SentenceGenerator(opts);

const sentence1 = content();
const sentence2 = content();
const sentence3 = content();
```