## 关于node里面的console.log输出的性能问题

  有段时间公司项目喜欢把日志直接通过console.log输出在终端上 ， 然后通过容器服务直接读取日志并写入到日志服务中
### 好处
1. 可以直接在终端看到日志输出 在线上就能实时的观测日志（我们的服务是基于docker部署，通过docker.logs就能看到）
2. 测试环境开发也很方便
  直到有一天
  > egg官方的文档有说 

  _基于性能的考虑，在正式环境下，默认会关闭终端日志输出。如有需要，你可以通过下面的配置开启。（不推荐）_

  所以我们常用的console.log到底有什么性能问题呢。 让我们来探索一下

``` JavaScript
    function log(){
        process.stdout.write(util.format.apply(this,arguments))
    }
```

   > 也就是说这里用到了process.stdout 和 process.stderr ，，，，  c++里面的输入输出流 （大佬说这是文件流句斌） 

   [node官方解释](http://nodejs.cn/api/process.html#process_a_note_on_process_i_o)
   
1.  它们分别被用于 console.log() 和 console.error() 内部。
2.  写操作是否为同步，取决于连接到的流以及操作系统是 Windows 还是 POSIX：
    * 文件：在 Windows 和 POSIX 上都是同步的。
    * TTY（终端）：在 Windows 上是异步的，在 POSIX 上是同步的。
    * 管道（以及 socket）：在 Windows 上是同步的，在 POSIX 上是异步的。

    这些行为部分是历史原因，改变它们可能导致向后不兼容，而且它们的行为也符合部分用户的期望。

    同步的写操作可以避免一些问题，比如 console.log() 或 console.error() 写入的输出被不符合预期地交错，或者在异步的写入完成前调用了 process.exit() 导致根本没写入。 详见 process.exit()。

    注意，同步的写入会阻塞事件循环直到写入完成。 在输出到文件的情况下，这可能几乎是瞬时的，但当系统处于高负载时，管道的接收端不被读取，或者终端或文件系统速度缓慢，这可能使事件循环经常被长时间阻塞，从而对性能产生严重的负面影响。 当写入到交互的终端会话时，这可能不是个问题，但当写入生产日志到进程的输出流时，则要特别留心。

### 总结
    1. console.log在linux的TTY上是同步的 会阻塞系统运行 在生产环境要慎用
    2. 明白原理 才能明白原理
