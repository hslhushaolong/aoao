/**
 * upload Model
 * */
import { message } from 'antd';
import {
  getBusinessDetail,
  getUploadToken,
  getUploadList,
  postUploadFile,
  postCheckFileDetail,
  postFileToQINIU,
} from './../services/upload';
import aoaoBossTools from './../utils/util';
import { authorize } from '../application';

export default {

  namespace: 'upload',
  state: {
    // 上传api记录
    uploadRecord: {
      _meta: {
        has_more: '',
        result_count: 0,
      },
      data: [],
    },
    // 七牛token
    token: '',
    // 七牛文件地址
    path: '',
    // 上传文件的信息
    file: '',
    // 校验后的详细信息
    fileDetail: {
      ok: '',
      data: [],
    },
    // 请求上传之后的返回response
    response: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;
        // 上传kpi
        if (pathname === '/Handle/Upload') {
          // 获取上传记录
          dispatch({
            type: 'getUploadRecordE',
            payload: {
              limit: 30,
              page: 1,
            },
          });
        }
      });
    },
  },

  effects: {
    // 获取上传记录
    *getUploadRecordE({ payload }, { call, put }) {
      const result = yield call(getUploadList, payload);
      yield put({
        type: 'getUploadRecordR',
        payload: result,
      });
    },

    // 获取七牛的token
    *getUploadTokenE({ payload }, { call, put }) {
      const result = yield call(getUploadToken, payload);
      if (result.ok) {
        yield put({
          type: 'getUploadTokenR',
          payload: result.token,
        });
        yield put({
          type: 'getUploadPathR',
          payload: result.path,
        });
      }
    },

    // 上传文件到七牛
    *postFileToQINIUE({ payload }, { call, put }) {
      // form形式上传文件
      if (payload.token) {
        const formdata = new FormData();
        // 为方便下载 将七牛所需要的key 存为文件名加时间戳
        const name = payload.file.name;
        // 为方便下载 将七牛所需要的key 存为文件名加时间戳
        const newTime = new Date();
        const time = aoaoBossTools.utctoTime(newTime);
        // 亚军写的目测根本用不到
        const key = `${time}${name}`;
        formdata.append('key', payload.key);
        formdata.append('token', payload.token);
        formdata.append('file', payload.file);
        const result = yield call(postFileToQINIU, formdata);
        if (result.key) {
          document.querySelector('#showUploadFile').innerHTML = `${name}`;
        }
      }
    },

    // 上传文件到7牛服务器
    *uploadToServer({ payload }, { call, put }) {
      // form形式上传文件
      if (payload.token) {
        const formdata = new FormData();
        // 为方便下载 将七牛所需要的key 存为文件名加时间戳
        const name = payload.file.name;
        // 为方便下载 将七牛所需要的key 存为文件名加时间戳
        const newTime = new Date();
        const time = aoaoBossTools.utctoTime(newTime);
        // 亚军写的目测根本用不到
        const key = `${time}${name}`;
        formdata.append('key', payload.key);
        formdata.append('token', payload.token);
        formdata.append('file', payload.file);
        const result = yield call(postFileToQINIU, formdata);
        if (result.key) {
          yield put({ type: 'reduceResponse', payload: result });
        }
      }
    },

    // 上传文件
    *uploadFile({ payload }, { call, put, select }) {
      const { data } = yield call(postFileToQINIU, payload);
      if (data.key) {
        message.success('文件上传成功');
      }
    },

    // 上传导入的kpi数据信息
    *postUploadFileE({ payload }, { call, put }) {
      const result = yield call(postUploadFile, payload);
      yield put({
        type: 'postCheckFileDetailR',
        payload: result,
      });
    },

    // 获取上传文件后的校验数据
    *postCheckFileDetailE({ payload }, { call, put }) {
      const result = yield call(postCheckFileDetail, payload);
      if (result.ok) {
        message.success('上传成功');
        // 清空详情展示模板数据
        yield put({
          type: 'postCheckFileDetailR',
          payload: {
            ok: '',
            data: [],
          },
        });
        // 亚军的老代码，目测没什么用
        document.querySelector('#showUploadFile').innerHTML = '';

        // 获取最新的导入记录
        yield put({
          type: 'getUploadRecordE',
          payload: {
            limit: 30,
            page: 1,
          },
        });
      }
    },

    // 重置上传数据
    *resetUploadResponse({ payload }, { call, put }) {
      yield put({ type: 'reduceResponse', payload: {} });
    },
  },

  reducers: {
    // 获取上传记录
    getUploadRecordR(state, action) {
      return {
        ...state,
        uploadRecord: action.payload,
      };
    },

    // 获取七牛的token
    getUploadTokenR(state, action) {
      return {
        ...state,
        token: action.payload,
      };
    },

    // 七牛key
    getUploadPathR(state, action) {
      return {
        ...state,
        path: action.payload,
      };
    },

    // 获取上传文件后的校验数据
    postCheckFileDetailR(state, action) {
      return {
        ...state,
        fileDetail: action.payload,
      };
    },
    // 上传之后返回的response
    reduceResponse(state, action) {
      return {
        ...state,
        response: action.payload,
      };
    },
  },

};
