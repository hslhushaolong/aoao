import is from 'is_js';
import objectMapper from 'object-mapper';

class CoreObject {

  // 默认的数据映射表
  static datamap() {
    return {};
  }

  // 默认的反向映射数据
  static revertMap() {
    return {};
  }

  // 获取反向映射的数据id
  static revert(object) {
    // 判断对象是否为空
    if (is.not.existy(object) || is.not.object(object)) {
      return {};
    }

    // 判断获取映射表的方法是否实现
    if (is.not.function(this.revertMap)) {
      return {};
    }

    // 判断获取的映射表
    const datamap = this.revertMap();
    if (is.not.existy(datamap) || is.not.object(datamap)) {
      return {};
    }

    return objectMapper(object, datamap);
  }

  // 获取反向映射的数据id
  static revertEach(objects, ObjectClass = null) {
    // 判断实例对象的类型
    if (is.not.existy(ObjectClass) || is.not.function(ObjectClass)) {
      return [];
    }

    // 判断数据是否为空或不存在
    if (is.not.existy(objects) || is.empty(objects)) {
      return [];
    }

    // 判断获取映射表的方法是否实现
    if (is.not.function(ObjectClass.revertMap)) {
      return [];
    }

    const result = [];
    objects.forEach((item) => {
      // object mapper
      const object = objectMapper(item, ObjectClass.revertMap());
      // 添加实例对象到列表中
      result.push(object);
    });
    return result;
  }

  // 遍历数据映射表，返回对象
  static mapper(value, ObjectClass = null) {
    // 创建对象实例
    let instance;
    let datamap = {};
    if (ObjectClass !== null && typeof ObjectClass === 'function') {
      instance = new ObjectClass();
      datamap = ObjectClass.datamap();
    } else {
      instance = new this();
      datamap = this.datamap();
    }

    // 如果数据为空，则map字典为空，防止objectMapper死循环的bug
    if (value === null) {
      datamap = {};
    }

    // object mapper
    const object = objectMapper(value, datamap);

    // 返回实例对象
    return Object.assign(instance, object);
  }

  // 遍历列表对象
  static mapperEach(values, ObjectClass = null) {
    // 判断实例对象的类型
    if (is.not.existy(ObjectClass) || is.not.function(ObjectClass)) {
      return [];
    }

    // 判断如果
    if (is.not.existy(values) || is.empty(values)) {
      return [];
    }

    const result = [];
    values.forEach((item) => {
      // 获取遍历对象的实例
      const instance = new ObjectClass();
      // object mapper
      const object = objectMapper(item, ObjectClass.datamap());
      // 添加实例对象到列表中
      result.push(Object.assign(instance, object));
    });
    return result;
  }

}

module.exports = CoreObject;
