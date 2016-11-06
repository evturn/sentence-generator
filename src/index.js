import fs from 'fs'
import path from 'path'
import compose from './compose'
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