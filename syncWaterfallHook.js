// 串行同步执行
// 上一个事件处理函数的返回值作为参数传递给下一个事件处理函数，依次类推
// call函数的参数作为第一个事件处理函数的参数
// call函数有返回值且返回值为最后一个事件处理函数的返回值
const { SyncWaterfallHook } = require('tapable')
// 创建实例
const syncWaterfallHook = new SyncWaterfallHook(['name', 'age'])
// 注册事件
syncWaterfallHook.tap('first', (name, age) => {
  console.log('1', name, age)
  return { name: 'xiong', age: 22 }
})
syncWaterfallHook.tap('second', ({ name, age }) => {
  console.log('2', name, age)
  return { name: 'meihui', age: 23 }
})
syncWaterfallHook.tap('third', ({ name, age }) => {
  console.log('3', name, age)
  return 20
})
// 触发事件，让监听函数执行
let ret = syncWaterfallHook.call('panda', 18)
console.log('call', ret)

class MockSyncWaterfallHook {
  constructor(args) {
    this.args = args
    this.tasks = []
  }
  tap(name, task) {
    this.tasks.push(task)
  }
  call(...args) {
    // 传入参数严格对应创建实例传入数组中的规定的参数，执行时多余的参数为 undefined
    args = args.slice(0, this.args.length)
    // 依次执行事件处理函数，事件处理函数的返回值作为下一个事件处理函数的参数
    const [first, ...others] = this.tasks
    return others.reduce((val, task) => task(val), first(...args))
  }
}
