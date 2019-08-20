// 将回调式异步转化为promise
function promisefy(fn) {
  if (typeof fn !== 'function') throw new Error('params is not a function');
  const args = fn.arguments;
  // 参数分离
  const normalParams = args;
}