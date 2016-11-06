[![npm version](https://badge.fury.io/js/sentence-generator.svg)](https://www.npmjs.com/package/sentence-generator) [![Dependency Status](https://david-dm.org/evturn/sentence-generator.svg)](https://www.npmjs.com/package/sentence-generator)

## _SENTENCE GENERATOR_

An API of 5 methods which provide granular control over the output of newly generated sentences.

- [`take`](https://github.com/evturn/sentence-generator#takecount-number-string)
- [`run`](https://github.com/evturn/sentence-generator#run-string)
- [`generate`](https://github.com/evturn/sentence-generator#generate-string)
- [`clear`](https://github.com/evturn/sentence-generator#clear-void)
- [`unwrap`](https://github.com/evturn/sentence-generator#unwrap-string)

## Install

`npm install sentence-generator`

## Use

###### index.js
#### `(filepath: string): Object`
```javascript
import 'Gen' from 'sentence-generator'

const gen = Gen('src/content.txt')
// will resolve to Users/whatevz/project/src/content.txt
```

###### src/content.txt
Assume this is the contents of the file resolved at `filepath`:
> I go to preschool university. We never talk enough about pencil sharpeners. Speak now or forever hold this for one second. It's a collection of paper bags full of plastic bags. This is what I like to think about when I eat dead leaves. Seriously, what's up with all those cookies? My grandmother never owned a rancid juicebar. That is a real homemade sandwich if I've ever seen one. I have to admit that I have never driven this car with my eyes open.

## API

#### `take(count: number): String`
Returns a string of with a total of `count` sentences.
```javascript
const a = gen.take(3)

console.log(a)
// This is what I like to think about pencil sharpeners. I eat dead leaves. We never owned a rancid juicebar. 
```

#### `run(): String`
Returns one sentence leaving any interal persisted state unmutated.
```javascript
const a = gen.take(3)
const b = gen.run()

console.log(a)
// This is what I like to think about pencil sharpeners. I eat dead leaves. We never owned a rancid juicebar. 

console.log(b)
// We never owned a real homemade sandwich if I've ever seen one second.
```

#### `generate(): String`
Allows the for the creation of a sequence in a manner similar to a for loop. Each call returns the current state of accumulation.
```javascript
const a = gen.take(3)
const c = gen.generate()

console.log(a)
// This is what I like to think about pencil sharpeners. I eat dead leaves. We never owned a rancid juicebar.

console.log(c)
// This is what I like to think about pencil sharpeners. I eat dead leaves. We never owned a rancid juicebar. Speak now or forever hold this car with all those cookies?
```

#### `clear(): Void`
Resets any internal state persisted from previous method calls (such as `generate` or `take`). Useful with recursion an edge condition is met.
```javascript
import Gen from 'sentence-generator'
import postToTwitter from './twitter'

const gen = Gen('src/content.txt')

function writeText() {
  const value = gen.generate()
  if (value.length > 140) {
    gen.clear()
    return writeText()
  } else if (value.length > 100) {
    return postToTwitter(value)
  } else {
    return writeText()
  }
}

// Starts over if the number of characters in
// the string exceeds 140 and finishes only 
// when the accumulated string contains a number
// of characters greater than 100 and less than 140
```

#### `unwrap(): String`
Returns the current persisted state.
```javascript

gen.generate()
gen.generate()
gen.generate()
gen.generate()

// equivalent to calling `gen.take(4)`

const result = gen.unwrap())
/* Returns a string of four sentences */
```
