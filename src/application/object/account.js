import dot from 'dot-prop';
import CoreObject from './core';
import { Position } from '../define/';
import Modules from '../define/modules';

// 判断是否可以访问模块，特殊条件的模块权限判断
const canAccessModule = (platforms, moduleKey) => {
  // KPI模版设置 模块权限 (只有百度平台才能访问)
  const kpiModules = ['ModuleOperationKPITemplateList'];
  if (platforms.includes('baidu') === false && kpiModules.includes(moduleKey)) {
    // console.log(`Debug: 添加特殊的模块授权${kpiModules}`);
    return false;
  }

  // 异常账号 模块权限 (只有饿了么平台才能访问)
  const expectionModules = ['MenuSystem', 'ModuleSystemAccountException', 'ModuleSystemAccountExceptionManage'];
  if (platforms.includes('elem') === false && expectionModules.includes(module.key)) {
    // console.log(`Debug: 特殊的授权模块无权限 ${expectionModules}`);
    return false;
  }

  return true;
};

// 区域
class District extends CoreObject {
  constructor() {
    super();
    this.id = '';     // 区域id
    this.name = '';   // 区域名称
  }
  // 数据映射
  static datamap() {
    return {
      biz_district_id: 'id',
      biz_district_name: 'name',
    };
  }
  // 反向映射
  static revertMap() {
    return {
      id: 'biz_district_id',
      name: 'biz_district_name',
    };
  }
}

// 城市
class City extends CoreObject {
  constructor() {
    super();
    this.id = '';           // 城市数据id
    this.name = '';         // 城市名称
    this.description = '';  // 城市描述（平台-城市）
    this.districts = [];    // 区域列表
  }
  // 数据映射
  static datamap() {
    return {
      city_spelling: 'id',
      city_name: 'name',
      city_name_joint: 'description',
      biz_district_list: {
        key: 'districts',
        transform: value => CoreObject.mapperEach(value, District),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: 'city_spelling',
      name: 'city_name',
      description: 'city_name_joint',
      districts: {
        key: 'biz_district_list',
        transform: value => CoreObject.revertEach(value, District),
      },
    };
  }
}

// 平台
class Platform extends CoreObject {
  constructor() {
    super();
    this.id = '';       // 平台数据id
    this.name = '';     // 平台名称
    this.cities = [];   // 城市列表
  }
  // 数据映射
  static datamap() {
    return {
      platform_code: 'id',
      platform_name: 'name',
      city_list: {
        key: 'cities',
        transform: value => CoreObject.mapperEach(value, City),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: 'platform_code',
      name: 'platform_name',
      cities: {
        key: 'city_list',
        transform: value => CoreObject.revertEach(value, City),
      },
    };
  }

}

// 账户信息对象
class Account extends CoreObject {
  constructor() {
    super();
    this.id = '';             // 账户id
    this.employeeId = '';     // 员工id
    this.name = '';           // 账户名称
    this.role = '';           // 账户角色
    this.position = '';       // 账户职位
    this.state = '';          // 账户状态 CHANGED 服务器返回数据没有该字段
    this.phone = '';          // 手机号
    this.scope = {            // 权限范围
      roles: [],              // 可管辖角色列表
      platforms: [],          // 可管辖平台列表
      positions: [],          // 可管辖职位列表
    };

    this.supplierId = '';     // 供应商id
    this.supplierName = '';   // 供应商名称

    this.accessToken = '';    // 授权token
    this.refreshToken = '';   // 刷新token
    this.expiredAt = '';      // token过期时间
  }

  // 数据映射
  static datamap() {
    return {
      account_id: 'id',
      staff_id: 'employeeId',
      name: 'name',
      phone: 'phone',
      state: 'state',
      permission: [{
        key: 'role',
        transform: value => ({ id: value.gid, name: value.name }),
      }, {
        key: 'position',
        transform: value => ({ id: value.gid, name: value.name }),
      }],
      // position_id: {
      //   key: 'position',
      //   transform: (value = [], sourceObject) => ({ id: value, name: dot.get(sourceObject, 'permission.name') }),
      // },
      'permission.permission_class': [
        {
          key: 'modules',
          transform: (permission = [], sourceObject) => {
            const permissionIds = [];
            permission.forEach((item) => {
              // 判断模块是否有权限
              if (item.state === 1) {
                permissionIds.push(item.id);
              }
            });

            const platforms = [];
            dot.get(sourceObject, 'region', []).forEach((platform) => {
              platforms.push(platform.platform_code);
            });

            // 本地的模块列表（根据权限模块的id）
            const modules = [];
            Object.keys(Modules).forEach((k) => {
              if (permissionIds.includes(Modules[k].id) && canAccessModule(platforms, Modules[k].key)) {
                modules.push(Modules[k]);
              }
            });

          // HACK：管理员权限下，应该拥有所有的模块。此处判断是核对前后端模块列表一致性使用。
          // if (modules.length !== permissionIds.length) {
          //   Object.keys(Modules).forEach((k) => {
          //     // 验证前端的模块是否存在与后端数据中
          //     if (permissionIds.includes(Modules[k].id) === false) {
          //       console.log('HACK: 前后端模块不一致', Modules[k]);
          //     }
          //   });
          // }

            return modules;
          },
        },
      ],
      jurisdictional_role_list: {
        key: 'scope.roles',
        transform: (values = []) => {
          const result = [];
          values.forEach((value) => {
            const { operable, gid, name, permission_id_list, pid } = value;
            result.push({ id: gid, name, operable, moduleIds: permission_id_list, pid });
          });
          return result;
        },
      },
      jurisdictional_position_list: {
        key: 'scope.positions',
        transform: (values) => {
          const result = [];
          values.forEach((value) => {
            const { operable, position_id, position_name, pid } = value;
            result.push({ id: position_id, name: position_name, operable, pid });
          });
          return result;
        },
      },
      region: {
        key: 'scope.platforms',
        transform: value => CoreObject.mapperEach(value, Platform),
      },
      access_token: 'accessToken',
      refresh_token: 'refreshToken',
      expired_at: 'expiredAt',

      supplier_id: 'supplierId',
      supplier_name: 'supplierName',
    };
  }

  // 反向数据映射 TODO: 支持revert
  static revertMap() {
    return {
      id: 'account_id',
      employeeId: 'staff_id',
      name: 'name',
      phone: 'phone',
      role: {
        key: 'role_id',
        transform: value => (value.id),
      },
      position: {
        key: 'position_id',
        transform: value => (value.id),
      },
      state: 'state',
      'scope.roles': {
        key: 'jurisdictional_role_list',
        transform: (values = []) => {
          const result = [];
          values.forEach((value) => {
            const { operable, id, name } = value;
            result.push({ gid: id, name, operable });
          });
          return result;
        },
      },
      'scope.positions': {
        key: 'jurisdictional_position_list',
        transform: (values) => {
          const result = [];
          values.forEach((value) => {
            const { operable, id, name } = value;
            result.push({ position_id: id, position_name: name, operable });
          });
          return result;
        },
      },
      'scope.platforms': {
        key: 'region',
        transform: value => (CoreObject.revertEach(value, Platform)),
      },

      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      expiredAt: 'expired_at',

      supplierId: 'supplier_id',
      supplierName: 'supplier_name',
    };
  }

}

module.exports = {
  Platform,   // 平台
  City,       // 城市
  District,   // 账户信息对象

  Account,    // 账户信息对象
};
