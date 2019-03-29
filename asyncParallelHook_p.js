// 异步并行执行
// 通过tapAsync注册的事件，通过callAsync触发
// 通过tapPromise注册的事件, 通过promise触发(返回值可以调用then方法)

// AsyncParallelHook 钩子：tapPromise/promise 的使用
const { AsyncParallelHook } = require('tapable')
// 创建实例
const asyncParallelHook = new AsyncParallelHook(['name', 'age'])

// 注册事件
console.time('time')
asyncParallelHook.tapPromise('first', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('1', name, age, new Date())
      resolve('1')
    }, 1000)
  })
})
asyncParallelHook.tapPromise('second', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('2', name, age, new Date())
      resolve('2')
    }, 3000)
  })
})
asyncParallelHook.tapPromise('third', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('3', name, age, new Date())
      resolve('3')
      console.timeEnd('time')
    }, 2000)
  })
})

// 触发事件，让监听函数执行
const test = asyncParallelHook.promise('panda', 18).then((ret) => {
  console.log(ret)
})

// 模拟 AsyncParallelHook 类 tapPromise/promise

class MockAsyncParallelHook {
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

    // 将所有事件处理函数转换成 Promise 实例，并发执行所有的 Promise
    return Promise.all(this.tasks.map((task) => task(...args)))
  }
}
