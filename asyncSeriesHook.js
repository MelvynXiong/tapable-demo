// 异步串行执行
// 通过tapAsync注册的事件，通过callAsync触发
// 通过tapPromise注册的事件, 通过promise触发(返回值可以调用then方法)

// AsyncSeriesHook 钩子：tapAsync/callAsync 的使用
const { AsyncSeriesHook } = require('tapable')
// 创建实例
const asyncSeriesHook = new AsyncSeriesHook(['name', 'age'])
// 注册事件
asyncSeriesHook.tapAsync('first', (name, age, next) => {
  setTimeout(() => {
    console.log('first', name, age, new Date())
    next()
  }, 1000)
})
asyncSeriesHook.tapAsync('second', (name, age, next) => {
  setTimeout(() => {
    console.log('second', name, age, new Date())
    next()
  }, 2000)
})
asyncSeriesHook.tapAsync('third', (name, age, next) => {
  setTimeout(() => {
    console.log('third', name, age, new Date())
    next()
    console.timeEnd('time')
  }, 3000)
})
console.time('time')
// 触发事件，让监听函数执行
asyncSeriesHook.callAsync('panda', 18, () => {
  console.log('complete')
})

// 模拟 AsyncSeriesHook 类：tapAsync/callAsync
class MockAsyncSeriesHook {
  constructor(args) {
    this.args = args
    this.tasks = []
  }
  tapAsync(name, task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    // 先取出最后传入的回调函数
    const finalCallback = args.pop()
    // 传入参数严格对应创建实例传入数组中的规定的参数，执行时多余的参数为 undefined
    args = args.slice(0, this.args.length)
    // 定义一个 i 变量和 next 函数，每次取出一个事件处理函数执行，并维护 i 的值
    // 直到所有事件处理函数都执行完，调用 callAsync 的回调
    // 如果事件处理函数中没有调用 next，则无法继续
    let i = 0
    const next = () => {
      const task = this.tasks[i++]
      if (task) {
        task(...args, next)
      } else {
        finalCallback()
      }
    }
    next()
  }
}
