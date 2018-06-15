import { getEmployeeListS } from '../../services/employee';

export default {
  namespace: 'deductModel',
  state: {
    // 骑士列表
    knight: [],
  },
  effects: {
    // 请求某商圈下的骑士列表
    *getKnightListE({ payload }, { call, put }) {
      const result = yield call(getEmployeeListS, payload);
      if (result.data) {
        yield put({
          type: 'getKnightOfDistrictListR',
          payload: result.data,
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
  },
};
