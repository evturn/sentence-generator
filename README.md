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
  file: 'content.txt',
  count: 7,
  punctuation: true
};

const content = SentenceGenerator(opts);

const sentence1 = content();
const sentence2 = content();
const sentence3 = content();
```

## Options

### `file`

Filename of the content to be read

```javascript
file: 'content.txt'

// If the file is located outside of your project's root directory
// include the filepath from where your node instance is running.
// An example of this looks like 'project/assets/content.txt'
```

### `count`

Max allowed words per sentence

Default: `10`
```javascript
count: 7
```

### `punctuation`
Default: `false`

Terminate sentence with a period (unless '?', '!', or another '.' already exists)
```javascript
punctuation: true
```