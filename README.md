## Sentence Generator

### Setup
```javascript
import 'SentenceGenerator' from 'sentence-generator';

const opts = {
  files: 'content.txt',      // from path where node instance is running
  success(sentence) {        // callback executed when sentence is created
    console.log(sentence);
  },
  wordCount: 7               // max allowed words per sentence (defaults to 10)
};

const content = SentenceGenerator(opts);

const sentence1 = content();
const sentence2 = content();
const sentence3 = content();
```