// 模拟异步加法
const asyncPlus = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve.bind(this, a + b), 1000);
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
