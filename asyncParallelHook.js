// 异步并行执行
// 通过tapAsync注册的事件，通过callAsync触发
// 通过tapPromise注册的事件, 通过promise触发(返回值可以调用then方法)

// AsyncParallelHook 钩子：tapAsync/callAsync 的使用
const { AsyncParallelHook } = require('tapable')

// 创建实例
const asyncParallelHook = new AsyncParallelHook(['name', 'age'])

// 注册事件
// callAsync 的最后一个参数为回调函数，在所有事件处理函数执行完毕后执行
console.time('time')
asyncParallelHook.tapAsync('first', (name, age, done) => {
  setTimeout(() => {
    console.log('1', name, age, new Date())
    done()
  }, 1000)
})
asyncParallelHook.tapAsync('second', (name, age, done) => {
  setTimeout(() => {
    console.log('2', name, age, new Date())
    done()
    console.timeEnd('time')
  }, 3000)
})
asyncParallelHook.tapAsync('third', (name, age, done) => {
  setTimeout(() => {
    console.log('3', name, age, new Date())
    done()
  }, 2000)
})
// 触发事件，让监听函数执行
asyncParallelHook.callAsync('panda', 18, () => {
  console.log('complete')
})

// 模拟 AsyncParallelHook 类：tapAsync/callAsync
class MockAsyncParallelHook {
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

    // i在这里代表task的执行次数
    // 当事件处理函数被执行的次数达到task总数
    // 表示所有的异步任务都结束了
    let i = 0
    let done = () => {
      if (++i === this.tasks.length) {
        finalCallback()
      }
    }

    // 依次执行事件处理函数
    this.tasks.forEach((task) => task(...args, done))
  }
}
