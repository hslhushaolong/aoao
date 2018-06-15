/* eslint no-underscore-dangle: ["error", { "allow": ["_account", '_vendor', '_vendors', '_phones'] }]*/

import is from 'is_js';
import dot from 'dot-prop';
import Storage from '../library/storage';
import Router from './router';

class Authorize {
  constructor() {
    // 授权信息
    this._account = new Storage('aoao.app.authorize', { container: 'auth' });
    // 当前账号服务商(构造)
    this._vendor = new Storage('aoao.app.authorize', { container: 'vendor' });
    // 多账号列表
    this._vendors = new Storage('aoao.app.authorize', { container: 'vendors' });
    // 系统中所有有效手机号(移除到system)
    this._phones = new Storage('aoao.app.authorize', { container: 'phones' });
  }

  get account() {
    return this._account.data;
  }

  set account(info) {
    this._account.set(info);
  }

  // 获取供应商列表
  get vendors() {
    return this._vendors.data;
  }

  set vendors(info) {
    this._vendors.set(info);
  }

  // 获取当前关联的供应商
  get vendor() {
    return this._vendor.data;
  }

  set vendor(info) {
    this._vendor.set(info);
  }

  // 系统中所有的账户
  // TODO: 后期要改变方式，不能使用这种方式调用
  get phones() {
    return this._phones.data;
  }

  set phones(info) {
    this._phones.set(info);
  }

  // 登录成功后 update 账号供应商信息
  setAuthVendor = (id, name) => {
    // 供应商id
    this._account.set('supplierId', id);
    // 供应商名称
    this._account.set('supplierName', name);
  }

  // 角色ID
  roleId = () => {
    return this._account.get('role.id', '');
  }

  // 职位id
  positionId = () => {
    return this._account.get('position.id', '');
  }

  /**
   * 可管辖职位列表
   *
   * @param  {String} [operable=''] 过滤数据参数，默认参数为空，返回所有数据。 opearable值为true或false
   * @param  {Bool}   [onlyShowNextLevel=''] 过滤数据参数，默认参数为false, 只显示子级别数据
   * @return {Array} 过滤后职位列表的数据
   */
  positions = (operable = '', onlyShowNextLevel = false) => {
    // 当前的角色id
    const selfId = this.roleId();
    // 所有的职位
    let positions = this._account.get('scope.positions', []);

    // 判断是否只显示下一级
    if (onlyShowNextLevel) {
      positions = positions.filter(item => item.pid === selfId);
    }

    // 默认的过滤器，如果参数为空，则默认返回所有数据
    if (operable === '') {
      return positions;
    }

    // 过滤数据，operable的数值可能为true或false
    return positions.filter(item => item.operable === operable && item.id !== selfId);
  }

  /**
   * 可管辖角色列表
   *
   * @param  {String} [operable=''] 过滤数据参数，默认参数为空，返回所有数据。 opearable值为true或false
   * @param  {Bool}   [onlyShowNextLevel=''] 过滤数据参数，默认参数为false, 只显示子级别数据
   * @return {Array} 过滤后角色列表的数据
   */
  roles = (operable = '', onlyShowNextLevel = false) => {
    // 当前的角色id
    const selfId = this.roleId();
    // 所有的角色
    let roles = this._account.get('scope.roles', []);

    // 判断是否只显示下一级
    if (onlyShowNextLevel) {
      roles = roles.filter(item => item.pid === selfId);
    }

    // 默认的过滤器，如果参数为空，则默认返回所有数据
    if (operable === '') {
      return roles;
    }
    // 过滤数据，operable的数值可能为true或false
    return roles.filter(item => item.operable === operable && item.id !== selfId);
  }

  // 负责平台
  platform = () => {
    return this._account.get('scope.platforms', []);
  }

  // 获取区域id下的城市列表
  cities = (platformIds = []) => {
    if (is.not.array(platformIds)) {
      return [];
    }

    let result = [];
    // 获取平台数据
    const platforms = this._account.get('scope.platforms', []);
    // 遍历平台下的数据，获取指定code的城市
    platforms.forEach((item) => {
      // 当前遍历对象的平台code
      const code = dot.get(item, 'id', '');
      // 当前平台的城市列表
      const cities = dot.get(item, 'cities', []);
      // 判断获取的平台中有没有当前遍历对象
      if (platformIds.includes(code)) {
        // 合并所有平台的城市
        result = result.concat(cities);
      }
    });
    return result;
  }

  // 获取城市id下的商圈
  districts = (cityIds = []) => {
    if (is.not.array(cityIds)) {
      return [];
    }

    let result = [];
    // 获取平台数据
    const platforms = this._account.get('scope.platforms', []);
    // 遍历平台下的数据，获取指定code的城市
    platforms.forEach((item) => {
      // 遍历城市
      dot.get(item, 'cities', []).forEach((city) => {
        // 判断是否存在城市，合并商圈
        if (cityIds.includes(dot.get(city, 'id', ''))) {
          result = result.concat(dot.get(city, 'districts', []));
        }
      });
    });

    return result;
  }

  // 判断用户是否在指定的平台中
  hasPlatform = (platform = '') => {
    const platforms = this.platform();
    let hasPlatform = false;
    platforms.forEach((item) => {
      if (item.id === platform) {
        hasPlatform = true;
      }
    });
    return hasPlatform;
  }

  // 判断用户角色是否在请求的数据中
  hasRole = (roles = []) => {
    if (is.empty(roles) || is.not.existy(roles) || is.not.array(roles)) {
      return false;
    }
    const roleId = this.roleId();
    return roles.includes(roleId);
  }

  // 根据平台id获取平台名称
  platformNameById = (platformId) => {
    const platforms = this.platform();
    const platform = platforms.filter((v) => {
      return `${v.id}` === `${platformId}`;
    });
    return dot.get(platform, '0.name', '未知平台');
  }

  // 根据角色id，获取角色名称
  roleNameById = (roleId) => {
    const roles = this.roles();
    const role = roles.filter((v) => {
      return `${v.id}` === `${roleId}`;
    });
    return dot.get(role, '0.name', '未知角色或职位');
  }

  // 根据职位id，获取职位名称
  poistionNameById = (poistionId) => {
    // 目前职位的数据与角色一致，处理方式一致。预留此接口准备后续开发
    return this.roleNameById(poistionId);
  }

  // 判断是否登陆
  isLogin = () => {
    if (is.not.empty(this._account.data)
      && is.existy(this._account.data)
      && is.existy(this._account.data.id)
      && is.existy(this._account.data.accessToken)) {
      return true;
    }
    return false;
  }

  // 判断是否需要选择多账号 && 供应商数据
  isAuth = () => {
    // 是否登录
    if (!this.isLogin()) {
      return false;
    }
    if (is.not.empty(this._account.data)
      && is.existy(this._account.data)
      && (this._account.data.supplierId !== undefined)
      && is.not.empty(this._vendor.data)
      && is.existy(this._vendor.data.supplierId)
    ) {
      return true;
    }
    return false;
  }

  // 获取当前用户能访问的模块
  modules = () => {
    return this._account.get('modules');
  }

  // 判断某个角色是否有操作的权限
  hasPermission = (roleId, operateModule) => {
    // 判断模块id是否存在，不存在则没有权限
    const moduleId = dot.get(operateModule, 'id');
    if (is.not.existy(moduleId) || is.empty(moduleId)) {
      return false;
    }

    const roles = this.roles();
    const role = roles.filter((v) => {
      return `${v.id}` === `${roleId}`;
    });
    // 判断模块的id列表，为空则没有权限
    const moduleIds = dot.get(role, '0.moduleIds', []);
    if (is.not.existy(moduleIds) || is.empty(moduleIds)) {
      return false;
    }

    return moduleIds.includes(moduleId);
  }

  // 判断是否有权限使用某内置功能
  canOperate = (operateModule) => {
    // 如果没有登陆则不能访问
    if (this.isLogin() === false) {
      return false;
    }

    // 超级管理员，默认拥有所有权限
    if (this.roleId() === 1000) {
      return true;
    }

    // 判断是否是功能操作模块
    if (is.not.truthy(dot.get(operateModule, 'isOperate'))) {
      return false;
    }

    // 当前角色能访问的所有模块
    const modules = this.modules();

    // 遍历角色拥有的所有模块
    let canOperate = false;
    modules.forEach((module) => {
      // 判断当前路径是否存在于模块中
      if (module.key === operateModule.key) {
        canOperate = true;
      }
    });

    return canOperate;
  }

  // 判断模块是否可以被访问
  canAccess = (pathname) => {
    // 默认界面
    if (pathname === '/') {
      return true;
    }

    // 如果没有登陆则不能访问
    if (this.isLogin() === false) {
      return false;
    }

    // 超级管理员，默认拥有所有权限
    if (this.roleId() === 1000) {
      return true;
    }

    // 当前角色能访问的所有模块
    const modules = this.modules();

    // 过滤路径中的字符串
    const path = pathname.replace(/\/*([\W\w]+)/, '$1');

    // 遍历角色拥有的所有模块
    let canAccess = false;
    modules.forEach((module) => {
      // 判断当前路径是否存在于模块中
      if (module.path === path) {
        canAccess = true;
      }
    });

    // 调试权限使用的日志
    // console.log('Debug:', pathname, path, canAccess);
    return canAccess;
  }

  // 菜单栏
  navigation = () => {
    return Router.navigationByAccessHook(this.canAccess);
  }

  // 清空数据
  clear = () => {
    this._account.clear();
    this._vendors.clear();
    this._vendor.clear();
    this._phones.clear();
    // TODO:临时做兼容清除
    window.sessionStorage.clear();
    // 清除全部缓存
    window.localStorage.removeItem('AOAOBOSS_CONSTANT');
    window.localStorage.removeItem('AOAOBOSS');
  }

  debug = () => {
    const storage = new Storage('aoao.app.authorize');
    // console.log('storage', storage);
    // console.log('this._account', this._account);
    // console.log('isLogin', this.isLogin());
  }
}

module.exports = Authorize;
