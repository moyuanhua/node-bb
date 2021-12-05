### 常用的类型判断
```js

  function isBoolean(arg) {
    return typeof arg === 'boolean';
  }
  
  function isNull(arg) {
    return arg === null;
  }
  
  function isNullOrUndefined(arg) {
    return arg === null || arg === undefined;
  }
  
  function isNumber(arg) {
    return typeof arg === 'number';
  }
  
  function isString(arg) {
    return typeof arg === 'string';
  }
  
  function isSymbol(arg) {
    return typeof arg === 'symbol';
  }
  
  function isUndefined(arg) {
    return arg === undefined;
  }
  
  function isObject(arg) {
    return arg !== null && typeof arg === 'object';
  }
  
  function isError(e) {
    return {}.toString.call(e) === '[object Error]' || e instanceof Error;
  }
  
  function isFunction(arg) {
    return typeof arg === 'function';
  }
  
  function isPrimitive(arg) {
    return arg === null ||
           (typeof arg !== 'object' && typeof arg !== 'function');
  }

  function isArray(arg){
      return Array.isArray(arg);
  }

  function isBuffer(arg){
      return Buffer.isBuffer(arg);
  }
```
> 如果觉得麻烦可以直接使用npm库[is-type-of](https://www.npmjs.com/package/is-type-of)

> 欢迎大家评论指正 让我们一起来学习js

- 文档的整理在[github](https://github.com/moyuanhua/node-bb)
- 一起来学[leetcode](https://leetcode-cn.com/u/moyuanhua-3C7BtN50Gy/)