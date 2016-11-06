import compose from './compose'

export default content => {
  const createGenerator = compose(
    removeEmptyValues,
    replaceTerminatingPeriods,
    splitOnWhitespace,
    splitOnEOL
  )

  const data = createGenerator(content)
    .reduce((acc, xs) => {
      xs.map(mapWordToContext(xs))
        .filter(x => x.next)
        .reduce(reduceAllContexts, acc)
      return acc
    }, {bank: {}, leads: []})

  return _ => selectNextRecurse(data)
}

function splitOnEOL(xs) {
  return xs.split(/(?:\. |\n)/ig)
}

function splitOnWhitespace(xs) {
  return xs.map(x => x.split(' '))
}

function replaceTerminatingPeriods(xs) {
  return xs.map(ys => ys.map(y => y.replace(/\.$/ig, '').trim()))
}

function removeEmptyValues(xs) {
  return xs.filter(x => !!x || x.length)
}

function mapWordToContext(xs) {
  return (x, i) => ({
    value: x,
    next: xs[i + 1],
    lead: i === 0
  })
}

function reduceAllContexts(acc, x) {
  if (x.lead) { acc.leads.push(x.value) }
  if (!acc.bank[x.value]) { acc.bank[x.value] = {} }
  if (!acc.bank[x.value][x.next]) { acc.bank[x.value][x.next] = 1 }
  else { acc.bank[x.value][x.next]  += 1 }
  return acc
}

function selectFirst(xs) {
  return xs[Math.floor(xs.length * Math.random())]
}

function selectNextRecurse(data) {
  const seed = selectFirst(data.leads)
  return recurse([seed], seed)

  function recurse(acc, x) {
    if (data.bank[x] && acc.length < 16) {
      const next = selectNext(data.bank[x])
      return recurse([ ...acc, next], next)
    }
    return acc.join(' ')
  }
}

function selectNext(obj) {
  const keys = Object.keys(obj)
  const num = ~~(Math.random() * keys.reduce((acc, x) => acc + obj[x], 0))
  const { word } = keys
    .reduce((acc, x) => {
      if (!acc.word) {
        acc.i += obj[x]
        if (acc.i > num) {
          acc.word = x
        }
      }
      return acc
    }, { i: 0 })
  return word
}