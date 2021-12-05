/**
 * 爱丽丝和鲍勃有不同大小的糖果棒：A[i] 是爱丽丝拥有的第 i 根糖果棒的大小，B[j] 是鲍勃拥有的第 j 根糖果棒的大小。

因为他们是朋友，所以他们想交换一根糖果棒，这样交换后，他们都有相同的糖果总量。（一个人拥有的糖果总量是他们拥有的糖果棒大小的总和。）

返回一个整数数组 ans，其中 ans[0] 是爱丽丝必须交换的糖果棒的大小，ans[1] 是 Bob 必须交换的糖果棒的大小。

如果有多个答案，你可以返回其中任何一个。保证答案存在。
 * @param {number[]} aliceSizes
 * @param {number[]} bobSizes
 * @return {number[]}
 */
 var fairCandySwap = function(aliceSizes, bobSizes) {
    let alice_total = 0;
    let bob_total = 0;
    let bob_obj = {};
    for(let i =0 ;i<aliceSizes.length; i++){
        alice_total += aliceSizes[i]
    }
    for(let i =0 ;i<bobSizes.length; i++){
        bob_total += bobSizes[i]
        bob_obj[bobSizes[i]] = true;
    }
    const diff = (bob_total - alice_total) / 2;
    for(let i =0 ;i<aliceSizes.length; i++){
        if(bob_obj[aliceSizes[i] + diff]){
            return [aliceSizes[i],aliceSizes[i] + diff]
        }
    }
    return []
};

console.log(fairCandySwap([2],[1,3]));