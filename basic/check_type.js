
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


  console.log(isError(new Error(123)))