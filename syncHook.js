// 串行同步执行
// 不关心事件处理函数的返回值
// 在触发事件之后，会按照事件注册的先后顺序执行所有的事件处理函数
const { SyncHook } = require('tapable')

// 这里的参数数组决定了事件触发时传进监听函数的参数
// 如果这里参数为空，触发事件时传进去的参数也不会被使用
// 创建实例
const syncHook = new SyncHook(["name", "age"])

// 注册事件
syncHook.tap('first', (name, age) => console.log('1', name, age))
syncHook.tap('second', (name, age) => console.log('2', name, age))
syncHook.tap('third', (name, age) => console.log('3', name, age))

// 触发事件, 让监听函数执行
const test = syncHook.call('xiong', 20)
console.log(test)
class MockSyncHook {
  constructor(args) {
    this.args = args
    this.tasks = []
  }
  // name 为事件名称，一般用于存储事件对应的插件名称
  // 随便取，起注释作用
  // task 为事件处理函数
  tap(name, task) {
    this.tasks.push(task)
  }
  call(...args) {
    if (args.length < this.args.length) throw new Error('参数不足')

    // 保证传入的参数与创建实例时候传入的参数数组一一对应
    args = args.slice(0, this.args.length)
    // 依次执行事件处理函数
    this.tasks.forEach(task => task(...args))
  }
}