import fs from 'fs'
import path from 'path'
import createGenerator from './instance'

export default filepath => {
  const createInstance = compose(
    createGenerator,
    stringifyFile,
    readFile,
    resolvePath
  )
  return createInstance(filepath)
}

function resolvePath(filepath) {
  return path.resolve(process.cwd(), filepath)
}

function readFile(path) {
  return fs.readFileSync(path)
}

function stringifyFile(file) {
  return file.toString()
}

function compose(...fns) {
  const firstFn = fns[fns.length - 1]
  const remainingFns = fns.slice(0, -1)
  return x => remainingFns.reduceRight((acc, fn) => fn(acc), firstFn(x))
}