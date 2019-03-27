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
syncHook.call('xiong', 20)

class MockSyncHook {
  constructor(args) {
    this.args = args
    this.tasks = []
  }
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