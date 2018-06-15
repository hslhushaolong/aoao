/**
 * 数据分析相关
 **/
import is from 'is_js';
import { message } from 'antd';
import moment from 'moment';

import { fetchBudgetData } from '../services/analysis.js';

export default {
  namespace: 'analysis',
  state: {
    budgetData: {}, // 商圈预估利润表
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;
        // 数据报表
        if (pathname === '/Analysis/Report') {
          dispatch({ type: 'fetchBudgetData', payload: { date: Number(moment().format('YYYYMM')), limit: 30, page: 1 } });
        }
      });
    },
  },

  effects: {

    // 商圈预估利润表
    * fetchBudgetData({ payload }, { call, put }) {
      const params = {
        date: payload.date,
        limit: 30,
      };
      // 判断分页参数
      if (is.existy(payload.page) && is.not.empty(payload.page)) {
        params.page = payload.page;
      }
      const result = yield call(fetchBudgetData, params);

      if (result === undefined) {
        message.error('获取数据失败');
      }

      yield put({ type: 'reduceBudgetData', payload: result });
    },
  },

  reducers: {

    // 更新商圈预估利润表
    reduceBudgetData(state, action) {
      return { ...state, budgetData: action.payload };
    },
  },
};
