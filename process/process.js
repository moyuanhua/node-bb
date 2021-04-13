function test() { 
    console.log(new Date())
    process.nextTick(() => test());
}

test()

// 这样执行是没有任何问题的 程序也不会开始 但是事件轮询是不是被终止了呢