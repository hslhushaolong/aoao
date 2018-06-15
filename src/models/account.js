/**
 * Created by jay 2017/11/28
 * 我的账户
 *
 * */

import { message } from 'antd';
import { getEmployeeDetailS, editEmployeeS } from './../services/employee';
import { getAccountList } from './../services/system';

export default {
  namespace: 'account',
  state: {
    employeeDetail: {  // 员工详情
      name: '',  // 姓名
      education: '',  // 学历
      phone: '',  // 电话
      gender_id: '',  // id
      national: '',  // 民族
      emergency_contact_phone: '',  // 紧急联系人
      identity_card_id: '',  // 身份证号
      associated_identity_card_id: '',  // 关联身份证号
      identity_card_front: '',  // 身份证正面照
      identity_card_back: '',  // 身份证反面照
      bank_card_id: '',  // 银行卡号
      bank_branch: '',  // 开户行
      bank_card_front: '',  // 银行卡正面照
      bust: '',  // 半身照
      created_at: '', // 操作时间
      updated_at: '', // 最新修改时间
      operator_name: '', // 最新操作人
      health_certificate: '',  // 健康证
      platform_list: [],  // 平台
      biz_district_list: [],  // 商圈
      city_list: [],  // 城市
      state: '',  // 状态
      position_id: '',  // 职位
      job_category_id: '',  // 工作类型
      recruitment_channel_id: '',  // 招聘渠道
      entry_date: '',  // 入职日期
      contract_belong_id: '',  // 合同归属
      contract_photo_list: [], // 合同照
    },
    editCertificate: false, // 是否为编辑状态
  },
  subscriptions: {

  },
  effects: {
    // 通过staffId获取员工详情
    *getAccountDetailByStaffIdE({ payload }, { call, put }) {
      const result = yield call(getEmployeeDetailS, payload);
      if (result) {
        yield put({
          type: 'getEmployeeDetailR',
          payload: result,
        });
      }
    },

    // 通过accountId获取员工详情
    *getAccountDetailByRoleIdE({ payload }, { call, put }) {
      const account = yield call(getAccountList, payload);
      if (Array.isArray(account.data) && account.data.length > 0) {
        const result = account.data[0];
        yield put({
          type: 'getEmployeeDetailR',
          payload: result,
        });
      }
    },

    // 编辑员工
    *employeeEditE({ payload }, { call, put }) {
      const result = yield call(editEmployeeS, payload);
      if (result.ok) {
        message.success('操作成功');
        yield put({
          type: 'changeEditStateR',
          payload: false,
        });
      }
    },
  },
  reducers: {
    // 获取员工详情
    getEmployeeDetailR(state, action) {
      return {
        ...state,
        employeeDetail: action.payload,
      };
    },
    // 修改编辑状态
    changeEditStateR(state, action) {
      return {
        ...state,
        editCertificate: action.payload,
      };
    },
  },
};
