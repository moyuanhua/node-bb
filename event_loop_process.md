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
1. 所有任务都在主线程上执行，形成一个执行栈(Execution Context Stack)
2. 在主线程之外还存在一个任务队列(Task Queen),系统把异步任务放到任务队列中，然后主线程继续执行后续的任务
3. 一旦执行栈中所有的任务执行完毕，系统就会读取任务队列。如果这时异步任务已结束等待状态，就会从任务队列进入执行栈，恢复执行
4. 主线程不断重复上面的第三步

#### [解读setTimeout, promise.then, process.nextTick, setImmediate的执行顺序](https://www.cnblogs.com/jesse131/p/11708233.html) 讲的太棒了 醍醐灌顶


* 通过下面的代码实践我们可以发现  process.nextTick 
* settimeout 和 setImmediate 不一样 



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
