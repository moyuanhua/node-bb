// function sayHi() {
//     console.log(name)
//     console.log(age)
//     var name = 'Lydia'
//     let age = 21
//   }

//   sayHi()

let arr = [];
while (true)
  // arr.push(1); // 会爆掉内存
  // arr.push(); // 不会爆掉内存
  arr.push(new Buffer(1000)); // 不会爆掉内存 是为什么呢 可能要学习buff

