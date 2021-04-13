``` text
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```
> 上图是node里面的event loop的示意图  原文 [The Node.js Event Loop, Timers, and process.nextTick()](https://github.com/nodejs/node/blob/v6.x/doc/topics/event-loop-timers-and-nexttick.md) 
1. 从上往下一次轮询 node的 event_loop
2. 每一个阶段都是一个 FIFO 的队列 
3. 每一个阶段都处理到这个阶段为空或者达到node的最大限制
4. 在poll阶段处理我们的代码的回调或者timer（settimeout，setImmediate）等的回调
5.  process.nextTick 不输入任何一个阶段 会阻塞事件轮询 所以不建议使用

* 通过下面的代码实践我们可以发现  process.nextTick 
> 当后台有 process.nextTick 的递归调用的时候 我们的http服务无法处理外部的请求 证明 event_loop被阻塞了 
*  settimeout 和 setImmediate 不一样 
> 如果是这两者的递归 其实是在加入了timer的队列里面 event_loop 在正常的进行



## question: process.nextTick 与 settimeout 以及 setImmediate 有何区别
``` JavaScript

const http = require('http');

async function sleep(){
    return new Promise((resolve) => {
        let i = 0;
        setInterval(() => {
            if(i===10){
                resolve()
            }
            i++;
        }, 1000);
    })
}

function sleepSync(){
    let time = new Date().getTime() + 10 * 1000 * 1000;
    while(new Date().getTime() < time){
        console.log(new Date().getTime(),time)
    }
    return;
}

const server = http.createServer(function(req,res){
   //  process.nextTick(async ()=> {
   //      console.log('begin nextick')
   //      sleepSync()
   //      console.log('after nextick')
   //  })
   //  console.log('get req');

    res.writeHead(200, {'Content-type' : 'text/html'});
    res.write('<h1>Node.js</h1>');
    res.end('<p>Hello World</p>');
});

server.on('listening',()=>{
    console.log('listening on 7001')
    // consol
   //  test()
   //  test3()
   //  test2(); // 使用process.nextTick 服务已经不能
})

server.listen(7001)



function test() { 
    console.log('settimeOut',new Date().getTime())
    setTimeout(() => {
        test()
    }, 0);
}

function test2() {
    console.log('process.nextTick',new Date().getTime())
    process.nextTick(() => test2());
}

function test3() {
    console.log('setImmediate',new Date().getTime())
    // process.nextTick(() => test2());
    setImmediate(()=>{
        test3()
    })
}

```
>  让我们在俩看一段代码

``` JavaScript

const http = require('http');

async function sleep(){
    return new Promise((resolve) => {
        let i = 0;
        setInterval(() => {
            if(i===10){
                resolve()
            }
            i++;
        }, 1000);
    })
}

function sleepSync(){
    let time = new Date().getTime() + 10 * 1000 * 1000;
    while(new Date().getTime() < time){
        console.log(new Date().getTime(),time)
    }
    return;
}

const server = http.createServer(function(req,res){
    process.nextTick(()=> {
        console.log('begin nextick')
        sleepSync()
        console.log('after nextick')
    })
    console.log('get req');

    res.writeHead(200, {'Content-type' : 'text/html'});
    res.write('<h1>Node.js</h1>');
    res.end('<p>Hello World</p>');
});

server.on('listening',()=>{
    console.log('listening on 7001')
})

server.listen(7001)

```

### 会阻塞请求
``` JavaScript
  process.nextTick(()=> {
        console.log('begin nextick')
        sleepSync()
        console.log('after nextick')
})
```

### 不阻塞请求的写法

``` JavaScript
  process.nextTick(async ()=> {
        console.log('begin nextick')
        await sleep()
        console.log('after nextick')
})
```

那为什么会有这种结果呢， 我猜测第二中写法里面sleep其实是个timer 把timer加入到 timer的队列以后 process.nextTick 就结束了
而第一种写法要等到同步的sleep结束之后才会把process.nextTick结束

## 结论
* 正确的理解 node 的 event_loop 很重要 是node实现高并发基础
* 在代码里面尽量少使用 process.nextTick
* 以上的东西是我瞎写的 但是都是实践过的 node 最近的新的文档好少 我来补充一下