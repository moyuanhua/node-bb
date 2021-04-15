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

### 引用传递

*  js 中什么类型是引用传递, 什么类型是值传递? 如何将值类型的变量以引用的方式传递?
> 简单点说, 对象是引用传递, 基础类型是值传递, 通过将基础类型包装 (boxing) 可以以引用的方式传递
* js 中， 0.1 + 0.2 === 0.3 是否为 true ? 在不知道浮点数位数时应该怎样判断两个浮点数之和与第三数是否相等？

> 否 0.1 + 0.2 = 0.30000000004  可以参看[number-precision](https://github.com/nefe/number-precision/tree/master)
``` JavaScript
// 通过把小数转成整数来求的精确的浮点数相加的结果
// 0.1 + 0.02 = (0.1 * 100 + 0.02 * 100)/100 = 0.12 而不是等于 0.12000000000000001
```
>
*  内存释放 nodejs里面的GC是怎么样的？

