function Promise(executor) {
  const self = this;
  self.state = 'pending';
  self.value = undefined;
  self.reason = undefined;
  self.onResolved = [];
  self.onRejected = [];

  function resolve(data) {
    // 把状态由 pending -> resolved
    if (self.state === 'pending') {
      self.state = 'resolved';
      self.value = data;
      self.onResolved.forEach((fn) => {
        fn();
      });
    }
  }

  function reject(reason) {
    // 把状态由 pending -> rejected
    if (self.state === 'pending') {
      self.state = 'rejected';
      self.reason = reason;
      self.onRejected.forEach((fn) => {
        fn();
      });
    }
  }

  try {
    executor(resolve, reject);
  } catch(reason) {
    reject(reason);
  }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  const self = this;
  // 判断状态 resolved执行onfulfilled rejected执行onrejected
  if (self.state === 'resolved') {
    onFulfilled(self.value);
  } else if (self.state === 'rejected') {
    onRejected(self.reason);
  } else if (self.state === 'pending') {
    self.onResolved.push(() => {
      // 将onFulfilled回调函数push到成功回调数组中
      onFulfilled(self.value);
    });
    self.onRejected.push(() => {
      // 将onRejected回调函数push到失败回调数组中
      onRejected(self.reason);
    });
  }
};

module.exports = Promise;