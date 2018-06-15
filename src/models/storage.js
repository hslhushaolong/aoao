/**
 * 系统存储管理
 **/
import is from 'is_js';
import { getKnightType } from './../services/system';

import { authorize, system } from '../application/';
import { KnightType } from '../application/object/storage';
import Modules from '../application/define/modules';

export default {
  namespace: 'storage',
  state: {
    knightType: [],  // 骑士工作类型
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // 未登录则直接返回
      if (authorize.isLogin() === false) {
        return;
      }

      history.listen((location) => {
        const { pathname } = location;

        // 初始化数据
        if (['/Account'].includes(pathname)) {
          dispatch({ type: 'init' });
        }
      });
    },
  },

  effects: {

    * init({ payload }, { put }) {
      // 获取骑士工作类型
      yield put({ type: 'getKnightType' });
    },

    // 获取骑士工作类型
    * getKnightType({ payload = {} }, { call, put }) {
      // 默认参数
      const params = {
        limit: 999,
        page: 1,
        permission_id: Modules.ModuleAccount.id,
      };
      // 条数限制
      if (is.existy(payload.limit) && is.not.empty(payload.limit)) {
        params.limit = payload.limit;
      }
      // 分页
      if (is.existy(payload.page) && is.not.empty(payload.page)) {
        params.page = payload.page;
      }
      // 获取数据
      const result = yield call(getKnightType, params);
      // 判断数据是否为空
      if (is.not.empty(result.data) && is.existy(result.data)) {
        // 数据映射
        system.knightType = KnightType.mapperEach(result.data, KnightType);
        yield put({ type: 'reduceKnightType', payload: system.knightType });
      }
    },
  },

  reducers: {

    // 更新骑士数据
    reduceKnightType(state, action) {
      return { ...state, KnightType: action.payload };
    },
  },

};
