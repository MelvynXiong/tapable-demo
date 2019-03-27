// 串行同步执行
// 如果事件处理函数执行时有一个返回值不为undefined
// 则跳过剩下未执行的事件处理函数
const { SyncBailHook } = require('tapable')
// 创建实例
const syncBailHook = new SyncBailHook(['name', 'age'])

// 注册事件
syncBailHook.tap('first', (name, age) => console.log('1', name, age))
syncBailHook.tap('second', (name, age) => {
  console.log('2', name, age)
  return 2
})
syncBailHook.tap('third', (name, age) => console.log('3', name, age))

// 触发事件,让监听函数执行
const test = syncBailHook.call('xiong', 23)
console.log(test)

class MockSyncBailHook {
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
    // 依次执行事件处理函数，如果返回值不为空，则停止向下执行
    let i = 0
    let res = true
    while(res) {
      res = this.tasks[i++](...args)
    }
  }
}
