import invariant from 'invariant';
import is from 'is_js';

// 请求任务的状态
const RequestTaskState = {
  none: 0,    // 无状态
  loading: 1, // 加载中
  success: 2, // 已完成
  failure: 3, // 失败
};

class RequestTask {
  constructor(key = '', message = '') {
    this.key = key;                     // 任务的key标示
    this.state = RequestTaskState.none; // 默认无状态
    this.message = message;             // 任务信息（扩展使用）
  }
}

class RequestNotification {
  constructor() {
    this.loadingCount = 0;    // 加载中的请求数量
    this.successCount = 0;    // 已完成的请求数量
    this.failureCount = 0;    // 错误的请求数量
    this.failureMessage = []; // 错误请求的信息
    this.requestQueue = [];   // 请求队列
    this.hooks = {};          // 钩子函数
  }

  // 创建请求
  create(key) {
    const task = new RequestTask(key);
    task.state = RequestTaskState.loading;
    this.requestQueue.push({ key, task });
  }

  // 请求成功
  success(key) {
    this.updateTaskState(key, RequestTaskState.success);
    this.dispatchHook();
  }

  // 请求失败
  failure(key, message) {
    this.updateTaskState(key, RequestTaskState.failure);
    // 添加错误信息
    this.failureMessage.push(message);
    this.dispatchHook();
  }

  // 更新任务状态
  updateTaskState(key, state) {
    let loadingCount = 0;     // 加载中的请求数量
    let successCount = 0;     // 已完成的请求数量
    let failureCount = 0;     // 错误的请求数量

    this.requestQueue.map((requestTask) => {
      // 修改任务状态
      const task = requestTask;
      if (task.key === key) {
        task.state = state;
      }

      // 根据状态计数
      switch (requestTask.state) {
        case RequestTaskState.loading:
          loadingCount += 1; break;
        case RequestTaskState.failure:
          failureCount += 1;
          break;
        case RequestTaskState.success:
          successCount += 1; break;
        default:
          break;
      }

      return task;
    });

    // 赋值当前任务状态
    this.loadingCount = loadingCount; // 加载中的请求数量
    this.successCount = successCount; // 已完成的请求数量
    this.failureCount = failureCount; // 错误的请求数量
  }

  // 重置所有请求数据
  reset() {
    this.loadingCount = 0;    // 加载中的请求数量
    this.successCount = 0;    // 已完成的请求数量
    this.failureCount = 0;    // 错误的请求数量
    this.failureMessage = []; // 错误请求的信息
    this.requestQueue = [];   // 通知队列
  }

  // 添加钩子函数，用于任务执行后的回调
  hook(key, hook) {
    invariant(is.function(hook), 'RequestNotification.hook: hook must be a function');
    this.hooks[key] = hook;
  }

  // 删除钩子
  removeHook(key) {
    delete this.hooks[key];
  }

  // 调用钩子
  dispatchHook() {
    const loadingCount = this.loadingCount;     // 加载中的请求数量
    const successCount = this.successCount;     // 已完成的请求数量
    const failureCount = this.failureCount;     // 错误的请求数量
    const failureMessage = this.failureMessage; // 错误请求的信息

    // 是否请求完成
    let isRequestFinish = false;
    if (this.requestQueue.length === successCount || this.requestQueue.length === successCount + failureCount) {
      isRequestFinish = true;
    }

    // 调用钩子，并且将当前的任务信息传递给钩子函数
    Object.keys(this.hooks).forEach((key) => {
      if (is.function(this.hooks[key])) {
        this.hooks[key](isRequestFinish, loadingCount, successCount, failureCount, failureMessage);
      }
    });

    // 判断如果请求已经全部完成，重置数据
    if (isRequestFinish) {
      this.reset();
    }
  }

}

module.exports = RequestNotification;
