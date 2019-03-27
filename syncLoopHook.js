// 串行同步执行
// 事件处理函数返回 true 表示继续循环
// 即循环执行--当前--事件处理函数
// 返回 undefined 表示结束循环
const { SyncLoopHook } = require('tapable')
//  创建实例
const syncLoopHook = new SyncLoopHook(['name', 'age'])

// 定义辅助变量
let total1 = 0
let total2 = 0
let total3 = 0
// 注册事件
syncLoopHook.tap('first', (name, age) => {
  console.log('1', name, age, total1)
  return total1++ < 3 ? true : undefined
})
syncLoopHook.tap('second', (name, age) => {
  console.log('2', name, age, total2)
  return total2++ < 3 ? true : undefined
})
syncLoopHook.tap('semi', (name, age) => {
  console.log('3', name, age, total3)
  return total3++ < 3 ? true : undefined
})
syncLoopHook.tap('third', (name, age) => console.log('4', name, age))

// 触发事件，让监听函数执行
syncLoopHook.call('panda', 18)


class MockSyncLoopHook {
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
    let i=0
    let len = args.length
    while(i<len) {
      const res = this.tasks[i](...args)
      if (res === undefined) {
        i++
      }
    }
  }
}