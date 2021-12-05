// 给你一个整数数组 nums ，你需要找出一个 连续子数组 ，如果对这个子数组进行升序排序，那么整个数组都会变为升序排序。

// 请你找出符合题意的 最短 子数组，并输出它的长度。


/**
 * @param {number[]} nums
 * @return {number}
 */
 var findUnsortedSubarray = function(nums) {
   let stackmaxindex = [];
   let end = 0;
   for (let i = 1; i < nums.length; i++) {
        const value = nums[i];
        if(stackmaxindex.length){
            const curMax = nums[stackmaxindex[stackmaxindex.length -1]];
            if(value < curMax) {
                end = i;
            }else{
                if(i !== nums.length -1){
                   stackmaxindex.push(i); 
                }
            }
        }else{
            const prev = nums[i - 1];
            if(value <= prev){
                stackmaxindex.push(i -1);
                end = i;
            }
        }
   }
   console.log(end,stackmaxindex)
   if(stackmaxindex.length){
       return end - stackmaxindex[0] + 1;
   }
   return 0;
//    return cur - 
};

console.log(findUnsortedSubarray([1,2,3,3,3]))