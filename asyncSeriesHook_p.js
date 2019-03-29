// 异步串行执行
// 通过tapAsync注册的事件，通过callAsync触发
// 通过tapPromise注册的事件, 通过promise触发(返回值可以调用then方法)

// AsyncSeriesHook 钩子：tapPromise/promise 的使用
const { AsyncSeriesHook } = require('tapable')

// 创建实例
const asyncSeriesHook = new AsyncSeriesHook(['name', 'age'])

// 注册事件
console.time('time')
asyncSeriesHook.tapPromise('first', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('1', name, age, new Date())
      resolve('1')
    }, 1000)
  })
})
asyncSeriesHook.tapPromise('second', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('2', name, age, new Date())
      resolve('2')
    }, 2000)
  })
})
asyncSeriesHook.tapPromise('third', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('3', name, age, new Date())
      resolve('3')
      console.timeEnd('time')
    }, 3000)
  })
})

// 触发事件，让监听函数执行
asyncSeriesHook.promise('panda', 18).then((ret) => {
  console.log(ret)
})

// 模拟 AsyncSeriesHook 类 tapPromise/promise
class MockAsyncSeriesHook {
  constructor(args) {
    this.args = args
    this.tasks = []
  }
  tapPromise(name, task) {
    this.tasks.push(task)
  }
  promise(...args) {
    // 传入参数严格对应创建实例传入数组中的规定的参数，执行时多余的参数为 undefined
    args = args.slice(0, this.args.length)
    // 将每个事件处理函数执行并调用返回 Promise 实例的 then 方法
    // 让下一个事件处理函数在 then 方法成功的回调中执行
    const [first, ...others] = this.tasks
    return others.reduce((promise, task) => {
      return promise.then(() => task(...args))
    }, first(...args))
  }
}
