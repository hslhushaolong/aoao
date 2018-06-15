import is from 'is_js';
import dot from 'dot-prop';
import invariant from 'invariant';

class Storage {
  constructor(namespace, options = {}) {
    invariant(namespace, 'Storage: namespace should be defined');

    // 初始化命名空间
    this.prefix = 'v2.4.0.';
    this.namespace = namespace;
    this.options = options;

    // 判断是否使用sessionStorage
    const useSession = dot.get(options, 'useSession');
    if (is.truthy(useSession)) {
      this.storage = window.sessionStorage;
    } else {
      this.storage = window.localStorage;
    }

    // 子容器
    const container = dot.get(options, 'container');
    if (is.string(container) && is.existy(container) && is.not.empty(container)) {
      this.container = container;
    }
  }

  // 获取容器数据
  get data() {
    try {
      // 获取数据, 如果数据不存在则返回空数据
      const data = JSON.parse(this.storage.getItem(this.prefix + this.namespace)) || {};

      // 判断是否储从容器中获取数据
      if (is.string(this.container) && is.existy(this.container) && is.not.empty(this.container)) {
        return dot.get(data, this.container) || {};
      }
      return data;
    } catch (err) {
      console.error('Storage.get.localStorage : JSON.parse error ', err.code, err.name, err.message);
      return {};
    }
  }

  // 存储容器数据
  set data(data) {
    try {
      // 判断是否储存数据到容器中
      let toStorage;
      if (is.string(this.container) && is.existy(this.container) && is.not.empty(this.container)) {
        // 获取原始数据
        toStorage = JSON.parse(this.storage.getItem(this.prefix + this.namespace)) || {};
        // 添加新数据到容器中
        dot.set(toStorage, this.container, data);
      } else {
        toStorage = data;
      }

      // console.log('this.storage.setItem', this.namespace, this.container, data, toStorage);
      // 保存数据
      this.storage.setItem(this.prefix + this.namespace, JSON.stringify(toStorage, null, '\t'));
    } catch (err) {
      if (err.name === 'QuotaExceededError') {
        console.error('Storage.set : 超出储存容量', err.code, err.name, err.message);
      } else {
        console.error('Storage.set : JSON.stringify error ', err.code, err.name, err.message);
      }
      throw err;
    }
  }

  // 获取当前数据长度
  get size() {
    const data = is.not.empty(this.container) ? dot.get(this.data, this.container) : this.data;
    return Object.keys(data || {}).length;
  }

  // 获取数据
  get(key, defaultValue = undefined) {
    return dot.get(this.data, key, defaultValue);
  }

  // 储存数据
  set(key, value) {
    // console.log('set key, value', key, value);

    // 判断如果key不是字典，数组，字符串，数字。则直接返回
    invariant(is.json(key) || is.array(key) || is.string(key) || is.number(key), 'Storage.set: the key’s type should be json, array, string, number');

    // 判断如果有value，key不能为空
    if (arguments.length === 2) {
      // 判断key不应为空
      invariant(is.existy(key) && is.not.empty(key), 'Storage.set: the key should not empty or null');
    }

    // 判断如果key是字符串或数字，判断参数
    if (is.string(key) || is.number(key)) {
      invariant(arguments.length !== 1, 'Storage.set: please enter the value');
    }

    // 判断如果key是字典或数组，则value应为空
    if (is.json(key) || is.array(key)) {
      invariant(is.not.existy(value), 'Storage.set.objects: when set objects, the key should be an object or array, the value should be null');
    }

    let data = this.data;
    if (arguments.length === 1) {
      // 判断是否是数组，如果是数组直接赋值，不需要转化为object
      // 如果数据为空，直接赋值为空
      if (is.array(key) || is.empty(key)) {
        data = key;
      } else {
        // 遍历对象, 批量赋值
        Object.keys(key).forEach((k) => {
          dot.set(data, k, key[k]);
        });
      }
    } else {
      dot.set(data, key, value);
    }
    this.data = data;
    return this.data;
  }

  // 是否有数据
  has(key) {
    return dot.has(this.data, key);
  }

  // 删除数据
  delete(key) {
    const data = this.data;
    dot.delete(data, key);
    this.data = data;
    return this.data;
  }

  // 清空数据
  clear() {
    this.data = {};
    return {};
  }
}

module.exports = Storage;
