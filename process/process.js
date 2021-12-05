Promise.resolve().then(() => console.log('promise resolve1'));
new Promise((res, rej) => {
res()
}).then(() => console.log('promise resolve2'));
process.nextTick(() => console.log('nextTick'));

// 这样执行是没有任何问题的 程序也不会开始 但是事件轮询是不是被终止了呢