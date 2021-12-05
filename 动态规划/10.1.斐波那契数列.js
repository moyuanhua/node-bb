/**
 * @param {number} n 
 */
var fb = function(n){
    const db = new Array(n+1).fill(0);
    db[1] = 1;
    for (let i = 2; i <= n; i++) {
        db[i] = db[i - 1] + db[i-2]
        db[i] %= 1000000007;
    }
    return db[n]
} 
// 以上是循环记忆法


var fb1 = function(n) {
    let a = 0;
    let b = 1;
    let sum = 1;
    for (let i = 0; i < n; i++) {
        sum = a + b;
        a = b;
        b = sum % 1000000007;        
    }
    return a;
}


console.log(fb1(81))
