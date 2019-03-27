### tapable demo

- 在Sync类型“钩子”下执行的插件都是顺序执行的，只能使用tap注册
- Async类型可以使用tap、tapAsync和tapPromise注册，分别通过call、callAsync和promise方法调用