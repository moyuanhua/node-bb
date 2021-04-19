1. [关于node里面的console.log输出的性能问题](./console_log.md)
2. [event_loop,process_nextTick,setTimeout,setImmadiata](./event_loop_process.md)
3. [如何写一篇优秀的简历](https://www.zhihu.com/question/21520021/answer/1832490006)



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

* 通过继承 EventEmitter 来使得一个类具有 node 提供的基本的 event 方法, 这样的对象可以称为emiiter

>  Q: 如何通过继承来实现一个Event类 非extents写法
``` JAVASCRIPT
const EventEmitter = require('events')
// const { inherits } = require('util')
function inherits(ctor, superCtor) {
    Object.defineProperty(ctor, 'super_', {
        value: superCtor,
        writable: true,
        configurable: true
    })
    Object.setPrototypeOf(ctor.prototype, superCtor.prototype)
}

function Event() {
    EventEmitter.call(this) // 以This为主体触发EventEmitter的方法
}
inherits(Event, EventEmitter) // 实现继承

let newevent = new Event();
newevent.on('event1', () => {
    console.log(1)
})
newevent.emit('event1')
```

> Q: Eventemitter 的 emit 是同步还是异步?

> A: 是同步的
```JAVASCRIPT
// 这段代码会死循环
const EventEmitter = require('events');

let emitter = new EventEmitter();

emitter.on('myEvent', () => {
  console.log('hi');
  emitter.emit('myEvent');
});

emitter.emit('myEvent');
```

```JAVASCRIPT
// 这段代码可能会导致内存益处 因为对sth的引用没有释放
const EventEmitter = require('events');

let emitter = new EventEmitter();

emitter.on('myEvent', function sth () {
  emitter.on('myEvent', sth);
  console.log('hi');
});

emitter.emit('myEvent');
```

#### 阻塞/异步
> Q: 如何判断接口是否异步？ 是否只要有回调函数就是异步？ 

* 不是 要看回调的类型 比如 settimeout settimmidate process.nextTick 就是异步
* 涉及到I/O操作 比如网络请求 文件操作等都是异步
> 以下代码的回调就是同步
``` JavaScript
function a(cb) {
    console.log('before cb')
    cb();
    console.log('after cb')
}
a(() => {
    console.log('in cb')
})
console.log('after a')
```

> Q: 如何实现一个异步的 reduce? (注:不是异步完了之后同步 reduce)
``` JavaScript
const asyncPlus = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve.bind(this, a + b), 0);
    });
}

const getTotal = [1, 2, 3, 4].reduce((accumulator, currentValue) => {
    return Promise.resolve(accumulator).then((result) => {
        return asyncPlus(result, currentValue);
    });
});

getTotal.then((total) => {
    console.log(total);
});

```

#### 并行/并发
> 并发 (Concurrent) = 2 队列对应 1 咖啡机.

>并行 (Parallel) = 2 队列对应 2 咖啡机.

>Node.js 通过事件循环来挨个抽取事件队列中的一个个 Task 执行, 从而避免了传统的多线程情况下 2个队列对应 1个咖啡机 的时候上下文切换以及资源争抢/同步的问题, 所以获得了高并发的成就.

>至于在 node 中并行, 你可以通过 **cluster** 来再添加一个咖啡机.

### 进程 Cluster
[事件轮询相关event_loop,process_nextTick,setTimeout,setImmadiata](./event_loop_process.md)
> cluster 是实现node多进程的核心模块 它是基于 child_process.fork() 实现的, 所以 cluster 产生的进程之间是通过 IPC 来通信的

#### 进程间通信（IPC）
> 普通的 socket 是为网络通讯设计的, 而网络本身是不可靠的, 而为 IPC 设计的 socket 则不然, 因为默认本地的网络环境是可靠的, 所以可以简化大量不必要的 encode/decode 以及计算校验等, 得到效率更高的 UDS 通信.

### IO
#### Buffer 
> r. Buffer 类的实例非常类似整数数组, 但其大小是固定不变的
#### Stream
> Node.js 内置的 stream 模块是多个核心模块的基础 NetWork Http Fs
#### pipe
> pipe 方法最主要的目的就是将数据的流动缓冲到一个可接受的水平, 不让不同速度的数据源之间的差异导致内存被占满.

> 使用流和pipe下载文件和直接把文件读取到内存下载的区别是什么？ 
>> 一个内存会爆 一个可以通过pipe控制减少内存消耗

#### Console
 [关于node里面的console.log输出的性能问题](./console_log.md)

### NetWork
* cookie 与 session 的区别? 服务端如何清除 cookie? [more]
  > 主要区别在于, session 存在服务端, cookie 存在客户端. session 比 cookie 更安全. 而且 cookie 不一定一直能用 (可能被浏览器关掉). 服务端可以通过设置 cookie 的值为空并设置一个及时的 expires 来清除存在客户端上的 cookie.
* HTTP 协议中的 POST 和 PUT 有什么区别? [more]
  > POST 是新建 (create) 资源, 非幂等, 同一个请求如果重复 POST 会新建多个资源. PUT 是 Update/Replace, 幂等, 同一个 PUT 请求重复操作会得到同样的结果.
* 什么是跨域请求? 如何允许跨域? [more]
  > 
* TCP/UDP 的区别? TCP 粘包是怎么回事，如何处理? UDP 有粘包吗? [more]
* TIME_WAIT 是什么情况? 出现过多的 TIME_WAIT 可能是什么原因? [more]
* ECONNRESET 是什么错误? 如何复现这个错误?
* socket hang up 是什么意思? 可能在什么情况下出现? [more]
* hosts 文件是什么? 什么叫 DNS 本地解析?
* 列举几个提高网络传输速度的办法?