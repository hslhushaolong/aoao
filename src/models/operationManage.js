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
  createKpiTemplate,        // 创建kpi模版
  editKpiTemplate,          // 编辑kpi模版
  kpiTemplateDetail,        // kpi模版详情
  kpiTemplateInfo,          // kpi模版信息
  kpiTemplateList,          // kpi信息列表
  createUploadKpi,          // 生成kpi模版
  getUploadKpi,             // 获取kpi模版
} from './../services/operationManage';
import { authorize } from '../application';

export default {
  namespace: 'operationManage',
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
    // kpi模版详情
    templateDetail: {
      template_type: null, // 模板类型
      city_list: [], // 城市全拼列表
      date: '',  // 日期

      delivery_type: null,   // 配送类型

      order_type: null, // 订单类型
      knight_type: null,   // 骑士类型
      baidu_biz_district_type: '',  // 百度商圈类型
      biz_district_level: null,   // 商圈等级

      base_price_n_value: null,  // 基础价_n值
      transport_capacity_reached_x1: {},  // 运力达成_x1
      time_reach_x2: {}, // 时效达成_x2
      worst_ten_percent_x3: {},  // 最差10%达成_X3

      qc: null, // QC
      whole_qc: [], // 整体QC
      single_qc: {}, // 单项qc
      ugc_score: {},  // ugc_评分
      operation_violation: {}, // 违规操作
      user_differential_rate: {},  // 用户差评率
      red_letter_capacity_plan: {},  // 红字运力计划
      attendance_award: {}, // 出勤人数奖励

      _id: '',   // _id
    },
    // kpi模版信息
    templateInfo: {
      biz_district_level: [],  // 商圈等级
      city_list: [],  // 城市列表
    },
    kpiRecord: {   // kpi信息列表
      _meta: {
        has_more: '',
        result_count: 0,
      },
      data: [],
    },
    getKpiUpload: {    // 百度下载kpi模版的路径
      url: '',
      ok: false,
    },
    task_id: '',   // task_id
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;
        // 上传Kpi
        if (pathname === '/Handle/Upload') {
          // 获取上传记录
          dispatch({
            type: 'getUploadRecordE',
            payload: {
              account_id: authorize.account.id,
              platform_code: 'elem',   // 平台饿了么
              template_type: 60071, // kpi日报
              limit: 30,
              page: 1,
            },
          });
        }

        // 获得模版详情
        if (pathname === '/Handle/detailKpi') {
          dispatch({
            type: 'kpiTemplateDetailE',
            payload: {
              account_id: authorize.account.id,
              _id: location.query.id,
            },
          });
        }

        // kpi列表
        if (pathname === '/Handle/kpiTemplateList') {
          dispatch({
            type: 'kpiTemplateListE',
            payload: {      // 获得模版列表
              account_id: authorize.account.id,
              limit: 30,
              page: 1,
            },
          });
          dispatch({
            type: 'kpiTemplateInfoE',
            payload: {
              account_id: authorize.account.id,
            },
          });
        }

        // 新建kpi
        if (pathname === '/Handle/buildKpi') {
          dispatch({
            type: 'kpiTemplateInfoE',
            payload: {
              account_id: authorize.account.id,
            },
          });
        }

        // kpi详情
        if (pathname === '/Handle/editKpi') {
          dispatch({
            type: 'kpiTemplateDetailE',
            payload: {
              account_id: authorize.account.id,
              _id: location.query.id,
            },
          });
          dispatch({
            type: 'kpiTemplateInfoE',
            payload: {
              account_id: authorize.account.id,
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
      yield put({ type: 'getUploadRecordR', payload: result });
    },

    // 获取七牛的token
    *getUploadTokenE({ payload }, { call, put }) {
      const result = yield call(getUploadToken, payload);
      if (result.ok) {
        yield put({ type: 'getUploadTokenR', payload: result.token });
        yield put({ type: 'getUploadPathR', payload: result.path });
        yield put({
          type: 'postFileToQINIUE',
          payload: {
            key: result.path,
            token: result.token,
            file: payload,
          },
        });
      }
    },

    // 上传文件到七牛
    *postFileToQINIUE({ payload }, { call }) {
      // form形式上传文件
      if (payload.token) {
        const formdata = new FormData();
        formdata.append('key', payload.key);
        formdata.append('token', payload.token);
        formdata.append('file', payload.file);
        const result = yield call(postFileToQINIU, formdata);  // 因为是七牛返回的，暂时无法处理，默认成功上传七牛
      }
      // 暂时不能处理七牛返回的正确或则错误信息。
    },

    *uploadFile({ payload }, { call }) {
      const { data } = yield call(postFileToQINIU, payload);
      if (data.key) {
        message.success('文件上传成功');
      }
    },

    // 往后台上传文件
    *postCheckFileDetailE({ payload }, { call, put }) {
      const result = yield call(postCheckFileDetail, payload.payload);
      if (result.ok) {
        message.success('文件已上传，正在审核', 3);
        yield put({
          type: 'getUploadRecordE',
          payload: {
            account_id: authorize.account.id,
            platform_code: payload.search.platform_code,
            template_type: Number(payload.search.template_type),
            limit: 30,
            page: 1,
          },
        });
      } else {
        message.error('上传失败');
      }
    },

    // 创建kpi下载模版
    *createUploadKpiE({ payload }, { call, put }) {
      const result = yield call(createUploadKpi, payload);
      if (result.ok) {
        yield put({ type: 'createUploadKpiR', payload: result.task_id });
      } else {
        message.error('网络忙');
      }
    },

    // 获得kpi下载模版
    *getUploadKpiE({ payload }, { call, put }) {
      const result = yield call(getUploadKpi, payload);
      // 模版下载成功，防止七牛出错
      if (result.state === 60051) {
        yield put({ type: 'getUploadKpiR', payload: result });
      } else {
        message.error('可能是网络原因，导致模版下载失败');
      }
    },

    // 新建kpi模版
    *createKpiTemplateE({ payload }, { call, put }) {
      const result = yield call(createKpiTemplate, payload);
      if (result.ok) {
        message.success('新建kpi模版成功');
      }
    },
    // 编辑kpi模版
    *editKpiTemplateE({ payload }, { call }) {
      const result = yield call(editKpiTemplate, payload);
      if (result.ok) {
        message.success('编辑kpi模版成功');
        window.location.href = '/#/Handle/kpiTemplateList';
      }
    },

    // kpi模版详情
    *kpiTemplateDetailE({ payload }, { call, put }) {
      const result = yield call(kpiTemplateDetail, payload);
      yield put({ type: 'kpiTemplateDetailR', payload: result });
    },

    // kpi模版信息
    *kpiTemplateInfoE({ payload }, { call, put }) {
      const result = yield call(kpiTemplateInfo, payload);
      yield put({ type: 'kpiTemplateInfoR', payload: result });
    },

    // 获得kpi模版列表
    *kpiTemplateListE({ payload }, { call, put }) {
      const result = yield call(kpiTemplateList, payload);
      yield put({ type: 'kpiTemplateListR', payload: result });
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
    // 百度kpi模版下载
    getUploadKpiR(state, action) {
      return {
        ...state,
        getKpiUpload: action.payload,
      };
    },
    // 控制kpi模版是否可下载状态，下载完成后关闭，不然会无限下载
    closeUploadKpiR(state, action) {
      return {
        ...state,
        getKpiUpload: {
          ok: false,
          url: '',
        },
      };
    },
    // -----------------------------------kpi模版----------------------
    // 得到上传kpi列表
    kpiTemplateListR(state, action) {
      return {
        ...state,
        kpiRecord: action.payload,
      };
    },
    // kpi模版详情
    kpiTemplateDetailR(state, action) {
      return {
        ...state,
        templateDetail: action.payload,
      };
    },
    // kpi信息
    kpiTemplateInfoR(state, action) {
      return {
        ...state,
        templateInfo: action.payload,
      };
    },
    // 获取上传文件后的校验数据
    postCheckFileDetailR(state, action) {
      return {
        ...state,
        fileDetail: action.payload,
      };
    },
    // 下载百度运力计划模版相关--------------------------------
    createUploadKpiR(state, action) {
      return {
        ...state,
        task_id: action.payload,
      };
    },
  },
};
