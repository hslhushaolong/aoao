/* eslint no-underscore-dangle: ["error", { "allow": ["_global","_config"] }]*/

import is from 'is_js';
import dot from 'dot-prop';
import Storage from '../library/storage';
import Router from './router';
import Modules from '../define/modules';
import { KnightTypeState } from '../define';

const namespace = 'aoao.app.system';

// 储存的key
const StorageItemKey = {
  knightType: 'knightType', // 骑士类型
};

class System {
  constructor() {
    // 全局变量（服务器获取的）
    this._global = new Storage(namespace, { container: 'global' });
  }

  // 骑士类型
  get knightType() {
    return this._global.get(StorageItemKey.knightType, []);
  }
  set knightType(info = []) {
    this._global.set(StorageItemKey.knightType, info);
  }

  // 根据平台获取骑士类型
  knightTypeByPlatform = (platform) => {
    return this.knightType.filter(item => `${item.platform.id}` === `${platform}`);
  }

  // 根据骑士类型id，获取骑士名称
  knightTypeById = (id) => {
    const type = this.knightType.filter(item => `${item.id}` === `${id}`);
    return dot.get(type, '0.name', '未知骑士类型');
  }

  // 根据工作性质, 启用禁用状态，获取骑士类型
  knightTypeByWorkProperty = (propertyId, state = KnightTypeState.on) => {
    return this.knightType.filter(item => (`${item.property.id}` === `${propertyId}` && `${item.state.id}` === `${state}`));
  }

  // 清空数据
  clear = () => {
    this._global.clear();
  }

  debug = () => {
    const storage = new Storage(namespace);
    console.log('storage', storage);
    console.log('this._global', this._global);
  }
}

module.exports = System;
