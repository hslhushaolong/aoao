/**
 * Created by jay 2017/9/30
 * 财务模块model层
 * */
import { message } from 'antd';
import aoaoBossTools from './../utils/util';
import {
  submitRentApplyS,
  submitFinanceOrderDetailS,
  getFinanceOrderListS,
  getHouseRentDetailS,
  getFinanceOrderDetailS,
  approveFinanceApplyS,  // coo 同意财务申请
} from './../services/finance';
import { getEmployeeListS } from './../services/employee';
// 文件上传
import {
  getUploadToken,
  postFileToQINIU,
  getQINIUimgUrl,
} from './../services/upload';
import { authorize } from '../application';

export default {

  namespace: 'finance',
  state: {
    // 获取所有的申请单
    financeOrderList: {
      _meta: {
        result_count: 0,
      },
      data: [],
    },
    // 租房财务申请详情
    houseRentDetail: {
      contract_photo_list: [],  // 合同照片url列表
      receipt_photo_list: [],   // 收据照片url列表
    },
    // 其他财务申请详情
    financeOrderDetail: {

    },
    // 申请类型，默认为财务申请类型
    applyType: '200001',
    // 骑士列表
    knightList: {
      data: [],
      _meta: {
        result_count: 0,
      },
    },
    token: '',  // 七牛token
    path: '',  // 七牛文件地址
    field: '',  // 上传的图片类名，是合同图片还是收据图片
    contract_photo_list: [], // 合同照片key值列表
    receipt_photo_list: [],  // 收据照片key值列表
    files_address: [], // 上传的文件的地址
  },

  effects: {
    // 提交租房申请
    *submitRentApplyE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      if (payload.platform_code) {
        delete payload.platform_code;
      }
      // 发送异步请求，拉取数据
      const result = yield call(submitRentApplyS, payload);
      // 如果返回参数表示提交申请成功，这里要执行路由跳转，返回到financeApply页面
      // 发送异步请求，重新获取数据，并进行倒序排序
      if (result.ok) {
        message.success('提交申请成功');
        yield put({
          type: 'getFinanceOrderListE',
          payload: {
            page: 1,
            limit: 30,
            sort: -1,
          },
        });
        location.href = '/#/Finance/FinanceApply';
      }
    },

    // 提交其他报销申请
    *createFinanceOrderDetailE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = account_id;
      if (payload.platform_code) {
        delete payload.platform_code;
      }
      const result = yield call(submitFinanceOrderDetailS, payload);
      // 如果返回参数表示提交申请成功，这里要执行路由跳转，返回到financeApply页面
      if (result.ok) {
        message.success('提交申请成功');
        location.href = '/#/Finance/FinanceApply';
      }
    },

    // 获取所有财务申请单
    *getFinanceOrderListE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = account_id;
      const result = yield call(getFinanceOrderListS, payload);
      if (result && result.data && Array.isArray(result.data)) {
        yield put({
          type: 'getFinanceOrderListR',
          payload: result,
        });
      }
    },

    // 获取租房财务申请详情
    *getHouseRentDetailE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = account_id;
      const result = yield call(getHouseRentDetailS, payload);
      yield put({
        type: 'getHouseRentDetailR',
        payload: result,
      });
    },

    // 获取其他财务申请单详情
    *getFinanceOrderDetailE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = account_id;
      const result = yield call(getFinanceOrderDetailS, payload);
      yield put({
        type: 'getFinanceOrderDetailR',
        payload: result,
      });
    },

    // 获取骑士列表
    *getKnightListE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(getEmployeeListS, payload);
      yield put({
        type: 'getKnightListR',
        payload: result,
      });
    },

    // 上传图片获取骑牛token
    *getUploadTokenE({ payload }, { call, put }) {
      const result = yield call(getUploadToken, payload);
      // 更新相应的图片字段
      yield put({
        type: 'imgFieldR',
        payload,
      });
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

    // 上传图片到七牛
    *postImageToQINIUE({ payload }, { call, put }) {
      // 以form的形式上传
      if (payload.token) {
        const formdata = new FormData();
        formdata.append('key', payload.key);
        formdata.append('token', payload.token);
        formdata.append('file', payload.file);
        // 上传成功后七牛返回的key
        const result = yield call(postFileToQINIU, formdata);
        if (result.key) {
        // 根据key获取相应的文件地址
          const resultUrl = yield call(getQINIUimgUrl, { target_id: payload.key, name: payload.name });
          if (resultUrl.ok) {
            // 通知reducer 更新相应的图片地址
            yield put({
              type: 'updateImageListR',
              payload: {
                name: resultUrl.name,
                url: resultUrl.url,
                key: resultUrl.target_id,
              },
            });
          }
          message.success('上传成功', 1);
        }
      }
    },

    // 上传文件到七牛
    *postFileToQINIUE({ payload }, { call, put }) {
      if (payload.token) {
        const formdata = new FormData();
        formdata.append('key', payload.key);
        formdata.append('token', payload.token);
        formdata.append('file', payload.file);
        // 上传成功后七牛返回的key
        const result = yield call(postFileToQINIU, formdata);
        if (result.key) {
        // 根据key获取相应的文件地址
          const resultUrl = yield call(getQINIUimgUrl, { target_id: payload.key, name: payload.file.name });
          if (resultUrl.ok) {
            // 通知reducer 更新相应的文件地址
            yield put({
              type: 'updateFileListR',
              payload: {
                name: resultUrl.name,
                url: resultUrl.url,
                key: resultUrl.target_id,
              },
            });
          }
          message.success('上传成功');
        }
      }
    },

    // coo 审核通过财务申请
    *approveFinanceApplyE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      const page = payload.page;
      delete payload.page;
      payload.account_id = account_id;
      const result = yield call(approveFinanceApplyS, payload);
      if (result.ok) {
        const tip = payload.state === 20012 ? '同意成功' : '驳回成功';
        message.success(tip, 2);
        location.href = '/#/Finance/FinanceApply';
        yield put({
          type: 'getFinanceOrderListE',
          payload: {
            account_id,
            page,
            limit: 30,
            sort: -1,
          },
        });
      }
    },
  },

  reducers: {
    // 获取七牛的token
    getUploadTokenR(state, action) {
      return {
        ...state,
        token: action.payload,
      };
    },

    // 切换上传文件类型名
    imgFieldR(state, action) {
      return {
        ...state,
        field: action.payload,
      };
    },

    // 七牛key
    getUploadPathR(state, action) {
      return {
        ...state,
        path: action.payload,
      };
    },

    // 修改state中上传的图片地址
    updateImageListR(state, action) {
      // 需要对上传类型进行判断,改变不同图片类型的数组
      const type = state.field;
      const { contract_photo_list, receipt_photo_list } = state;
      const val = {};
      // 将返回的图片名称和地址存放到一个对象中，根据当前上传图片类型判断将该对象存放到对应数组中
      val.name = action.payload.name;
      val.address = action.payload.key;
      if (type == 'contract_photo') {
        return {
          ...state,
          contract_photo_list: [val, ...contract_photo_list],
        };
      } else if (type == 'receipt_photo') {
        return {
          ...state,
          receipt_photo_list: [val, ...receipt_photo_list],
        };
      }
    },

    // 清空图片和文件数组
    emptyImageListR(state) {
      return {
        ...state,
        contract_photo_list: [],
        receipt_photo_list: [],
        files_address: [],
      };
    },

    // 更新上传的文件地址
    updateFileListR(state, action) {
      const { files_address } = state;
      const val = {};
      val.address = action.payload.key;
      val.name = action.payload.name;
      return {
        ...state,
        files_address: [val, ...files_address],
      };
    },

    // 当文件被用户删除时，修改文件地址数组
    updateFilesAddressR(state, action) {
      const { files_address } = action.payload;
      return {
        ...state,
        files_address,
      };
    },

    // 当合同图片被删除，修改合同图片数组
    updateContractPhotoListR(state, action) {
      return {
        ...state,
        contract_photo_list: action.payload.contract_photo_list,
      };
    },

    // 当收据图片被删除，修改收据图片数组
    updateReceiptPhotoListR(state, action) {
      return {
        ...state,
        receipt_photo_list: action.payload.receipt_photo_list,
      };
    },

    // 切换申请类型
    switchApplyTypeR(state, action) {
      return {
        ...state,
        applyType: action.payload,
      };
    },

    // 获取所有财务申请单
    getFinanceOrderListR(state, action) {
      return {
        ...state,
      // 将此注释掉是测试使用，正常使用需要取消注释
        financeOrderList: action.payload,
      };
    },

    // 获取租房详情
    getHouseRentDetailR(state, action) {
      return {
        ...state,
        houseRentDetail: {
          ...action.payload,
        },
      };
    },

    // 获取其他财务申请单详情
    getFinanceOrderDetailR(state, action) {
      return {
        ...state,
        financeOrderDetail: action.payload,
      };
    },

    // 骑士列表
    getKnightListR(state, action) {
      return {
        ...state,
        knightList: action.payload,
      };
    },
  },
};
