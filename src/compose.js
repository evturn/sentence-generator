export default function compose(...fns) {
  const firstFn = fns[fns.length - 1]
  const remainingFns = fns.slice(0, -1)
  return x => remainingFns.reduceRight((acc, fn) => fn(acc), firstFn(x))
}