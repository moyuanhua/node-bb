1. [关于node里面的console.log输出的性能问题](./console_log.md)
2. [event_loop,process_nextTick,setTimeout,setImmadiata](./event_loop_process.md)




## 对@[饿了么 Node.js ](https://elemefe.github.io/node-interview/#/sections/zh-cn/?id=导读)知识整理
### js基础问题
####  类型判断
1. 判断一些参数的类型 
  >  _typeof_  

   > _{}.toString.call()_

   > _==_ 与 _===_ 一个只判断值 一个还判断类型 比如 ‘2’ == 2(true)  2==='2'{false}
``` JavaScript
function IsObject(arg){
  return arg !== null && typeof arg === 'object';
}
function IsError(arg){
  return {}.toString.call(arg) === '[object error]'
}
```

#### 作用域
1. let 与 var
``` JavaScript
function sayHi() {
  console.log(name) // undefined var 会提升变量 而let不会
  console.log(age) // ReferenceError
  var name = 'Lydia'
  let age = 21
}

sayHi()
```

#### 基础问题

*  js 中什么类型是引用传递, 什么类型是值传递? 如何将值类型的变量以引用的方式传递?
> 简单点说, 对象是引用传递, 基础类型是值传递, 通过将基础类型包装 (boxing) 可以以引用的方式传递
* js 中， 0.1 + 0.2 === 0.3 是否为 true ? 在不知道浮点数位数时应该怎样判断两个浮点数之和与第三数是否相等？

> 否 0.1 + 0.2 = 0.30000000004  可以参看[number-precision](https://github.com/nefe/number-precision/tree/master)
``` JavaScript
// 通过把小数转成整数来求的精确的浮点数相加的结果
// 0.1 + 0.02 = (0.1 * 100 + 0.02 * 100)/100 = 0.12 而不是等于 0.12000000000000001
```
>
*  const 定义的 Array 中间元素能否被修改? 如果可以, 那 const 修饰对象的意义是?
> 可以被修改 如果const修饰的是值类型 则不可以修改 如果const修饰的是引用类型 则该变量指向的引用是不能重新修改的 不能更改引用 

> 但是引用对象内部的值是可以修改（非const修饰）

* JavaScript 中不同类型以及不同环境下变量的内存都是何时释放? 内存泄漏
``` JavaScript
let arr = [];
while (true)
  // arr.push(1); // 会爆掉内存
  // arr.push(); // 不会爆掉内存
  arr.push(new Buffer(1000)); // 不会爆掉内存 是为什么呢 可能要学习buff
```

#### ext - 腾讯前端问到的一个问题 VUE的MVVM模型是如何监听一个数组里面的内容发生改变的
> VUE2 使用Object.defineProperty来实现对属性修改的监听 再配合观察者模式 来实现修改数据后的页面渲染

> 可以参见 [vue简单实现mvvm功能](https://zhuanlan.zhihu.com/p/107610658) 基于Object.defineProperty 
>> 补充 demo 没有实现Array的的内容变化监听 如果要实现Array 
1.  需要对修改Array长度的方法进行监听 
``` JavaScript
const methodsToPatch = [
  'push', // 向数组的末尾添加一个或更多元素，并返回新的长度。
  'pop', // 在队列的尾部删除一项 并返回删除的元素
  'shift', // 删除并返回数组的第一个元素
  'unshift', //向数组的开头添加一个或更多元素，并返回新的长度。
  'splice', // 删除元素，并向数组添加新元素。
  'sort', // 改变数组顺序
  'reverse' // 数组反转
]
```
2. 需要对数组中的每一项进行监听 在VUE2里面的核心代码如下
``` JavaScript
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) { // 就是这里了
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  ....
}
```

> TODO 使用Proxy&Reflect 实现以上demo

### 事件/异步
#### Promise

>有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise对象提供统一的接口，使得控制异步操作更加容易。

> Promise也有一些缺点。首先，无法取消Promise，**一旦新建它就会立即执行**，无法中途取消。其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

* Q: 如下代码, setTimeout 到 10s 之后再 .then 调用, 那么 hello 是会在 10s 之后在打印吗, 还是一开始就打印?
> 会在一开始就打印 就如上面加粗的文字 **一旦新建它就会立即执行**
``` javascript
let doSth = new Promise((resolve, reject) => {
  console.log('hello');
  resolve();
});

setTimeout(() => {
  doSth.then(() => {
    console.log('over');
  })
}, 10000);

```

* Q: 如下代码的输出顺序· @[解读setTimeout,promise.then,process.nextick,setimmediate](https://www.cnblogs.com/jesse131/p/11708233.html)
>2 3 5 6 4 7 1
``` JAVASCRIPT

setImmediate(() => { 
    console.log(7)
}) // 加入到下一次事件循环 创建TASK 0.  加入到check队列或者poll队列

setTimeout(function () {
    console.log(1) // xia
}, 0); // 加入到下一次事件循环 创建TASK 1.  加入到poll队列



new Promise(function executor(resolve) { // 立即执行 2.
    console.log(2); // 同步任务立即执行 3.
    for (var i = 0; i < 10000; i++) { //
        i == 9999 && resolve(); // 在同步任务中被调用 4. 创建microtask
    }
    console.log(3); // 同步任务 5.
}).then(function () {
    console.log(4); // 9 resolve回调 microTask的回调
});


process.nextTick(() => { // 6. 创建process.nextTick() ... 在TASK执行完成后立即执行
    console.log(6) //  8. process.nextTick()的回调 区别于微任务的回调 因为总在之前执行 会在主线任务完成后立马回调
})


console.log(5); //7. 同步任务
```

#### Event


