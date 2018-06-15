/**
 * 授权，权限相关model
 **/

import is from 'is_js';
import { message } from 'antd';
import { fetchSystemAuthorize, updateSystemRole, createSystemRole, updateSystemPermission } from '../services/login.js';
import { authorize } from '../../src/application';

export default {
  namespace: 'authorize',
  state: {
    roles: [],        // 角色信息
    permissions: [],  // 权限信息
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;

        // 如果账号处于未登录，不进行处理
        if (authorize.isLogin() === false) {
          return;
        }

        // 如果已经在管理页面，获取角色信息
        if (pathname === '/Admin/Management/Roles' || pathname === '/Admin/Management/Authorize') {
          dispatch({ type: 'fetchSystemAuthorize' });
        }
      });
    },
  },

  effects: {

    // 更新系统的权限信息
    * updateSystemPermission({ payload }, { call, put }) {
      const { roleId, permission } = payload;

      const params = {
        permission_mp: {
          [roleId]: permission,
        },
      };
      const result = yield call(updateSystemPermission, params);

      if (result === undefined || is.not.existy(result.group_list) || is.not.existy(result.permission_group)) {
        message.error('更新权限失败，请稍后重试');
      } else {
        message.success('更新权限成功');
      }

      yield put({ type: 'reduceSystemAuthorize', payload: { roles: result.group_list, permissions: result.permission_group } });
    },

    // 获取系统的角色，权限信息
    * fetchSystemAuthorize({ payload }, { call, put }) {
      const result = yield call(fetchSystemAuthorize, payload);

      if (result === undefined || is.not.existy(result.group_list) || is.not.existy(result.permission_group)) {
        message.error('获取信息列表数据失败，请稍后重试');
        return;
      }

      yield put({ type: 'reduceSystemAuthorize', payload: { roles: result.group_list, permissions: result.permission_group } });
    },

    // 更新角色信息
    * updateSystemRole({ payload }, { call, put }) {
      const { gid, name, pid, state } = payload;
      const params = {
        gid,
        name,
        pid,
      };

      if (state !== '') {
        params.available = state;
      }

      const result = yield call(updateSystemRole, params);
      if (result && is.not.existy(result.code)) {
        message.success('操作成功');
        yield put({ type: 'fetchSystemAuthorize' });
      }
    },

    // 添加角色信息
    * createSystemRole({ payload }, { call, put }) {
      const { name, pid } = payload;
      const params = {
        name,
        pid,
      };

      const result = yield call(createSystemRole, params);
      if (result && is.not.existy(result.code)) {
        message.success('操作成功');
        yield put({ type: 'fetchSystemAuthorize' });
      }
    },
  },

  reducers: {

    // 更新角色信息
    reduceSystemAuthorize(state, action) {
      // 保存权限列表信息
      // Permissions.saveModulesByPermissions(action.payload.permissions || []);
      return { ...state, roles: action.payload.roles, permissions: action.payload.permissions };
    },
  },
};
