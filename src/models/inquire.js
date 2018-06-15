/**
 * 大查询 model
 */
// import { message } from 'antd';
// import aoaoBossTools from './../utils/util';
import { authorize } from './../application';
import { getEmployeeListS } from './../services/employee';
import { getSearchListS, getBillInfoS, getDistrictLevelS } from './../services/inquire';

export default {
  namespace: 'inquireModel',
  state: {
    // 平均列表
    averageList: [],
    // 总量列表
    totalList: [],
    // 日均统计
    dateData: [],
    // 总数统计
    totalData: [],
    // 单均统计
    orderDate: [],
    // 骑士列表
    knight: [],
    // 数据总数
    count: 0,
    tabelHeader: [],
    // 账单信息
    billInfo: [],
    // 商圈等级&商圈数据
    districtLevelData: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    // 请求某商圈下的骑士列表
    *getKnightListE({ payload }, { call, put }) {
      const result = yield call(getEmployeeListS, payload);
      if (result && result.data) {
        yield put({
          type: 'getKnightOfDistrictListR',
          payload: result.data,
        });
      }
    },
    //  search
    *getSearchListE({ payload }, { call, put }) {
      const data = yield call(getSearchListS, payload);
      if (data) {
        yield put({
          type: 'getSearchListR',
          payload: data,
        });
      }
    },
    // 账单信息
    *getBillInfoE({ payload }, { call, put }) {
      const data = yield call(getBillInfoS, payload);
      if (data) {
        yield put({
          type: 'getBillInfoR',
          payload: data,
        });
      }
    },
    // getDistrictLevelS
    *getDistrictLevelE({ payload }, { call, put }) {
      const data = yield call(getDistrictLevelS, payload);
      if (data) {
        yield put({
          type: 'getDistrictLevelR',
          payload: data,
        });
      }
    },
  },

  reducers: {
    // 骑士列表
    getKnightOfDistrictListR(state, action) {
      return {
        ...state,
        knight: action.payload,
      };
    },
    // search列表
    getSearchListR(state, action) {
      return {
        ...state,
        count: action.payload.count,  // 数据总数
        averageList: action.payload.table_data_list_1,  // 平均列表
        totalList: action.payload.table_data_list_2,    // 总量列表
        dateData: action.payload.data_avg_field,         // 日均统计
        orderData: action.payload.order_avg_field,       // 单均统计
        totalData: action.payload.total_avg_field,       // 总量统计
        tabelHeader: action.payload.table_head,         // 表头
      };
    },
    // getBillInfoR账单信息
    getBillInfoR(state, action) {
      return {
        ...state,
        billInfo: action.payload,
      };
    },
    getDistrictLevelR(state, action) {
      return {
        ...state,
        districtLevelData: action.payload.result,
      };
    },
  },
};
