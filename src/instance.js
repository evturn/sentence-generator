import Generator from './output'

export default function createGeneratorInstance(data) {
  return createInstance(Generator(data))
}

function createInstance(fn) {
  const gen = {
    value: '',

    run() {
      return fn()
    },

    take(x) {
      gen.clear()
      Array.from({length: x}, (_, i) => i + 1).map(gen.concat)
      return gen.unwrap()
    },

    generate: _ => {
      gen.concat()
      return gen.unwrap()
    },

    unwrap() {
      return gen.value.trim()
    },

    concat() {
      const next = gen.run()
      gen.value += /(!|\?|,|;|-|\(|&|:|\.)$/.test(next)
        ? `${next} `
        : `${next}. `
    },

    clear() {
      gen.value = ''
    },
  }

  return gen
}