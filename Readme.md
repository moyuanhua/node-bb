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

* 如何理解TCP/IP 和 HTTP的关系是什么. 请看[一针见血的讲解](https://mp.weixin.qq.com/s/TMe5QsBL6t6YPt_vLHNZ6w)

  > 如果我们把TCP/IP理解成物流运输里面的快递公司/运货司机 HTTP就是发货人和收货人 。 TCP/IP是为HTTP服务的 TCP负责数据包的发送/接收与重发(在TCP的头部定义了SCOKET端口号，包校验等信息，对应我们运货中的地址和人)，IP负责数据在网络中链路传输（在IP的头部里面定义了目标IP和源IP，通过DNS等路由的手段把数据传输到目的地， 在这个过程中可能出现意外会导致数据没有送到，此时TCP就负责重新发送一份数据）。

  > 而HTTP(我们常说HTTP服务端，HTTP客户端就是作为收货人和发货人) 在接收到数据后按照协议解析即可

  > 那么HTTP与HTTPS呢？ 请看[一遍见血的讲解#2](https://zhuanlan.zhihu.com/p/43789231) https安全吗？ （很安全）
    1. 加密数据只有客户端和服务器端才能得到明文，客户端到服务端的通信过程是安全的。
    2. 防止 _中间人攻击_ (因为http的内容是明文传输的，明文数据会经过中间代理服务器、路由器、wifi热点、通信服务运营商等多个物理节点，如果信息在传输过程中被劫持，传输的内容就完全暴露了。劫持者还可以篡改传输的信息且不被双方察觉)
    3. ssl证书做到了防止中间人攻击 那么Charles与Fiddler等抓包软件是如何抓取https请求的呢? [浅谈Charles抓取HTTPS原理](https://www.jianshu.com/p/405f9d76f8c4)


        > (前提是客户端选择信任并安装Charles的CA证书) 其实就是拦截了双方的请求，并且伪造了ca证书， 如果客户端不信任Charles的证书，其实Charles也没有办法。
    
     4. 如果我们不在浏览器请求, 比如在服务器上请求某个HTTPS的API 是否也会加密呢？ 

        > 


* cookie 与 session 的区别? 服务端如何清除 cookie? [more]
  > 主要区别在于, session 存在服务端, cookie 存在客户端. session 比 cookie 更安全. 而且 cookie 不一定一直能用 (可能被浏览器关掉). 服务端可以通过设置 cookie 的值为空并设置一个及时的 expires 来清除存在客户端上的 cookie.
* HTTP 协议中的 POST 和 PUT 有什么区别? [more]
  > POST 是新建 (create) 资源, 非幂等, 同一个请求如果重复 POST 会新建多个资源. PUT 是 Update/Replace, 幂等, 同一个 PUT 请求重复操作会得到同样的结果.
* 什么是跨域请求? 如何允许跨域? [more]
  > 出于安全考虑, 默认情况下使用 XMLHttpRequest 和 Fetch 发起 HTTP 请求必须遵守同源策略, 即只能向相同 host 请求 (host = hostname : port) 同源除了相同 host 也包括相同协议. 所以即使 host 相同, 从 HTTP 到 HTTPS 也属于跨域

  > 向不同 host 的请求被称作跨域请求 (cross-origin HTTP request). 可以通过设置 CORS headers 即 Access-Control-Allow- 系列来允许跨域.

* TCP/UDP 的区别? TCP 粘包是怎么回事，如何处理? UDP 有粘包吗? [more]
>  UDP 速度快, 开销低, 不用封包/拆包允许丢一部分数据, 监控统计/日志数据上报/流媒体通信等场景都可以用 UDP.

> TCP粘包就是指发送方发送的若干包数据到达接收方时粘成了一包，从接收缓冲区来看，后一包数据的头紧接着前一包数据的尾，出现粘包的原因是多方面的，可能是来自发送方，也可能是来自接收方。
> #### 解决办法
> 1. 多次发送之前间隔一个等待时间
> 2. 关闭 Nagle 算法
> 3. 进行封包/拆包

> 所以粘包出现的情况就是数据需要顺序到达 而UDP是无序的 所有UDP没有粘包

> 
* TIME_WAIT 是什么情况? 出现过多的 TIME_WAIT 可能是什么原因? [more]
* ECONNRESET 是什么错误? 如何复现这个错误?

* socket hang up 是什么意思? 可能在什么情况下出现? [more]
> hang up 有挂断的意思, socket hang up 也可以理解为 socket 被挂断. 在 Node.js 中当你要 response 一个请求的时候, 发现该这个 socket 已经被 "挂断", 就会就会报 socket hang up 错误.

> 典型的情况是用户使用浏览器, 请求的时间有点长, 然后用户简单的按了一下 F5 刷新页面. 这个操作会让浏览器取消之前的请求, 然后导致服务端 throw 了一个 socket hang up.
* hosts 文件是什么? 什么叫 DNS 本地解析?
> hosts 文件是个没有扩展名的系统文件, 其作用就是将网址域名与其对应的 IP 地址建立一个关联“数据库”, 当用户在浏览器中输入一个需要登录的网址时, 系统会首先自动从 hosts 文件中寻找对应的IP地址.

> 当我们访问一个域名时, 实际上需要的是访问对应的 IP 地址. 这时候, 获取 IP 地址的方式, 先是读取浏览器缓存, 如果未命中 => 接着读取本地 hosts 文件, 如果还是未命中 => 则向 DNS 服务器发送请求获取. 在向 DNS 服务器获取 IP 地址之前的行为, 叫做 DNS 本地解析.
* 列举几个提高网络传输速度的办法?
> zlib 压缩

### OS
1. 什么是 TTY? 如何判断是否处于 TTY 环境?
  > "tty" 原意是指 "teletype" 即打字机, "pty" 则是 "pseudo-teletype" 即伪打字机. 在 Unix 中, /dev/tty* 是指任何表现的像打字机的设备, 例如终端 (terminal).

  > 你可以通过 w 命令查看当前登录的用户情况, 你会发现每登录了一个窗口就会有一个新的 tty.
2. 不同操作系统的换行符 (EOL) 有什么区别?
  > end of line (EOL) 同 newline, line ending, 以及 line break.
  #### LF
  > 在 Unix 或 Unix 相容系统 (GNU/Linux, AIX, Xenix, Mac OS X, ...)、BeOS、Amiga、RISC OS
  #### CR+LF	
  > MS-DOS、微软视窗操作系统 (Microsoft Windows)、大部分非 Unix 的系统
  #### CR
  > Apple II 家族, Mac OS 至版本9

  ### 错误处理/调试

  1. 怎么处理未预料的出错? 用 try/catch , domains 还是其它什么
  > [NodeJS 错误处理最佳实践](https://cnodejs.org/topic/55714dfac4e7fbea6e9a2e5d) 只要看他的
  > 

  TODO 使用一下技术搭建egg的一个框架
  > 1.  [let it crash](http://wiki.c2.com/?LetItCrash) 有时候我们让程序崩溃重启是最好的解决方案
  > 2.  [verror](https://www.npmjs.com/package/verror) 在nodejs里面优雅的处理错误
  > 3.  [koa中间件处理错误](https://github.com/koajs/koa/wiki/Error-Handling)
  > 4.  [debug](https://www.npmjs.com/package/debug)

  ### 测试
  1. 单元测试的必要性（要求速度还是质量）

  ### util
  1. HTTP 如何通过 GET 方法 (URL) 传递 let arr = [1,2,3,4] 给服务器?
  > 通过第三方库qs实现对象或者数组的传递
  2. Node.js 中继承 (util.inherits) 的实现?
  ```JavaScript
  exports.inherits = function(ctor, superCtor) {

  if (ctor === undefined || ctor === null)
    throw new TypeError('The constructor to "inherits" must not be ' +
                        'null or undefined');

  if (superCtor === undefined || superCtor === null)
    throw new TypeError('The super constructor to "inherits" must not ' +
                        'be null or undefined');

  if (superCtor.prototype === undefined)
    throw new TypeError('The super constructor to "inherits" must ' +
                        'have a prototype');

  ctor.super_ = superCtor;
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
  };
  ```
  

  ### 存储

  1. [数据库范式](https://www.cnblogs.com/CareySon/archive/2010/02/16/1668803.html) 更好的设计数据库表格
      > 1. 减少数据冗余（这是最主要的好处，其他好处都是由此而附带的）
      > 2. 消除异常（插入异常，更新异常，删除异常）
      > 3. 让数据组织的更加和谐
      
      > 其实就是让数据表格变成关系型表格 更加合理的数据组织结构 把数据变成关系


  2. mongo 与 mysql的区别与优势
      > mongo 似乎可以满足所有mysql的功能 同时还提供比较强的可扩展性 比如由于业务的原因导致字段的增删改 在mongo里面实现起来很容易
      > 在mysql里面由于有外键之类的限制 或者需要只想sql语句等才能调整表格设计
      
      > mongo 在做连表查询的时候一般通过冗余字段的方式来做 比如查询用户名为 王XX的订单 可以把订单的记录中冗余用户的姓名这样可以提高查询效率

  ### redis
  1. 数据持久化
      >  RDB持久化是指在指定的时间间隔内将内存中的数据集快照写入磁盘，实际操作过程是fork一个子进程，先将数据集写入临时文件，写入成功后，再替换之前的文件，用二进制压缩存储。
      * 一旦采用该方式，那么你的整个Redis数据库将只包含一个文件，这对于文件备份而言是非常完美的。比如，你可能打算每个小时归档一次最近24小时的数据，同时还要每天归档一次最近30天的数据。通过这样的备份策略，一旦系统出现灾难性故障，我们可以非常容易的进行恢复。
      * 对于灾难恢复而言，RDB是非常不错的选择。因为我们可以非常轻松的将一个单独的文件压缩后再转移到其它存储介质上。
      * 性能最大化。对于Redis的服务进程而言，在开始持久化时，它唯一需要做的只是fork出子进程，之后再由子进程完成这些持久化的工作，这样就可以极大的避免服务进程执行IO操作了。
      * 相比于AOF机制，如果数据集很大，RDB的启动效率会更高。

        * 如果你想保证数据的高可用性，即最大限度的避免数据丢失，那么RDB将不是一个很好的选择。因为系统一旦在定时持久化之前出现宕机现象，此前没有来得及写入磁盘的数据都将丢失。
        * 由于RDB是通过fork子进程来协助完成数据持久化工作的，因此，如果当数据集较大时，可能会导致整个服务器停止服务几百毫秒，甚至是1秒钟。

      
      >  AOF持久化以日志的形式记录服务器所处理的每一个写、删除操作，查询操作不会记录，以文本的方式记录，可以打开文件看到详细的操作记录。

      #### redis 问题
      ![alt redis问题总结](./redis/problem.jpeg)
    
      1. 为什么哈希表操作变慢了
        > redis通过一个全局的hash表来存储所有的键值对（其实是键指针和值指针） 称为全局哈希表
        > 如此我们查询key的过程其实就是hash计算 不管是10w个键还是100w个键 我们只需要通过一次hash计算就能得到它的未知

        > 但是哈希表的可能存在rehash的情况 当发生hash冲突的时候 redis会启用渐进式rehash
          
          1. 默认准备两个相同带下的hash表 hash1 hash2，hash2的空间会大一些 

          2. 开始的时候hash1存储数据 当需要rehash的时候
            
            2.1 处理第一个请求 从哈希表 1 中的第一个索引位置开始，顺带着将这个索引位置上的所有 entries 拷贝到哈希表 2 中
            
            2.2 等处理下一个请求时，再顺带拷贝哈希表 1 中的下一个索引位置的 entries

        ### 底层数据结构
      ![alt redis问题总结](./redis/struct.jpg)


      2. 单线程的redis为什么这么快
        > Redis 的网络 IO 和键值对读写是由一个线程来完成的，这也是 Redis 对外提供键值存储服务的主要流程
        
        > 一方面，Redis 的大部分操作在内存上完成，再加上它采用了高效的数据结构，例如哈希表和跳表，这是它实现高性能的一个重要原因

        > 另一方面，就是 Redis 采用了多路复用机制，使其在网络 IO 操作中能并发处理大量的客户端请求，实现高吞吐率。接下来，我们就重点学习下多路复用机制。(其实也是基于事件回调 和node的eventloop很相似 node的eventloop是基于v8引擎 而多路服用是，，，，)