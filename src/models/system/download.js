/**
 * 系统下载管理
 * */
import is from 'is_js';
import dot from 'dot-prop';
import { message } from 'antd';

import { fetchDownloadRecords } from './../../services/system';

export default {

  namespace: 'SystemDownloadModal',
  state: {
    downloadRecords: [],  // 下载的任务列表
  },

  effects: {

    // 获取下载任务的记录列表
    *fetchDownloadRecords({ payload }, { call, put }) {
      const params = {
        page: dot.get(payload, 'page', 1),
        limit: dot.get(payload, 'limit', 10),
        action: 2, // （1：上传，2：下载），目前只使用到下载，上传是服务器内部逻辑
      };

      const result = yield call(fetchDownloadRecords, params);

      if (result && is.existy(result.data)) {
        yield put({ type: 'reduceDownloadRecords', payload: result });
      } else {
        message.error('获取下载列表错误', result);
      }
    },

  },

  reducers: {
    // 获取下载任务的记录列表
    reduceDownloadRecords(state, action) {
      return { ...state, downloadRecords: action.payload };
    },
  },
};
