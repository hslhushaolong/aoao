/**
 * Employee Model
 * */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { message } from 'antd';
import { getUploadToken, postFileToQINIU, getQINIUimgUrl } from './../services/upload';
import {
editEmployeeS,
getEmployeeDetailS,
AddEmployeeS,
exportEmployeeS,
getEmployeeListS,
getContractBelongS,
getEmployeeHistoryDetailS,
getKnightTypeListS,
gainNoMasterDistrictListS,
gainDeliveryKnight,                     // 获取运力工号骑士
deliveryStop,                           // 运力工号启用停用
deliveryDetail,                         // 替跑详情
deliveryEdit,                           // 编辑替跑记录
deliveryBuild,                          // 新建替跑记录
deliveryFind,                           // 查找替跑骑士
batchUploadingKnightS,
getBankId,                              // 获取银行卡接口
getWaitEntryStaffS,                     // 待入职员工
deleteWaitEntryStaffS,                  // 删除待入职员工
getWaitEntryStaffDetailS,               // 待入职员工详情
addWaitEntryStaffS,                     // 添加待入职员工
getPositionInfoS,                       // 获取可以操作职位列表
} from './../services/employee';
import aoaoBossTools from './../utils/util';
import { getBankName, getBankKind } from '../routes/account/define';
import Modules from '../application/define/modules';
import { Position } from '../application/define';
import { authorize } from '../application';
import { copyNotEmptyProperty } from '../application/utils';

export default {

  namespace: 'employee',
  state: {
    // 员工列表
    employeeList: {
      data: [],
      _meta: {
        result_count: 0,
      },
    },
    // 员工详情
    employeeDetail: {
      name: 'zhangsan',  // 姓名
      education: '',  // 学历
      phone: '',  // 手机号
      gender_id: '',  // id
      national: '',  // 户籍
      emergency_contact_phone: '',  // 紧急联系人
      identity_card_id: '',  // 身份证
      associated_identity_card_id: '',  // 关联身份证
      identity_card_front: '',  // 身份证正面照
      identity_card_back: '',  // 反面照
      bank_card_id: '',  // 银行卡号
      bank_branch: '',  // 开户行
      bank_card_front: '',  // 银行卡证明照
      bust: '',  // 半身照
      health_certificate: '',  // 健康证
      platform_list: [],  // 平台
      biz_district_list: [],  // 商圈
      city_list: [],  // 城市
      state: '',  // 状态
      position_id: '', // 职位
      job_category_id: '',  // 工作类型
      recruitment_channel_id: '',  // 招聘渠道
      entry_date: '',  // 入职日期
      contract_belong_id: '',  // 合同归属
      contract_photo_key_list: [], // 合同地址列表
      contract_photo_list: [],  // 合同key列表
      emergency_contact: '', // 紧急联系人
      cardholder_name: '', // 持卡人姓名
    },    // 员工详情
    token: '',    	       // 七牛token
    path: '',    		       // 七牛文件地址
    loading: false,        // 动画开关
    field: '',             // 对应图片字段
    download_url: '',      // 导出文件地址
    // 离职详情
    leaveDetail: {
      name: 'xiaoming',  // 姓名
      phone: '11111',  // 手机号
      platform_list: [],  // 平台
      city_list: [],  // 城市
      biz_district_list: [],  // 商圈
      job_category_id: 'www',  // 工作类型
      position_id: '',  // 职位id
      state: 500, // 状态
      _id: 'aaaaa',
    },       // 离职详情
    ModalFlag: false,      // 离职Modal 显示开关
    imgKeyList: {          // 员工图片详情
      identity_card_front: '',  // 身份证正面照
      health_certificate: '',  // 健康证
      health_certificate_next: '',  // 健康证
      bust: '',  // 半身照
      bank_card_front: '',  // 银行卡正面照
      identity_card_back: '',  // 身份证背面
    },
    // 平台列表
    platformList: {
      platform: [],  // 平台
      cityList: [],  // 城市
      areaList: [],  // 商圈
    },
    // 合同归属
    contractBelong: {
      _meta: {},
      data: [],
    },
    // 历史工作信息
    employeeHistoryDetail: {
      _meta: {},
      data: [],
    },
    knightTypeList: {  // 骑士类型
      _meta: {},
      data: [],
    },
    noMasterDistrictList: { // 未被站长选择的商圈
      result: [],
    },

    gainDeliveryKnightList: { // 获取运力工号骑士列表
      _meta: {
        has_more: false,
        result_count: 0,
      },
      data: [],
    },
    deliveryDetailList: { // 获取替跑详情
      meta: {
        has_more: false,
        result_count: 0,
      },
      result: [],
      date_list: [],
    },
    deliveryFindList: {  // 查找替跑骑士
      result: [],
    },
    title_error: false, // 批量上传表头是否错误
    uploadKnightErrList: [],  // 错误信息列表
    detailErr: false,  // 错误详情弹窗
    getDeliveryCity: {   // 记录运力工号的平台和城市
      city_spelling: '',
      platform_code: '',
      city_name: '',
      platform_name: '',
    },
    whichBank: {},  // 记录银行信息
    waitEntryStaffList: {}, // 待入职员工列表信息
    waitEntryStaffDetail: {}, // 待入职员工详情信息
    positionInfoList: [], // 职位列表信息
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // 默认查询可编辑的职位信息
        const { pathname } = location;
        if (pathname.indexOf('/Employee/') > -1 || pathname.indexOf('/System/User') > -1 || pathname.indexOf('/Expense/Manage/Summary/Detail') > -1) {
          let permissionId = '';
          switch (pathname) {
            case '/Employee/Add':
              permissionId = Modules.ModuleEmployeeCreate.id;
              break;
            case '/System/User':
              permissionId = Modules.ModuleSystemUser.id;
              break;
            default:
          }
          const param = permissionId === '' ? {} : { permission_id: permissionId };
          dispatch({
            type: 'getPositionInfoE',
            payload: param,
          });
        }
        // 查询员工详情
        if (pathname === '/Employee/Edit') {
          dispatch({
            type: 'getEmployeeDetailE',
            payload: {
              staff_id: location.query.id,
              permission_id: Modules.ModuleEmployeeUpdate.id,
            },
          });
        }
        // 获取员工详情
        if (pathname === '/Employee/Detail') {
          dispatch({
            type: 'getEmployeeDetailE',
            payload: {
              staff_id: location.query.id,
              permission_id: Modules.ModuleEmployeeDetail.id,
            },
          });
        }
        // 查询员工列表
        if (pathname === '/Employee/Search') {
          dispatch({
            type: 'getEmployeeListE',
            payload: {
              permission_id: Modules.ModuleEmployeeSearch.id,
              limit: 30,
              page: 1,
              state: 50,
            },
          });
          // 获取骑士类型
          dispatch({
            type: 'getKnightTypeListE',
            payload: {
              permission_id: Modules.ModuleEmployeeSearch.id,
              page: 1,
              limit: 30,
              state: 60,
            },
          });
        }
        // 查询离职员工列表
        if (pathname === '/Employee/LeaveFlow') {
          const departureApproverAccountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
          dispatch({
            type: 'getEmployeeListE',
            payload: {
              permission_id: Modules.ModuleEmployeeSearch.id,
              limit: 30,
              page: 1,
              state: 1,
              departure_approver_account_id: departureApproverAccountId,
            },
          });
          // 获取骑士类型
          dispatch({
            type: 'getKnightTypeListE',
            payload: {
              permission_id: Modules.ModuleEmployeeResign.id,
              page: 1,
              limit: 30,
              state: 60,
            },
          });
        }
        // 获取运力工号列表
        if (pathname === '/Employee/Delivery') {
          const departureApproverAccountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
          dispatch({
            type: 'gainDeliveryKnightE',
            payload: {
              limit: 30,
              page: 1,
              transport_type_list: [50010],
              account_id: departureApproverAccountId,
            },
          });
        }
        // 获取替跑列表
        if (pathname === '/Employee/Delivery/Edit') {
          dispatch({
            type: 'deliveryDetailE',
            payload: {
              account_id: aoaoBossTools.readDataFromLocal(1, 'account_id'),
              transport_staff_id: window.location.hash.split('=')[1],
              is_modify: 1,
            },
          });
        }
        // 获取替跑账号详情
        if (pathname === '/Employee/Delivery/Detail') {
          dispatch({
            type: 'deliveryDetailE',
            payload: {
              account_id: aoaoBossTools.readDataFromLocal(1, 'account_id'),
              transport_staff_id: window.location.hash.split('=')[1],
              page: 1,
              limit: 30,
            },
          });
        }
        // 获取待入职员工列表
        if (pathname === '/Employee/TodayEntry') {
          dispatch({
            type: 'getWaitEntryStaffE',
            payload: {
              page: 1,
              limit: 30,
              // sort: -1,
            },
          });
        }
        // 获取待入职员工详情和历史工作信息
        if (pathname === '/Employee/TodayEntry/Edit') {
          dispatch({
            type: 'getWaitEntryStaffDetailE',
            payload: {
              _id: location.query.id,
            },
          });
        }
      });
    },
  },

  effects: {
    // 获取七牛的token
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
    // 上传文件到七牛
    *postFileToQINIUE({ payload }, { call, put }) {
      // form形式上传文件
      if (payload.token) {
        const formdata = new FormData();
        formdata.append('key', payload.key);
        formdata.append('token', payload.token);
        formdata.append('file', payload.file);
        // 上传成功后七牛返回的key
        const result = yield call(postFileToQINIU, formdata);
        if (result.key) {
          // 根据七牛的key去获取相应文件的地址
          const resultUrl = yield call(getQINIUimgUrl, { target_id: payload.key, name: payload.field });
          if (resultUrl.ok) {
            // 通知reducer 更新相应的图片地址
            yield put({
              type: 'getEmployeeDetailImgR',
              payload: {
                name: resultUrl.name,
                url: resultUrl.url,
                key: resultUrl.target_id,
              },
            });
          }
          yield put({
            type: 'getUploadLoadingR',
            payload: false,
          });
          message.success('上传成功');
        }
      }
    },
    // 获取员工列表
    *getEmployeeListE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = account_id;
      // 名字，为空则不传递参数
      if (payload.name === '') {
        delete payload.name;
      }
      // 手机，为空则不传递参数
      if (payload.phone === '') {
        delete payload.phone;
      }
      const biz_district_id_list = payload.biz_district_id_list && payload.biz_district_id_list;  // 存储商圈列表
      const value = payload;
      payload = aoaoBossTools.ItemOfArrayToNubmer(value);   // 转换参数数据格式
      payload.biz_district_id_list = biz_district_id_list;  // 商圈列表参数为string,需提前存储
      const result = yield call(getEmployeeListS, copyNotEmptyProperty(payload));
      yield put({
        type: 'getEmployeeListR',
        payload: result,
      });
    },
    // 获取员工离职待审核列表
    *getEmployeeLeaveListE({ payload }, { call, put }) {
      const leaveId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.departure_approver_account_id = leaveId;
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const biz_district_id_list = payload.biz_district_id_list && payload.biz_district_id_list;  // 存储商圈列表
      const value = payload;
      payload = aoaoBossTools.ItemOfArrayToNubmer(value);   // 转换参数数据格式
      payload.biz_district_id_list = biz_district_id_list;  // 商圈列表参数为string,需提前存储
      const result = yield call(getEmployeeListS, payload);
      yield put({
        type: 'getEmployeeListR',
        payload: result,
      });
    },
    // 编辑员工
    *employeeEditE({ payload }, { call, put }) {
      // const supplier_id = aoaoBossTools.readDataFromLocal(1, 'supplier_id');
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      if (payload.entry_date) {
        payload.entry_date = aoaoBossTools.prctoMinute(payload.entry_date, 4);
      }
      // payload.supplier_id = supplier_id;
      const result = yield call(editEmployeeS, payload);
      if (result.ok) {
        message.success('操作成功');
        // option 为true为编辑操作，false为离职审批操作，挑战页面不同
        location.href = result.option ? '/#/Employee/Search' : '/#/Employee/LeaveFlow';
        if (!result.option) {  // 离职审批情况
          yield put({
            type: 'getEmployeeListE',
            payload: {
              permission_id: Modules.ModuleEmployeeSearch.id,
              departure_approver_account_id: account_id,
              limit: 30,
              page: 1,
              state: 1,
            },
          });
        } else { // 离职员工情况
          yield put({
            type: 'getEmployeeListE',
            payload: {
              permission_id: Modules.ModuleEmployeeSearch.id,
              limit: 30,
              page: 1,
              state: 50,
            },
          });
        }
      }
    },
    // 获取员工详情
    *getEmployeeDetailE({ payload }, { call, put }) {
      const result = yield call(getEmployeeDetailS, payload);
      yield put({
        type: 'getEmployeeDetailR',
        payload: result,
      });
      yield put({
        type: 'initImgKeyListR',
        payload: result,
      });
    },
    // 获取员工历史工作记录
    *getEmployeeHistoryDetailE({ payload }, { call, put }) {
      const result = yield call(getEmployeeHistoryDetailS, payload);
      yield put({
        type: 'getEmployeeHistoryDetailR',
        payload: result,
      });
    },
    // 添加员工
    *employeeAddE({ payload }, { call, put }) {
      const supplier_id = aoaoBossTools.readDataFromLocal(1, 'supplier_id');
      payload.supplier_id = supplier_id;
      payload.entry_date = dot.get(payload, 'entry_date', moment()).format('YYYY-MM-DD');
      const result = yield call(AddEmployeeS, payload);
      if (result.ok) {
        message.success('添加成功');
        location.href = '/#/Employee/Search';
      }
    },
    // 导出员工
    *exportEmployeeE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = account_id;
      const result = yield call(exportEmployeeS, copyNotEmptyProperty(payload));
      if (result && is.existy(result.task_id)) {
        message.success(`创建下载任务成功，任务id：${result.task_id}`);
      } else {
        message.error(result.message);
      }
    },
    // 合同归属列表
    *getContractBelongE({ payload }, { call, put }) {
      const supplier_id = aoaoBossTools.readDataFromLocal(1, 'supplier_id');
      if (supplier_id !== '') {
        payload.supplier_id = supplier_id;
        const result = yield call(getContractBelongS, payload);
        // 更新合同归属列表
        yield put({
          type: 'getContractBelongR',
          payload: result,
        });
      } else {
        console.warn('当前账号供应商缺失');
      }

    },
    // 合同归属列表
    *getContractBelongForNewEntryE({ payload }, { call, put }) {
      const result = yield call(getContractBelongS, payload);
      // 更新合同归属列表
      yield put({
        type: 'getContractBelongR',
        payload: result,
      });
    },
    // 获取骑士列表
    *getKnightTypeListE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      // payload.permission_id = Modules.ModuleEmployeeUpdate.id;
      const result = yield call(getKnightTypeListS, payload);
      if (result && Array.isArray(result.data)) {
        yield put({
          type: 'getKnightTypeListR',
          payload: result,
        });
      }
    },
    // 获取没有被选择站长的商圈
    *gainNoMasterDistrictListE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = account_id;
      const result = yield call(gainNoMasterDistrictListS, payload);
      if (result && Array.isArray(result.result)) {
        yield put({
          type: 'gainNoMasterDistrictListR',
          payload: result,
        });
      }
    },

    // 获取运力工号骑士列表
    *gainDeliveryKnightE({ payload }, { call, put }) {
      const result = yield call(gainDeliveryKnight, payload);
      yield put({
        type: 'gainDeliveryKnightR',
        payload: result,
      });
    },
    // 运力工号启用停用
    *deliveryStopE({ payload }, { call, put }) {
      const result = yield call(deliveryStop, payload);
      if (result.ok) {
        const departureApproverAccountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
        yield put({
          type: 'gainDeliveryKnightE',
          payload: {
            limit: 30,
            page: 1,
            transport_type_list: [50010],
            account_id: departureApproverAccountId,
          },
        });
      }
    },
    // 获取替跑工号详情
    *deliveryDetailE({ payload }, { call, put }) {
      const result = yield call(deliveryDetail, payload);
      if (result == undefined) return;
      yield put({
        type: 'deliveryDetailR',
        payload: result,
      });
    },
    // 编辑替跑记录
    *deliveryEditE({ payload }, { call, put }) {
      const result = yield call(deliveryEdit, payload);
      if (result.ok) {
        yield put({
          type: 'deliveryDetailE',
          payload: {
            account_id: aoaoBossTools.readDataFromLocal(1, 'account_id'),
            transport_staff_id: window.location.hash.split('=')[1],
            is_modify: 1,
          },
        });
      }
    },
    // 新建替跑记录
    *deliveryBuildE({ payload }, { call, put }) {
      const result = yield call(deliveryBuild, payload);
      if (result.ok) {
        yield put({
          type: 'deliveryDetailE',
          payload: {
            account_id: aoaoBossTools.readDataFromLocal(1, 'account_id'),
            transport_staff_id: window.location.hash.split('=')[1],
            is_modify: 1,
          },
        });
      }
    },

    // 查找骑士
    *deliveryFindE({ payload }, { call, put }) {
      const result = yield call(deliveryFind, payload);
      if (result == undefined) {
        return;
      }
      yield put({
        type: 'deliveryFindR',
        payload: result,
      });
    },
    // 跳编辑页
    *deliveryGoEditE({ payload }, { call, put }) {
      yield put({
        type: 'deliveryDetailE',
        payload: {
          account_id: aoaoBossTools.readDataFromLocal(1, 'account_id'),
          transport_staff_id: payload,
          is_modify: 1,
        },
      });
      window.location.href = `/#/Employee/Delivery/Edit?id=${payload}`;
    },
    // 跳详情页
    *deliveryGoDetailE({ payload }, { call, put }) {
      yield put({
        type: 'deliveryDetailE',
        payload: {
          account_id: aoaoBossTools.readDataFromLocal(1, 'account_id'),
          transport_staff_id: payload,
          page: 1,
          limit: 30,
        },
      });
      window.location.href = `/#/Employee/Delivery/Detail?id=${payload}`;
    },
    // 禁用／启用
    *deliveryGoStopE({ payload }, { call, put }) {
      yield put({
        type: 'deliveryStopE',
        payload: {
          account_id: aoaoBossTools.readDataFromLocal(1, 'account_id'),
          staff_id: payload,
        },
      });
    },
    // 获得银行
    *getBankE({ payload }, { call, put }) {
      const result = yield call(getBankId, payload);
      if (result == undefined) {
        return;
      }
      if (result.validated === false) {
        message.warning('无法识别开户行');
        // return;
      }
      yield put({
        type: 'getBankR',
        payload: result,
      });
    },
    // 批量上传骑士
    *batchUploadingKnightE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = account_id;
      const result = yield call(batchUploadingKnightS, payload);
      if (result.title_error) {  // 表头错误, 等级最高
        yield put({
          type: 'batchUploadTitleErrorR',
          payload: {
            title_error: result.title_error,
          },
        });
        return;
      }
      if (result.error_list && Array.isArray(result.error_list) && result.error_list.length > 0) { // 信息错误
        yield put({
          type: 'uploadKnightErrListR',
          payload: {
            uploadKnightErrList: result.error_list,
          },
        });
        yield put({
          type: 'changeKnightErrListStateR',
          payload: {
            detailErr: true,
          },
        });
      }
      if (result.ok) {
        message.success('上传成功', 1);
        window.location.href = '/#/Employee/Search';
      }
    },
    // 获取待入职员工列表
    *getWaitEntryStaffE({ payload }, { call, put }) {
      const { params = {}, page, limit } = payload;
      const searchParam = {
        limit,
        page,
        supplier_id_list: params.supplier,
        platform_code_list: params.platform,
        city_spelling_list: params.city,
        biz_district_list: params.district,
        name: params.knightName,
        identity_card_id: params.idNumber,
        phone: params.phone,
      };
      const result = yield call(getWaitEntryStaffS, copyNotEmptyProperty(searchParam));
      yield put({
        type: 'getWaitEntryStaffR',
        payload: result,
      });
    },
    // 删除待入职员工
    *deleteWaitEntryStaffE({ payload }, { call, put }) {
      const params = {
        _id: payload.id,
        state: payload.state,
      };
      const result = yield call(deleteWaitEntryStaffS, params);
      if (result.ok) {
        message.success('删除成功', 1);
        // 重新拼装搜索参数
        yield put({
          type: 'getWaitEntryStaffE',
          payload: payload.params,
        });
      } else {
        message.error('删除失败', 1);
      }
    },
    // 获取待入职员工详情
    *getWaitEntryStaffDetailE({ payload }, { call, put }) {
      const result = yield call(getWaitEntryStaffDetailS, payload);
      yield put({
        type: 'getWaitEntryStaffDetailR',
        payload: result,
      });
      // 如果有身份证号，则自动查询工作历史记录
      if (result.identity_card_id) {
        yield put({
          type: 'getEmployeeHistoryDetailE',
          payload: {
            identity_card_id: result.identity_card_id,
            limit: 50,
            page: 1,
            sort: -1,
          },
        });
      }
      // 获取骑士类型
      yield put({
        type: 'getKnightTypeListE',
        payload: {
          permission_id: Modules.ModuleEmployeeCreate.id,
          page: 1,
          limit: 30,
          state: 60,  // 查询启用
        },
      });
      // 如果有供应商，查询
      // 添加员工,获取合同归属列表(除超管外都可见)
      if (result.supplier_list) {
        yield put({
          type: 'getContractBelongForNewEntryE',
          payload: {
            permission_id: Modules.ModuleEmployeeCreate.id,
            page: 1,
            limit: 30,
            state: 60, // 查询启用
            supplier_id: result.supplier_list[0],
          },
        });
      }
    },
    // 添加待入职员工
    *addWaitEntryStaffE({ payload }, { call }) {
      const result = yield call(addWaitEntryStaffS, payload);
      if (result.ok) {
        message.success('添加成功', 1);
        window.location.hash = '/Employee/TodayEntry'
      } else {
        message.error('添加失败，请尝试重新添加', 1);
      }
    },
    // 添加待入职员工
    *getPositionInfoE({ payload }, { call, put }) {
      const result = yield call(getPositionInfoS, payload);
      if (result) {
        yield put({
          type: 'getPositionInfoR',
          payload: result.result,
        });
      } else {
        message.error('获取职位信息失败', 1);
      }
    },

  },

  reducers: {
    // 合同归属列表
    getContractBelongR(state, action) {
      return {
        ...state,
        contractBelong: action.payload,
      };
    },

    // 获取七牛的token
    getUploadTokenR(state, action) {
      return {
        ...state,
        token: action.payload,
      };
    },
    // 员工详情中的图片
    getEmployeeDetailImgR(state, action) {
      const { employeeDetail, imgKeyList } = state;
      employeeDetail[action.payload.name] = action.payload.url; // 将上传图片实时显示出来
      imgKeyList[action.payload.name] = action.payload.key;
      return {
        ...state,
        employeeDetail,
        imgKeyList,
      };
    },
    // 员工详情
    getEmployeeDetailR(state, action) {
      return {
        ...state,
        employeeDetail: action.payload,
      };
    },
    // 获取员工历史信息
    getEmployeeHistoryDetailR(state, action) {
      return {
        ...state,
        employeeHistoryDetail: action.payload,
      };
    },
    // 七牛key
    getUploadPathR(state, action) {
      return {
        ...state,
        path: action.payload,
      };
    },
    // 上传动画开关
    getUploadLoadingR(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    // 相关照片字段
    imgFieldR(state, action) {
      return {
        ...state,
        field: action.payload,
      };
    },
    // 员工列表
    getEmployeeListR(state, action) {
      return {
        ...state,
        employeeList: action.payload,
      };
    },
    // 导出员工列表
    exportEmployeeR(state, action) {
      return {
        ...state,
        download_url: action.payload,
      };
    },
    // 员工离职详情
    getEmployeeLeaveDetailR(state, action) {
      return {
        ...state,
        leaveDetail: action.payload,
      };
    },
    // 员工详情模板显示开关
    ModalFlagR(state, action) {
      return {
        ...state,
        ModalFlag: action.payload,
      };
    },
    // 员工详情级联数据
    platformListR(state, action) {
      const platform = aoaoBossTools.readDataFromLocal(1, 'region'); // 平台数据
      const platFormCode = aoaoBossTools.getArrayFormObject(platform, 'platform_code');  // 平台id列表
      const cityList = aoaoBossTools.getArrayFromIndex(platform, platFormCode, 'city_name_joint'); // 城市数据
      const cityIdList = aoaoBossTools.getArrayFormObject(cityList, 'city_spelling');  // 城市id列表
      const areaList = aoaoBossTools.getArrayItemIndex(cityList, cityIdList, 'city_spelling'); //  城市下所对应的商圈
      const areaData = aoaoBossTools.getAreaListFromCityList(areaList, cityList); // 商圈信息
      return {
        ...state,
        platformList: {
          platform,
          cityList,
          areaList: areaData,
        },
      };
    },
    // 清空员工历史工作信息
    removeEmployeeHistoryDetailR(state) {
      return {
        ...state,
        employeeHistoryDetail: {
          _meta: {},
          data: [],
        },
      };
    },
    // 初始员工信息, 对于accout模块
    initDataListR(state, action) {
      return {
        ...state,
        employeeDetail: action.payload,
        imgKeyList: {
          identity_card_front: action.payload.identity_card_front_key,
          health_certificate: action.payload.health_certificate_key,
          health_certificate_next: action.payload.health_certificate_next_key,
          bust: action.payload.bust_key,
          bank_card_front: action.payload.bank_card_front_key,
          identity_card_back: action.payload.identity_card_back_key,
        },
      };
    },
    // 初始员工信息证件照，对于account模块
    initImgKeyListR(state, action) {
      return {
        ...state,
        imgKeyList: {
          identity_card_front: action.payload.identity_card_front_key,
          health_certificate: action.payload.health_certificate_key,
          health_certificate_next: action.payload.health_certificate_next_key,
          bust: action.payload.bust_key,
          bank_card_front: action.payload.bank_card_front_key,
          identity_card_back: action.payload.identity_card_back_key,
        },
      };
    },
    // 获取骑士列表
    getKnightTypeListR(state, action) {
      return {
        ...state,
        knightTypeList: action.payload,
      };
    },
    // 编辑合同信息
    editContractPhotoR(state, action) {
      return {
        ...state,
        employeeDetail: {
          ...state.employeeDetail,
          contract_photo_key_list: action.payload.contract_photo_key_list, // 合同地址列表
          contract_photo_list: action.payload.contract_photo_list,  // 合同key列表
        },
      };
    },
    // 添加站长，获取平台、城市、商圈
    gainNoMasterDistrictListR(state, action) {
      return {
        ...state,
        noMasterDistrictList: action.payload,
      };
    },
    // // 清空详情
    // emptyDataListR(state) {
    //   return {
    //     ...state,
    //     employeeDetail: {},
    //   };
    // },

    // 获取运力工号骑士列表
    gainDeliveryKnightR(state, action) {
      return {
        ...state,
        gainDeliveryKnightList: action.payload,
      };
    },
    // 获取运力工号骑士列表
    deliveryDetailR(state, action) {
      return {
        ...state,
        deliveryDetailList: action.payload,
      };
    },
    // 查询替跑骑士
    deliveryFindR(state, action) {
      return {
        ...state,
        deliveryFindList: action.payload,
      };
    },
    // 批量上传表头错误
    batchUploadTitleErrorR(state, action) {
      return {
        ...state,
        title_error: action.payload.title_error,
      };
    },
    // 批量上传错误信息列表
    uploadKnightErrListR(state, action) {
      return {
        ...state,
        uploadKnightErrList: action.payload.uploadKnightErrList,
      };
    },
    // 改变其实上传的错误信息
    changeKnightErrListStateR(state, action) {
      return {
        ...state,
        detailErr: action.payload.detailErr,
      };
    },
    // 清除替跑骑士选项
    deliveryDeFindR(state, action) {
      return {
        ...state,
        deliveryFindList: { result: [] },
      };
    },
    // 获取运力工号平台城市
    getDeliveryCityR(state, action) {
      return {
        ...state,
        getDeliveryCity: action.payload,
      };
    },
    // 获取银行信息
    getBankR(state, action) {
      return {
        ...state,
        whichBank: action.payload,
      };
    },
    // 获取待入职员工列表
    getWaitEntryStaffR(state, action) {
      return {
        ...state,
        waitEntryStaffList: action.payload,
      };
    },
    // 获取待入职员工详情
    getWaitEntryStaffDetailR(state, action) {
      return {
        ...state,
        waitEntryStaffDetail: action.payload,
      };
    },
    getPositionInfoR(state, action) {
      return {
        ...state,
        positionInfoList: action.payload,
      };
    },
  },
};
