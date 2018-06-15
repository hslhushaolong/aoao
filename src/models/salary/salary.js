/**
 * salary Model
 * */
import is from 'is_js';
import dot from 'dot-prop';
import _ from 'lodash';
import { message } from 'antd';
import { SalaryFormula, SalarySummaryState, SalaryVerifyState, SalarySummaryFlag, SalaryPaymentState, KnightSalaryType, CutEventType, FillingEventType, PersonalCutEventType, Position } from '../../application/define';
import { authorize } from '../../application/';
import { getEmployeeListS } from './../../services/employee';

import {
  fetchSalarySummary,
  updateSalarySummaryState,
  createSalaryRecordsDownloadTask,
  fetchSalarySummaryNotice,
  disableSalarySummaryNotice,
  fetchSalaryRecords,
  fetchSalaryRecordDetail,
  updateSalaryRecordState,
  downloadSalaryRecords,
  fetchSalaryRecordsInfo,
  getFillingMoneyListS,
  approveOfKnightSalaryS,
  getFillingMoneyDetailS,
  getFillingMoneyDetailRemove,
  getFillingMoneyDetailWithdraw,
  getFillingMoneyDetailSumbit,
  createMoneyOrderOfKnightS,
  createSalaryModelS,
  updateSalaryModelS,
  requestVerifySetupS,
  fetchSalarySetupListS,
  fetchSalaryModelDetailS,
  downloadStaffListS,
  removeOrderList,
  updateSalaryRecordExamine,
  knightCharge, // 骑士扣款（汇总审核）
  getPositionInfoS,
  getEnableBizS, // 可编辑商圈
} from './../../services/salary';
import { getSalarySpecifications } from './../../services/system';  // 获取薪资指标模板
import Modules from '../../application/define/modules';

export default {

  namespace: 'salaryModel',
  state: {
    // 创建的薪资模版
    createSalaryModel: {},

    // 薪资汇总列表
    salarySummary: { _meta: { result_count: 0 }, data: [] },

    // 是否显示薪资的提示
    isShowSalarySummaryNotice: false,

    // 是否显示账户异常的信息
    isShowSalarySummaryExceptionMessage: false,

    // 薪资记录查询列表
    salaryRecords: { _meta: { result_count: 0 }, data: [] },

    // 薪资记录查询汇总信息
    salaryRecordsInfo: {},

    // 薪资记录查询下载文件的链接
    salaryRecordsDownloadURL: '',

    // 薪资明细store
    salaryDetail: {},

    // 更新或创建薪资设置成功
    isUpsertSalarySuccess: false,
    isSalarySuccess: false,
    // 扣款列表
    fillingMoneyList: { _meta: { result_count: 0 }, data: [] },

    // 扣补款详情
    knightFillingMessage: { fund_list: [] },

    // 薪资设置列表
    salarySetupList: { _meta: { result_count: 0 }, data: [] },

    // 薪资设置详情
    salarySetupDetail: {},
    // 解析excel数据
    excelData: [],
    deductionDataSource: [],        // 骑士补款要展示的数据
    deductionSubmitDataSource: [],  // 骑士补款要提交的数据
    deductionEditDataSource: [],    // 补款的编辑
    editIndex: 0,        // 编辑的下标
    errorList: [],       // 创建骑士扣补款存在的错误
    detailErr: false,    // 错误提示弹出
    manualDataSource: [{ // 手动输入的列表值
      platform: [],      // 平台
      city: [],          // 城市
      district: [],      // 商圈
      knight: [],        // 骑士姓名
      selectKnight: [],  // 选择的骑士
      deductEvent: [],   // 扣款项目
      deductAmount: '',  // 扣款金额
      deductReason: '',  // 原因
      date: '',          // 扣补款日期
    }],
    parentId: '',
    knightChargeSource: null,
    knights: [],
    specifications: null,  // 骑士指标库
    positionList: [],     // 职位list
    areaList: [],         // 可新建薪资模板商圈
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;
        // 默认获取当前账户的第一条平台数据
        let platform;
        if (dot.has(authorize.platform(), '0.id')) {
          platform = dot.get(authorize.platform(), '0.id');
        }

        switch (pathname) {
          // 补扣单详情路由订阅

          // 骑士补款详情页
          case '/Salary/Manage/Knight/Supplement/Verify/Detail':
            dispatch({ type: 'getFillingMoneyDetailE', payload: { detail_list: location.query.detail_list, fund_id: KnightSalaryType.fillingMoney, id: location.query.id, submitState: location.query.submitState, sort: -1 } });
            break;

          // 骑士扣款详情页
          case '/Salary/Manage/Knight/Deduct/Verify/Detail':
            dispatch({ type: 'getFillingMoneyDetailE', payload: { detail_list: location.query.detail_list, fund_id: KnightSalaryType.deduction, id: location.query.id, submitState: location.query.submitState, sort: -1 } });
            break;

          // 人事扣款详情页
          case '/Salary/Manage/HumanResources/Deduct/Verify/Detail':
            dispatch({ type: 'getFillingMoneyDetailE', payload: { detail_list: location.query.detail_list, fund_id: KnightSalaryType.personnalDeduct, id: location.query.id, submitState: location.query.submitState, sort: -1 } });
            break;

          // 骑士补款审核，详情
          case '/Salary/Manage/Knight/Supplement/Detail':
            dispatch({ type: 'getFillingMoneyDetailE', payload: { detail_list: location.query.detail_list, fund_id: KnightSalaryType.fillingMoney, id: location.query.id, sort: -1 } });
            break;

          // 骑士扣款审核，详情
          case '/Salary/Manage/Knight/Deduct/Detail':
            dispatch({ type: 'getFillingMoneyDetailE', payload: { detail_list: location.query.detail_list, fund_id: KnightSalaryType.deduction, id: location.query.id, sort: -1 } });
            break;

          // 人事扣款审核，详情
          case '/Salary/Manage/HumanResources/Deduct/Detail':
            dispatch({ type: 'getFillingMoneyDetailE', payload: { detail_list: location.query.detail_list, fund_id: KnightSalaryType.personnalDeduct, id: location.query.id, sort: -1 } });
            break;

          // 骑士扣款列表
          case '/Salary/Manage/Knight/Deduct':
            dispatch({ type: 'getFillingMoneyListE', payload: { page: 1, limit: 30, fund_id: KnightSalaryType.deduction, sort: -1, platform_code: platform, permission_id: Modules.ModuleSalaryManageKnightDeduct.id } });
            // 清除上传的表格数据
            dispatch({ type: 'clearUploadedExcelDataR' });
            break;

          // 骑士补款列表
          case '/Salary/Manage/Knight/Supplement':
            dispatch({ type: 'getFillingMoneyListE', payload: { page: 1, limit: 30, fund_id: KnightSalaryType.fillingMoney, sort: -1, platform_code: platform, permission_id: Modules.ModuleSalaryManageKnightSupplement.id } });
            dispatch({ type: 'clearUploadedExcelDataR' });
            break;

          // 薪资发放
          case '/Salary/Distribute':
            {
              // 默认获取当前账户的第一条平台数据
              if (dot.has(authorize.platform(), '0.id')) {
                const platform = dot.get(authorize.platform(), '0.id');
                dispatch({ type: 'fetchSalarySummary', payload: { page: 1, platform, verifyState: [SalarySummaryState.success] } });
              }
              dispatch({ type: 'getPositionInfoE', payload: {} });
              break;
            }

          // 薪资查询
          case '/Salary/Search':
            {
              // 默认获取当前账户的第一条平台数据
              if (dot.has(authorize.platform(), '0.id')) {
                const platform = dot.get(authorize.platform(), '0.id');
                dispatch({ type: 'fetchSalarySummary', payload: { page: 1, platform, flag: `${SalarySummaryFlag.finish}` } });
              }
              dispatch({
                type: 'getPositionInfoE',
                payload: {},
              });
              // // 获取系统的提示状态
              // dispatch({ type: 'fetchSalarySummaryNotice' });
              break;
            }
          // 薪资查询
          case '/Salary/Search/Records':
            {
              dispatch({ type: 'fetchSalaryRecords', payload: { page: 1, recordId: location.query.id, isTask: location.query.isTask } });
              dispatch({ type: 'fetchSalaryRecordsInfo', payload: { recordId: location.query.id, city: location.query.city, isTask: location.query.isTask } });
              break;
            }

          // 薪资详情页面，监听页面参数
          case '/Salary/Search/Detail':
            dispatch({ type: 'fetchSalaryRecordDetail', payload: { _id: location.query.id } });
            break;

          // 薪资设置列表
          case '/Salary/Setting':
            dispatch({ type: 'getSetupSalaryListE', payload: { page: 1, limit: 30 } });
            dispatch({ type: 'getPositionInfoE', payload: {} });
            break;

          // 薪资设置模版详情
          case '/Salary/Setting/Detail':
            dispatch({ type: 'fetchSalaryDetail', payload: { id: location.query.id } });
            break;
          // 人事扣款列表
          case '/Salary/Manage/HumanResources/Deduct':
            dispatch({
              type: 'getFillingMoneyListE',
              payload: {
                page: 1,
                limit: 30,
                fund_id: KnightSalaryType.personnalDeduct,
                sort: -1,
                platform_code: platform,
                permission_id: Modules.ModuleSalaryManageHumanResourcesDeduct.id,
              },
            });
            // 清除上传的表格数据
            dispatch({ type: 'clearUploadedExcelDataR' });
            break;

          case '/Finance/Salary':
            dispatch({ type: 'getPositionInfoE', payload: {} });
            dispatch({
              type: 'fetchSalaryRecords',
              payload: {
                page: 1,
                recordId: location.query.id,
                paymentState: [`${SalaryPaymentState.delayed}`, `${SalaryPaymentState.reissue}`],
              },
            });
            break;
          case '/Salary/Setting/Create':
            dispatch({ type: 'getPositionInfoE', payload: {} });
            dispatch({
              type: 'getSalarySpecificationsE',
              payload: {},
            });
            break;
          case '/Salary/Task':
            dispatch({
              type: 'getPositionInfoE',
              payload: {},
            });
            break;
        }
      });
    },
  },

  effects: {
    // 获取可新建薪资模板商圈
    *getEnableBizE({ payload }, { call, put }) {
      const result = yield call(getEnableBizS, payload);
      if (result.list) {
        yield put({ type: 'getEnableBizR', payload: result.list });
      }
    },
    // 获取可操作职位
    *getPositionInfoE({ payload }, { call, put }) {
      const result = yield call(getPositionInfoS, payload);
      if (result.result) {
        yield put({ type: 'getPositionInfoR', payload: result });
      }
    },
    // NOTE: ------- 薪资汇总页面 -----------

    // 获取薪资汇总信息
    *fetchSalarySummary({ payload }, { call, put }) {
      // 获取平台参数
      let platform = '';
      if (is.existy(payload.platform) && is.not.empty(payload.platform)) {
        platform = payload.platform;
      } else if (dot.has(authorize.platform(), '0.id')) {
        platform = dot.get(authorize.platform(), '0.id');
      } else {
        message.error('无法获取当前账户的平台数据');
        return false;
      }

      const params = {
        platform_code: platform,
        page: payload.page ? payload.page : 1,
        limit: payload.limit ? payload.limit : 30,
      };

      // 城市查询
      if (is.existy(payload.city) && is.not.empty(payload.city)) {
        params.city_spelling_list = payload.city;
      }
      // 角色查询
      if (is.existy(payload.position) && is.not.empty(payload.position)) {
        params.position_id_list = payload.position;
      }
      // 审核状态
      if (is.existy(payload.flag) && is.not.empty(payload.flag)) {
        params.option_flag = payload.flag === 'true';
      }
      // 审核状态
      if (is.existy(payload.verifyState) && is.not.empty(payload.verifyState)) {
        params.state = payload.verifyState;
      }
      // 薪资计算周期
      if (is.existy(payload.paymentCricle) && is.not.empty(payload.paymentCricle)) {
        params.pay_salary_cycle = payload.paymentCricle.map(item => Number(item));
      }
      // 工作类型
      if (is.existy(payload.workProperty) && is.not.empty(payload.workProperty)) {
        params.work_type = payload.workProperty;
      }
      // 薪资时间段
      if (is.existy(payload.dateRange) && is.not.empty(payload.dateRange)) {
        params.compute_time_slot = payload.dateRange;
      }
      // 更新日期
      if (is.existy(payload.updateRange) && is.not.empty(payload.updateRange)) {
        params.update_time = payload.updateRange;
      }
      // 工作性质
      if (is.existy(payload.work_type) && is.not.empty(payload.work_type)) {
        params.work_type = Number(payload.work_type);
      }

      const result = yield call(fetchSalarySummary, params);
      // console.log('DEBUG:fetchSalarySummary', params, result);

      if (result && is.existy(result.data)) {
        yield put({ type: 'reduceSalarySummary', payload: result });
      } else {
        message.error('获取列表数据错误', result);
      }
    },

    // 薪资汇总审核接口
    *updateSalarySummaryState({ payload }, { call, put }) {
      const params = {
        salary_collect_id: payload.ids,
        state: payload.state,
        reject_reason: payload.reject_reason,
      };
      const result = yield call(updateSalarySummaryState, params);

      if (result && is.truthy(result.ok)) {
        message.success('操作成功');
        yield put({ type: 'reduceSalarySummaryState', payload: { ids: payload.ids, state: payload.state } });
        // 刷新列表
        yield put({ type: 'fetchSalarySummary', payload: payload.searchParams });
      }
    },

    // 薪资汇总下载
    *createSalaryRecordsDownloadTask({ payload }, { call, put }) {
      const params = {
        platform_code: payload.platform,
      };

      // 城市查询
      if (is.existy(payload.city) && is.not.empty(payload.city)) {
        params.city_spelling_list = payload.city;
      }
      // 角色查询
      if (is.existy(payload.position) && is.not.empty(payload.position)) {
        params.position_id = payload.position;
      }
      // 骑士类型
      if (is.existy(payload.knightType) && is.not.empty(payload.knightType)) {
        params.knight_type_id = payload.knightType;
      }
      // 审核状态
      if (is.existy(payload.verifyState) && is.not.empty(payload.verifyState)) {
        params.state = payload.verifyState;
      }
      // 薪资生成状态
      if (is.existy(payload.produceState) && is.not.empty(payload.produceState)) {
        params.collect_type = Number(payload.produceState);
      }
      // 薪资计算周期
      if (is.existy(payload.paymentCricle) && is.not.empty(payload.paymentCricle)) {
        params.pay_salary_cycle = payload.paymentCricle.map(item => Number(item));
      }
      // 日期
      if (is.existy(payload.startDate) && is.not.empty(payload.startDate) && is.existy(payload.endDate) && is.not.empty(payload.endDate)) {
        params.date = [payload.startDate, payload.endDate];
      }
      // 工作性质
      if (is.existy(payload.work_type) && is.not.empty(payload.work_type)) {
        params.work_type = Number(payload.work_type);
      }

      const result = yield call(createSalaryRecordsDownloadTask, params);
      // console.log('DEBUG:createSalaryRecordsDownloadTask', params, result);

      if (result && is.existy(result.task_id)) {
        message.success(`创建下载任务成功，任务id：${result.task_id}`);
      }
    },

    // 获取薪资提示的状态
    *fetchSalarySummaryNotice({ payload }, { call, put }) {
      const result = yield call(fetchSalarySummaryNotice);

      if (result && is.existy(result.error_flag) && is.existy(result.is_disable)) {
        // console.log('DEBUG: 获取薪资提示的状态', result);
        yield put({ type: 'reduceSalarySummaryNotice', payload: result });
      } else {
        message.error('获取薪资提示的状态错误', result);
      }
    },

    // 不显示薪资提示
    *hideSalarySummaryNotice({ payload }, { call, put }) {
      yield put({ type: 'reduceSalarySummaryNotice', payload: false });
    },

    // 不再提示薪资提示
    *disableSalarySummaryNotice({ payload }, { call, put }) {
      const result = yield call(disableSalarySummaryNotice);

      if (result) {
        yield put({ type: 'reduceSalarySummaryNotice', payload: false });
      } else {
        message.error('薪资提示设置状态错误', result);
      }
    },

    // NOTE: ------- 薪资查询页面 -----------

    // 获取薪资列表
    *fetchSalaryRecords({ payload }, { call, put }) {
      const params = {
        page: payload.page ? payload.page : 1,
        limit: payload.limit ? payload.limit : 30,
      };

      // 判断是否是任务数据
      if (is.existy(payload.isTask) && is.not.empty(payload.isTask)) {
        params.task_flag = payload.isTask === '1';
      }

      // 薪资汇总记录id
      if (is.existy(payload.recordId) && is.not.empty(payload.recordId)) {
        params.salary_collect_id = payload.recordId;
      }
      // 平台code列表
      if (is.existy(payload.platform) && is.not.empty(payload.platform)) {
        params.platform_code_list = payload.platform;
      }
      // 城市查询
      if (is.existy(payload.city) && is.not.empty(payload.city)) {
        params.city_spelling_list = [payload.city];
      }
      // 商圈id、站点id、团队id列表
      if (is.existy(payload.district) && is.not.empty(payload.district)) {
        params.biz_district_id_list = payload.district;
      }
      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 性别
      if (is.existy(payload.gender) && is.not.empty(payload.gender)) {
        params.gender_id = Number(payload.gender);
      }
      // 职位
      if (is.existy(payload.positions) && is.not.empty(payload.positions)) {
        params.position_id_list = payload.positions.map(item => Number(item));
      }
      // 在职状态
      if (is.existy(payload.dutyState) && is.not.empty(payload.dutyState)) {
        params.work_state = payload.dutyState;
      }
      // 薪资发放状态
      if (is.existy(payload.paymentState) && is.not.empty(payload.paymentState)) {
        params.pay_salary_state_list = payload.paymentState.map(item => Number(item));
      }
      // 审核状态
      if (is.existy(payload.verifyState) && is.not.empty(payload.verifyState)) {
        params.audit_state = Number(payload.verifyState);
      }
      // 骑士类型
      if (is.existy(payload.knightType) && is.not.empty(payload.knightType)) {
        params.knight_type_id_list = payload.knightType;
      }
      // 审核日期
      if (is.existy(payload.verifyStartDate) && is.not.empty(payload.verifyStartDate) && is.existy(payload.verifyEndDate) && is.not.empty(payload.verifyEndDate)) {
        params.audit_date = [payload.verifyStartDate, payload.verifyEndDate];
      }
      // 薪资时间段
      if (is.existy(payload.dateRange) && is.not.empty(payload.dateRange)) {
        params.compute_time_slot = payload.dateRange;
      }
      // 更新日期
      if (is.existy(payload.updateRange) && is.not.empty(payload.updateRange)) {
        params.update_time = payload.updateRange;
      }

      const result = yield call(fetchSalaryRecords, params);
      // console.log('DEBUG:fetchSalaryRecords', params, result);
      if (result && is.existy(result.data)) {
        yield put({ type: 'reduceSalaryRecords', payload: result });
      } else {
        message.error('获取列表数据错误', result);
      }
    },

    // 薪资查询页面, 详细信息
    *fetchSalaryRecordsInfo({ payload }, { call, put }) {
      const params = {
        city_spelling_list: [payload.city],
      };

      // 判断是否是任务数据
      if (is.existy(payload.isTask) && is.not.empty(payload.isTask)) {
        params.task_flag = payload.isTask === '1';
      }

      // 薪资汇总记录id
      if (is.existy(payload.recordId) && is.not.empty(payload.recordId)) {
        params.salary_collect_id = payload.recordId;
      }
      // 商圈id、站点id、团队id列表
      if (is.existy(payload.district) && is.not.empty(payload.district)) {
        params.biz_district_id_list = payload.district;
      }
      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 性别
      if (is.existy(payload.gender) && is.not.empty(payload.gender)) {
        params.gender_id = payload.gender;
      }
      // 职位
      if (is.existy(payload.positions) && is.not.empty(payload.positions)) {
        params.position_id_list = payload.positions.map(item => Number(item));
      }
      // 在职状态
      if (is.existy(payload.dutyState) && is.not.empty(payload.dutyState)) {
        params.work_state = payload.dutyState;
      }
      // 薪资发放状态
      if (is.existy(payload.paymentState) && is.not.empty(payload.paymentState)) {
        params.pay_salary_state_list = payload.paymentState.map(item => Number(item));
      }
      // 审核状态
      if (is.existy(payload.verifyState) && is.not.empty(payload.verifyState)) {
        params.audit_state = Number(payload.verifyState);
      }
      // 骑士类型
      if (is.existy(payload.knightType) && is.not.empty(payload.knightType)) {
        params.knight_type_id_list = payload.knightType;
      }
      // 审核日期
      if (is.existy(payload.verifyStartDate) && is.not.empty(payload.verifyStartDate) && is.existy(payload.verifyEndDate) && is.not.empty(payload.verifyEndDate)) {
        params.audit_date = [payload.verifyStartDate, payload.verifyEndDate];
      }
      // 薪资时间段
      if (is.existy(payload.dateRange) && is.not.empty(payload.dateRange)) {
        params.compute_time_slot = payload.dateRange;
      }
      // 更新日期
      if (is.existy(payload.updateRange) && is.not.empty(payload.updateRange)) {
        params.update_time = payload.updateRange;
      }

      const result = yield call(fetchSalaryRecordsInfo, params);
      // console.log('DEBUG:fetchSalaryRecordsInfo', params, result);
      if (result) {
        yield put({ type: 'reduceSalaryRecordsInfo', payload: result });
      } else {
        message.error('获取列表数据错误', result);
      }
    },

    // 薪资审批
    *updateSalaryRecordState({ payload }, { call, put }) {
      const { isUpdateReissueFlag } = payload;
      // 请求参数
      const params = {
        order_id_list: payload.ids,
        state: payload.state,
      };

      // 账户id
      const result = yield call(updateSalaryRecordState, params);
      if (result && is.truthy(result.ok)) {
        message.success('操作成功');
        yield put({ type: 'reduceSalaryRecordState', payload: { ids: payload.ids, state: payload.state, isUpdateReissueFlag } });
        yield put({
          type: 'fetchSalaryRecords',
          payload: {
            page: 1,
            // recordId: location.query.id,
            paymentState: [`${SalaryPaymentState.delayed}`, `${SalaryPaymentState.reissue}`],
          },
        });
      } else {
        message.error('更新薪资发放状态错误', result);
      }
    },

    // 薪资记录下载
    *downloadSalaryRecords({ payload }, { call, put }) {
      const params = {};

      // 薪资汇总记录id
      if (is.existy(payload.recordId) && is.not.empty(payload.recordId)) {
        params.salary_collect_id = payload.recordId;
      }
      // 平台code列表
      if (is.existy(payload.platform) && is.not.empty(payload.platform)) {
        params.platform_code_list = payload.platform;
      }

      // 城市查询
      if (is.existy(payload.city) && is.not.empty(payload.city)) {
        params.city_spelling_list = payload.city;
      }

      // 职位id列表
      if (is.existy(payload.positions) && is.not.empty(payload.positions)) {
        params.position_id_list = payload.positions;
      }

      // 商圈id、站点id、团队id列表
      if (is.existy(payload.district) && is.not.empty(payload.district)) {
        params.biz_district_id_list = payload.district;
      }

      // 员工ID列表
      if (is.existy(payload.employees) && is.not.empty(payload.employees)) {
        params.staff_id_list = payload.employees;
      }

      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }

      // 性别
      if (is.existy(payload.gender) && is.not.empty(payload.gender)) {
        params.gender_id = payload.gender;
      }

      // 职位
      if (is.existy(payload.positions) && is.not.empty(payload.positions)) {
        params.position_id_list = payload.positions;
      }

      // 在职状态
      if (is.existy(payload.dutyState) && is.not.empty(payload.dutyState)) {
        params.work_state = payload.dutyState;
      }

      // 薪资发放状态
      if (is.existy(payload.paymentState) && is.not.empty(payload.paymentState)) {
        params.pay_salary_state_list = payload.paymentState.map(item => Number(item));
      }

      // 审核状态
      if (is.existy(payload.verifyState) && is.not.empty(payload.verifyState)) {
        params.audit_state = Number(payload.verifyState);
      }

      // 审核日期
      if (is.existy(payload.verifyStartDate) && is.not.empty(payload.verifyStartDate) && is.existy(payload.verifyEndDate) && is.not.empty(payload.verifyEndDate)) {
        params.audit_date = [payload.verifyStartDate, payload.verifyEndDate];
      }

      // 日期
      if (is.existy(payload.startDate) && is.not.empty(payload.startDate) && is.existy(payload.endDate) && is.not.empty(payload.endDate)) {
        params.date = [payload.startDate, payload.endDate];
      }

      const result = yield call(downloadSalaryRecords, params);
      // console.log('DEBUG:downloadSalaryRecords', params, result);

      if (result && is.existy(result.url)) {
        yield put({ type: 'reduceSalaryRecordsDownloadURL', payload: result.url });
      } else {
        message.error('获取下载地址失败', result);
      }
    },

    // 薪资明细
    *fetchSalaryRecordDetail({ payload }, { call, put }) {
      const result = yield call(fetchSalaryRecordDetail, payload);
      yield put({ type: 'getSalaryDetailR', payload: result });
    },

    // 扣补款列表
    *getFillingMoneyListE({ payload }, { call, put }) {
      const result = yield call(getFillingMoneyListS, payload);
      result.data.forEach((item) => {
        item.total_money === -1 ? item.total_money = 0 : '';
      });
      yield put({
        type: 'getFillingMoneyListR',
        payload: result,
      });
    },
    // 扣款列表删除
    *getFillingMoneyDetailRemove({ payload, history }, { call, put }) {
      const param = {
        _id: payload._id,
      };
      // delete payload.id;
      const result = yield call(getFillingMoneyDetailRemove, param);
      if (result.ok) {
        message.success('删除成功');
        yield put({
          type: 'deleteOneRecordOfListR',
          payload: { index: payload.index },
        });
      }
    },
    // 扣款详情列表删除
    *getFillingMoneyDetailRemoveDetail({ payload, history }, { call, put }) {
      const param = {
        _id: payload._id,
      };
      // delete payload.id;
      const result = yield call(getFillingMoneyDetailRemove, param);
      if (result.ok) {
        message.success('删除成功');
        yield put({
          type: 'deleteOneRecordDetailOfListR',
          payload: { index: payload.index },
        });
      }
    },
    // 扣款列表撤回
    *getFillingMoneyDetailWithdraw({ payload }, { call, put }) {
      const result = yield call(getFillingMoneyDetailWithdraw, { _id: payload._id });
      if (result.ok) {
        message.success('撤回成功');
        yield put({
          type: 'getFillingMoneyDetailE',
          payload: {
            detail_list: payload.detail_list, // 详情列表
            fund_id: Number(payload.fund_id), // 扣补款类型
            id: payload.id, // id
            sort: payload.sort, // 排序
          },
        });
      }
    },
    // 扣款列表提交
    *getFillingMoneyDetailSumbit({ payload }, { call, put }) {
      const params = {
        order_id: payload.id, // 总单ID
        data_list: payload.data_list, // 数据列表
      };
      const result = yield call(getFillingMoneyDetailSumbit, params);
      if (result.ok) {
        message.success('提交成功');
        yield put({
          type: 'getFillingMoneyDetailE',
          payload: {
            detail_list: payload.detail_list, // 详情列表
            fund_id: Number(payload.fund_id), // 扣补款类型
            id: payload.id, // 总单id
            sort: payload.sort, // 排序
          },
        });
      }
    },
    // 骑士扣补款审核
    *approveOfKnightSalaryE({ payload }, { call, put }) {
      const result = yield call(approveOfKnightSalaryS, payload);
      if (result.ok) {
        message.success('审核完成');
        switch (result.fund_id) {
          case KnightSalaryType.deduction:
            yield put({
              type: 'getFillingMoneyListE',
              payload: {
                permission_id: Modules.ModuleSalaryManageKnightDeduct.id, // 权限id
                sort: -1, // 排序
                page: 1, // 页码
                limit: 30, // 条数
                fund_id: KnightSalaryType.deduction, // 骑士扣款
              },
            });
            break;
          case KnightSalaryType.fillingMoney:
            yield put({
              type: 'getFillingMoneyListE',
              payload: {
                permission_id: Modules.ModuleSalaryManageKnightSupplement.id,
                sort: -1,
                page: 1,
                limit: 30,
                fund_id: KnightSalaryType.fillingMoney,
              },
            });
            break;
        }
      }
    },
    // 骑士/人事扣补款审批
    *updateSalaryRecordExamine({ payload }, { call, put }) {
      const params = {
        id_list: payload.id_list, // 单号
      };
      // 审核状态
      if (is.existy(payload.approval_state) && is.not.empty(payload.approval_state)) {
        params.approval_state = payload.approval_state;
      }
      // 审批说明
      if (is.existy(payload.examin_desc) && is.not.empty(payload.examin_desc)) {
        params.examin_desc = payload.examin_desc;
      }
      const result = yield call(updateSalaryRecordExamine, params);
      if (result.ok) {
        message.success('审批成功');
        yield put({
          type: 'getFillingMoneyDetailE',
          payload,
        });
      }
    },

    // 扣补款、人事扣款详情
    *getFillingMoneyDetailE({ payload }, { call, put }) {
      const params = {
        page: 1, // 页码
        limit: 50, // 条数
        fund_id: Number(payload.fund_id), // 扣补款类型
        supplier_id: authorize.account.supplierId, // 供应商id
      };
      let flag = false; // 判断是否查询过提交时间
      // 平台
      if (is.existy(payload.platform) && is.not.empty(payload.platform)) {
        params.platform_code = payload.platform;
      }
      // 骑士ID
      if (is.existy(payload.knight_id) && is.not.empty(payload.knight_id)) {
        params.knight_id = payload.knight_id;
      }
      // sort
      if (is.existy(payload.sort) && is.not.empty(payload.sort)) {
        params.sort = payload.sort;
      }
      // 扣款补款具体项目类型
      if (is.existy(payload.handlType) && is.not.empty(payload.handlType)) {
        params.handl_type_list = payload.handlType;
      }
      // 城市全拼列表
      if (is.existy(payload.city) && is.not.empty(payload.city)) {
        params.city_spelling_list = payload.city;
      }
      // 商圈列表
      if (is.existy(payload.district) && is.not.empty(payload.district)) {
        params.biz_district_list = payload.district;
      }
      // 扣补款日期开始日期
      if (is.existy(payload.fundStartDate) && is.not.empty(payload.fundStartDate)) {
        params.fund_start_date = payload.fundStartDate;
      }
      // 扣补款日期结束日期
      if (is.existy(payload.fundEndDate) && is.not.empty(payload.fundEndDate)) {
        params.fund_end_date = payload.fundEndDate;
      }
      // 供应商ID
      if (is.existy(payload.supplier) && is.not.empty(payload.supplier)) {
        params.supplier_id = payload.supplier;
      }
      // 详情ID列表
      if (is.existy(payload.detail_list) && is.not.empty(payload.detail_list)) {
        params.detail_id_list = payload.detail_list.split(',');
      }
      // 骑士id列表
      if (is.existy(payload.knightIdList) && is.not.empty(payload.knightIdList)) {
        params.knight_id_list = payload.knightIdList;
      }
      // 项目列表
      if (is.existy(payload.handlType) && is.not.empty(payload.handlType)) {
        params.handl_type_list = payload.handlType;
      }
      // 审核状态
      if (is.existy(payload.complateState) && is.not.empty(payload.complateState)) {
        params.state = Number(payload.complateState);
      }
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      // 完成状态
      if (is.existy(payload.submitState) && is.not.empty(payload.submitState)) {
        params.submit_state = Number(payload.submitState);
      }
      // 判断是详情页还是审核页面
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.order_id = payload.id;
      }
      // 提交人
      if (is.existy(payload.submitPeople) && is.not.empty(payload.submitPeople)) {
        params.submitter_id = payload.submitPeople;
      }
      // 提交开始时间
      if (is.existy(payload.submitStartDate) && is.not.empty(payload.submitStartDate)) {
        params.submit_start_date = payload.submitStartDate;
        flag = true; // 判断是否查询提交时间
      }
      // 提交结束时间
      if (is.existy(payload.submitEndDate) && is.not.empty(payload.submitEndDate)) {
        params.submit_end_date = payload.submitEndDate;
        flag = true; // 判断是否查询提交时间
      }
      const result = yield call(getFillingMoneyDetailS, params);
      // 对结果进行处理，金额为-1时转为0
      if (result.fund_list.length) {
        result.fund_list = result.fund_list.map((item) => {
          if (!item.amount || item[item.handl_type] === -1) {
            item.amount = 0;
            item[item.handl_type] = 0;
          }
          return item;
        });
      }
      // 总结进行处理
      if (result.collect_items.length) {
        result.collect_items = result.collect_items.map((item) => {
          Object.keys(item).map((key) => {
            if (Object.hasOwnProperty.call(item, key) && item[key] === -1) {
              item[key] = 0;
            }
          });
          return item;
        });
      }
      yield put({
        type: 'getFillingMoneyDetailR',
        payload: result,
      });
      // 查询提交时间时未查出结果，页面显示“未找到该时间段内的数据”
      if (flag && result.meta.result_count === 0) {
        message.error('未找到该时间段内的数据');
      }
    },
    // 扣补款、人事扣款详情
    *getDeductMoneyE({ payload }, { call, put }) {
      const { params, id } = payload;
      params.order_id = id;
      const result = yield call(getFillingMoneyDetailS, params);
      const { fund_list } = result;
      // 汇总列表数据的所有商圈
      const finalData = fund_list.reduce((accumulator, item) => {
        if (!accumulator[item.district_id]) {
          accumulator[item.district_id] = 1;
          accumulator.district_ids.push(item.district_id);
        }
        return accumulator;
      }, { district_ids: [] });
      fund_list.forEach((item) => {
        item.amount === -1 ? item.amount = 0 : '';
      });
      // 设置查询参数，查询指定商圈的所有骑士
      const accountId = authorize.account.id;
      const knightParam = {
        account_id: accountId,
        permission_id: Modules.ModuleSearchInquire.id,
        position_id_list: [Position.postmanManager, Position.postman],
        biz_district_id_list: [...finalData.district_ids],
        limit: 1000,
        page: 1,
      };
      const knightResult = yield call(getEmployeeListS, knightParam);
      const districtKnightList = knightResult.data.reduce((accumulator, item) => {
        const bizDistrictId = item.biz_district_list[0];
        if (!accumulator[bizDistrictId]) {
          accumulator[bizDistrictId] = [item];
        } else {
          accumulator[bizDistrictId].push(item);
        }
        return accumulator;
      }, {});
      yield put({
        type: 'getDeductMoneyR',
        payload: {
          ...result,
          districtKnightList,
          id, // 传递母单id
          fundId: params.fund_id,
        },
      });
      let hash;
      switch (params.fund_id) {
        case KnightSalaryType.deduction: hash = '/Salary/Manage/Knight/Deduct/Edit'; break;
        case KnightSalaryType.fillingMoney: hash = '/Salary/Manage/Knight/Supplement/Edit'; break;
        case KnightSalaryType.personnalDeduct: hash = '/Salary/Manage/HumanResources/Deduct/Edit'; break;
        default: '';

      }
      window.location.hash = hash;
    },
    // 下载骑士列表
    *downloadStaffListE({ payload }, { call, put }) {
      const result = yield call(downloadStaffListS, payload);
      if (result && is.existy(result.task_id)) {
        message.success(`创建下载任务成功，任务id：${result.task_id}`);
      } else {
        message.error(result.message);
      }
    },

    // 扣补款新建
    *createMoneyOrderOfKnightE({ payload }, { call, put }) {
      const result = yield call(createMoneyOrderOfKnightS, payload);
      if (result && result.ok) {
        message.success('创建成功');
        switch (payload.fund_id) {
          // 骑士扣款
          case KnightSalaryType.deduction:
            location.href = '/#/Salary/Manage/Knight/Deduct';
            break;
          // 骑士补款
          case KnightSalaryType.fillingMoney:
            location.href = '/#/Salary/Manage/Knight/Supplement';
            break;
          // 人事扣款
          case KnightSalaryType.personnalDeduct:
            location.href = '/#/Salary/Manage/HumanResources/Deduct';
            break;
          default:
            break;
        }
        // 创建成功，清除上传的表格数据
        // yield put({
        //   type: 'clearUploadedExcelDataR',
        // });
      }
      if (result.error_list && Array.isArray(result.error_list) && result.error_list.length > 0) {
        const errorList = result.error_list;
        yield put({
          type: 'createMoneyOrderOfKnightHasErrorR',
          payload: errorList,
        });
        yield put({
          type: 'showErrorDetailModalR',
          payload: true,
        });
      }
    },

    // 获取薪资模版列表
    *getSetupSalaryListE({ payload }, { call, put }) {
      const { page, limit } = payload;
      // 请求接口参数
      const params = {
        account_id: authorize.account.id,
        page: page || 1,
        limit: limit || 30,
      };
      // 职位id列表
      if (payload.position && payload.position !== [] && payload.position !== '') {
        params.position_id_list = [Number(payload.position)];
      }
      // 平台code列表
      if (payload.platform && payload.platform !== [] && payload.platform !== '') {
        params.platform_code_list = [payload.platform];
      }
      // 平台code_城市全拼列表
      if (payload.city && payload.city !== [] && payload.city !== '') {
        params.city_spelling_list = payload.city;
      }
      // 商圈id
      if (payload.district && payload.district !== [] && payload.district !== '') {
        params.biz_district_id_list = payload.district;
      }
      // 薪资计算周期
      if (payload.paymentCricle && payload.paymentCricle !== [] && payload.paymentCricle !== '') {
        params.pay_salary_cycle = Number(payload.paymentCricle);
      }
      // 骑士类型
      if (payload.knightType && payload.knightType !== [] && payload.knightType !== '') {
        params.knight_type_id = payload.knightType;
      }
      // 审核状态
      if (payload.verifyState && payload.verifyState !== [] && payload.verifyState !== '') {
        params.state = Number(payload.verifyState);
      }
      // 申请创建日期
      if (payload.startDate && payload.startDate !== [] && payload.startDate !== '' &&
        payload.endDate && payload.endDate !== [] && payload.endDate !== '') {
        params.start_date = payload.startDate;
        params.end_date = payload.endDate;
      }

      const result = yield call(fetchSalarySetupListS, params);
      if (result) {
        yield put({
          type: 'getSetupSalaryListR',
          payload: result,
        });
      }
    },

    // 新建薪资模板-添加供应商id
    *createSalaryModel({ payload }, { call, put }) {
      const list = [];
      payload.subjects.forEach((record, index) => {
        const item = {};
        item.formula_name = record.title;        // 项目：底薪、扣罚
        item.sub_item = [];

        const { subjects } = record;             // 子项目：123、234

        subjects.forEach((items) => {
          const subItem = {
            logics: {},
            name: '',
            belong_time: '',
          };

          // 遍历条件关系
          items.subjects.forEach((formulas, indexA) => {
            const logic = {
              condition_type: Number(formulas.condition), // 条件关系
              formula: formulas.calculateFormula,
              conditions: [],
            };

            // 遍历具体的条件
            formulas.formulas.forEach((formula, indexB) => {
              const value = {
                logic_symbol: Number(formula.formula),    // 条件描述类型
                specifications: formula.index,            // 指标
                first: formula.options.x || 0,            // 第一个值
              };

              // 获取公式中参数的个数, 如果参数个数等于两个, 则提交第二个参数 (第二个值 (A<B<C))
              if (SalaryFormula.getOptionsCount(formula.formula) === 2) {
                value.end = formula.options.y || 0;
              }

              dot.set(logic, `conditions.${indexB}`, value);
            });
            dot.set(subItem, `logics.${indexA}`, logic);
          });
          dot.set(subItem, 'name', items.title);
          dot.set(subItem, 'belong_time', items.times);
          // 判断是否有情况数据，有数据才添加提交
          if (Object.values(subItem.logics).length > 0) {
            item.sub_item.push(subItem);
          }
        });
        // 判断是否有情况数据，有数据才添加提交
        if (Object.values(item.sub_item).length > 0) {
          list.push(item);
        }
      });

      const params = {
        account_id: authorize.account.id, // 员工ID
        position_id: Number(payload.position),      // 职位id
        knight_type_id_list: payload.jobCategory,   // 职位类型id
        city_spelling_list: payload.city,           // 城市id列表
        biz_district_id_list: payload.district,     // 商圈id
        salary_formula_list: list,                 // 资金计算项公式列表
        work_type: payload.workProperty,            // 工作类型
        note: payload.note || '',                   // 备注项
        state: payload.state || '',                 // 提交状态：保存or提交
        supplier_id: authorize.account.supplierId || '',  // 供应商id
      };

      // 薪资计算周期
      if (is.existy(payload.paymentCricle)) {
        params.pay_salary_cycle = Number(payload.paymentCricle);
      }

      // 有效出勤
      if (payload.effectiveAttendanceDays && payload.effectiveAttendanceDays !== '') {
        params.valid_attendance = payload.effectiveAttendanceDays;
      }

      // 夜班应在岗时长
      if (payload.nightShiftHour && payload.nightShiftHour !== '') {
        params.night_shift_should_be_on_duty = payload.nightShiftHour;
      }

      // 应在岗时长(小时)
      if (payload.necessaryDutyTime && payload.necessaryDutyTime !== '') {
        params.necessary_duty_time = payload.necessaryDutyTime;
      }

      // 生效日期
      if (payload.effectiveAttendanceDate && payload.effectiveAttendanceDate !== '') {
        params.enabled_date = payload.effectiveAttendanceDate;
      }

      // 模版内容不能为空
      if (is.empty(params.salary_formula_list)) {
        return message.error('请填写完整薪资项目');
      }

      const result = yield call(createSalaryModelS, params);
      if (result.ok) {
        message.success('操作成功');
        yield put({ type: 'reduceUpsertSalaryState', payload: true });
      }
    },

    // 更新薪资模版-添加供应商id
    *updateSalaryModel({ payload }, { call, put }) {
      const list = [];
      payload.subjects.forEach((record, index) => {
        const item = {};
        item.formula_name = record.title;        // 项目：底薪、扣罚
        item.sub_item = [];

        const { subjects } = record;             // 子项目：123、234

        subjects.forEach((items) => {
          const subItem = {
            logics: {},
            name: '',
            belong_time: '',
          };

          // 遍历条件关系
          items.subjects.forEach((formulas, indexA) => {
            const logic = {
              condition_type: Number(formulas.condition), // 条件关系
              formula: formulas.calculateFormula,
              conditions: [],
            };

            // 遍历具体的条件
            formulas.formulas.forEach((formula, indexB) => {
              const value = {
                logic_symbol: Number(formula.formula),    // 条件描述类型
                specifications: formula.index,            // 指标
                first: formula.options.x || 0,            // 第一个值
              };

              // 获取公式中参数的个数, 如果参数个数等于两个, 则提交第二个参数 (第二个值 (A<B<C))
              if (SalaryFormula.getOptionsCount(formula.formula) === 2) {
                value.end = formula.options.y || 0;
              }

              dot.set(logic, `conditions.${indexB}`, value);
            });
            dot.set(subItem, `logics.${indexA}`, logic);
          });
          dot.set(subItem, 'name', items.title);
          dot.set(subItem, 'belong_time', items.times);
          // 判断是否有情况数据，有数据才添加提交
          if (Object.values(subItem.logics).length > 0) {
            item.sub_item.push(subItem);
          }
        });
        // 判断是否有情况数据，有数据才添加提交
        if (Object.values(item.sub_item).length > 0) {
          list.push(item);
        }
      });
      const params = {
        account_id: authorize.account.id,           // 员工ID
        position_id: Number(payload.position),      // 职位id
        knight_type_id_list: payload.jobCategory,   // 职位类型id
        city_spelling_list: payload.city,           // 城市id列表
        biz_district_id_list: payload.district,     // 商圈id
        salary_formula_list: list,                  // 资金计算项公式列表
        work_type: payload.workProperty,            // 工作类型
        salary_model_id: payload.id,                // 编辑信息的id
        note: payload.note || '',                   // 备注项
        supplier_id: authorize.account.supplierId || '',  // 供应商id
        state: payload.state || '',
      };
      // 薪资计算周期
      if (is.existy(payload.paymentCricle)) {
        params.pay_salary_cycle = Number(payload.paymentCricle);
      }
      // 有效出勤
      if (payload.effectiveAttendanceDays && payload.effectiveAttendanceDays !== '') {
        params.valid_attendance = payload.effectiveAttendanceDays;
      }

      // 夜班应在岗时长
      if (payload.nightShiftHour && payload.nightShiftHour !== '') {
        params.night_shift_should_be_on_duty = payload.nightShiftHour;
      }

      // 模版内容不能为空
      if (is.empty(params.salary_formula_list)) {
        return message.error('请填写完整薪资项目');
      }
      const result = yield call(updateSalaryModelS, params);
      if (result.ok) {
        message.success('操作成功');
        yield put({ type: 'reduceUpsertSalaryState', payload: true });
      }
    },

    // 重置，更新或创建薪资设置状态
    *resetUpsertSalarySuccess({ payload }, { call, put }) {
      yield put({ type: 'reduceUpsertSalaryState', payload: false });
    },

    // 获取薪资模版详情
    *fetchSalaryDetail({ payload }, { call, put }) {
      const params = {
        account_id: authorize.account.id,
        _id: payload.id,
      };
      const result = yield call(fetchSalaryModelDetailS, params);
      if (result) {
        yield put({ type: 'reduceSalarySetupDetailR', payload: result });
      } else {
        message.error('获取薪资模版详情失败');
      }
    },

    // 薪资模版审批通过
    *approveSalarySetup({ payload }, { call, put }) {
      const params = {
        account_id: authorize.account.id,
        _id_list: payload.id,
        approval_state: SalaryVerifyState.working,
      };
      const result = yield call(requestVerifySetupS, params);
      if (result.ok) {
        yield put({ type: 'reduceUpdateSalarySetup', payload: result });
        yield put({ type: 'getSetupSalaryListE', payload });
        message.success('操作成功', 2);
      } else {
        message.error('审批模版失败');
      }
    },

    // 薪资模版驳回
    *rejectSalarySetup({ payload }, { call, put }) {
      const params = {
        account_id: authorize.account.id,
        _id_list: payload.id,
        approval_state: SalaryVerifyState.reject,
      };
      // 驳回原因
      if (payload.reject_reason) {
        params.reject_reason = payload.reject_reason;
      }
      const result = yield call(requestVerifySetupS, params);
      if (result.ok) {
        yield put({ type: 'reduceUpdateSalarySetup', payload: result });
        yield put({ type: 'getSetupSalaryListE', payload });
        message.success('操作成功', 2);
      } else {
        message.error('审批模版失败');
      }
    },

    // 薪资模板停用、删除、撤回
    *salarySettingStop({ payload }, { call, put }) {
      const params = {
        permission_id: Modules.OperateSalarySettingStopButton.id, // 权限id
        account_id: authorize.account.id, // 员工id
        _id_list: payload.id,         // id
        approval_state: payload.state,    // 审核状态
      };
      const result = yield call(requestVerifySetupS, params);
      if (result.ok) {
        yield put({ type: 'reduceUpdateSalarySetup', payload: result });
        yield put({ type: 'getSetupSalaryListE', payload });
        message.success('操作成功', 2);
      } else {
        message.error('停用模版失败');
      }
    },

    // 薪资模板停用--coo可以停用
    *removeOrderList({ payload }, { call, put }) {
      const params = {
        _id: payload.id,
      };
      const result = yield call(removeOrderList, params);
      if (result.ok) {
        message.success('删除成功', 2);
        yield put({
          type: 'refreshIndexPageR',
          payload: {
            index: payload.index,
          },
        });
      } else {
        message.error('删除失败');
      }
    },

    // 请求某商圈下的骑士列表
    *getKnightListE({ payload }, { call, put }) {
      const { index } = payload;
      delete payload.index;
      const result = yield call(getEmployeeListS, payload);
      if (result && result.data) {
        yield put({
          type: 'setKnightListByIndexR',
          payload: {
            data: result.data,
            index,
          },
        });
      }
    },
    // 请求某商圈下的骑士列表
    *getKnightListForJudgeE({ payload }, { call, put }) {
      const { index } = payload;
      delete payload.index;
      const result = yield call(getEmployeeListS, payload);
      if (result && result.data) {
        yield put({
          type: 'setKnightListR',
          payload: {
            data: result.data,
            index,
          },
        });
      }
    },
    // 骑士扣款（汇总审核）knightChargeSource
    *getKnightChargeSourceE({ payload }, { call, put }) {
      const result = yield call(knightCharge, payload);
      yield put({ type: 'reducerKnightChargeSourceR', payload: result });
    },
    // 跳转页面的时候清空母单单号
    *openCreatePageE({ payload }, { put }) {
      const { hash } = payload;
      window.location.hash = hash;
      yield put({ type: 'clearParentIdR', payload: '' });
    },
    // 获取薪资指标库
    *getSalarySpecificationsE({ payload }, { call, put }) {
      const permissionId = Modules.ModuleSalarySettingCreate.id;
      const result = yield call(getSalarySpecifications, { permission_id: permissionId });
      if (dot.get(result, 'salary_specifications.model_data')) {
        yield put({ type: 'getSalarySpecificationsR', payload: result.salary_specifications.model_data });
      }
    },
  },

  reducers: {

    // 薪资汇总列表
    reduceSalarySummary(state, action) {
      return { ...state, salarySummary: action.payload };
    },

    // 薪资汇总更新状态
    reduceSalarySummaryState(state, action) {
      const salarySummary = {};
      salarySummary.data = dot.get(state, 'salarySummary.data', []).map((item) => {
        const data = item;
        if (action.payload.ids.includes(item._id)) {
          data.state = action.payload.state;
        }
        return data;
      });
      return { ...state, salarySummary };
    },

    // 薪资提示是否显示
    reduceSalarySummaryNotice(state, action) {
      return {
        ...state,
        isShowSalarySummaryNotice: action.payload.is_disable,
        isShowSalarySummaryExceptionMessage: action.payload.error_flag,
      };
    },

    // 薪资记录列表
    reduceSalaryRecords(state, action) {
      return { ...state, salaryRecords: action.payload };
    },

    // 薪资记录汇总信息
    reduceSalaryRecordsInfo(state, action) {
      return { ...state, salaryRecordsInfo: action.payload };
    },

    // 薪资记录列表，批量缓发
    reduceSalaryRecordState(state, action) {
      const isUpdateReissueFlag = action.payload.isUpdateReissueFlag;
      const ids = action.payload.ids || [];
      const updateState = action.payload.state;
      const salaryRecords = {};
      salaryRecords.data = dot.get(state, 'salaryRecords.data', []).map((item) => {
        const data = item;
        if (ids.includes(item._id)) {
          // 判断是否是更新标识符
          if (isUpdateReissueFlag === true) {
            data.reissue_flag = false;
          } else {
            // 更新数据的状态
            data.pay_salary_state = updateState;
          }
        }
        return data;
      });
      return { ...state, salaryRecords };
    },

    // 薪资记录列表, 文件下载
    reduceSalaryRecordsDownloadURL(state, action) {
      return { ...state, salaryRecordsDownloadURL: action.payload };
    },

    // 薪资明细reducer
    getSalaryDetailR(state, action) {
      return { ...state, salaryDetail: action.payload };
    },

    // 扣款单列表reducer
    getFillingMoneyListR(state, action) {
      return { ...state, fillingMoneyList: action.payload };
    },

    // 扣款单详情reducer
    getFillingMoneyDetailR(state, action) {
      return { ...state, knightFillingMessage: action.payload };
    },

    // 薪资列表reducer
    getSetupSalaryListR(state, action) {
      return { ...state, salarySetupList: action.payload };
    },

    // 创建薪资模版
    reduceCreateSalaryR(state, action) {
      return { ...state, createSalaryModel: action.payload };
    },

    // 薪资模版详情
    reduceSalarySetupDetailR(state, action) {
      return { ...state, salarySetupDetail: action.payload };
    },

    // 审核模版通过
    reduceUpdateSalarySetup(state, action) {
      // const salarySetupList = {};
      // salarySetupList.data = dot.get(state, 'salarySetupList.data', []).map((item) => {
      //   const data = item;
      //   if (item._id === action.payload.id) {
      //     data.state = action.payload.state;
      //     data.disabled_time = new Date();
      //   }
      //   return data;
      // });
      return { ...state, salarySetupList: action.payload };
    },

    // 解析excel数据
    analysisExcelDataR(state, action) {
      return { ...state, excelData: action.payload };
    },

    // 预览页面，保存编辑后的数据
    handleSavePreviewDataR(state, { payload }) {
      return {
        ...state,
        deductionDataSource: [payload.newData, ...state.deductionDataSource],  // 骑士补款要展示的数据
        deductionSubmitDataSource: [payload.dataSource, ...state.deductionSubmitDataSource],  // 骑士补款要提交的数据
      };
    },

    // 删除展示的数据
    updateDeductionDataSourceR(state, { payload }) {
      return {
        ...state,
        deductionDataSource: payload.deductionDataSource,
        deductionSubmitDataSource: payload.deductionSubmitDataSource,
      };
    },

    // 获取编辑的那行信息
    getDeductionEditDataSourceR(state, { payload }) {
      return {
        ...state,
        deductionEditDataSource: payload.editDataSource,
        editIndex: payload.editIndex,
      };
    },

    // 提交补款编辑后的信息
    editDeductionDataR(state, { payload }) {
      const editIndex = state.editIndex;
      return {
        ...state,
        deductionDataSource: dot.get(state, 'deductionDataSource') && dot.get(state, 'deductionDataSource', []).map((item, index) => {
          if (index === editIndex) {
            return payload.newData;
          }
          return item;
        }),
        deductionSubmitDataSource: dot.get(state, 'deductionSubmitDataSource') && dot.get(state, 'deductionSubmitDataSource', []).map((item, index) => {
          if (index === editIndex) {
            return payload.dataSource;
          }
          return item;
        }),
      };
    },

    // 创建骑士扣补款存在错误信息
    createMoneyOrderOfKnightHasErrorR(state, action) {
      return { ...state, errorList: action.payload };
    },

    // 显示错误弹窗
    showErrorDetailModalR(state, action) {
      return { ...state, detailErr: action.payload };
    },

    // 重置，更新或创建薪资设置状态
    reduceUpsertSalaryState(state, { payload }) {
      return { ...state, isUpsertSalarySuccess: payload };
    },
    reduceSalaryState(state, { payload }) {
      return { ...state, reduceSalaryState: payload };
    },
    // 清除上传的excel数据
    clearUploadedExcelDataR(state) {
      return {
        ...state,
        deductionDataSource: [],
        deductionSubmitDataSource: [],
      };
    },
    // 获取骑士扣款单条编辑信息
    getDeductMoneyR(state, { payload }) {
      const { fund_list, districtKnightList, id, fundId } = payload;
      const manualDataSource = [];
      const typeList = fundId === KnightSalaryType.deduction ? CutEventType :
        fundId === KnightSalaryType.fillingMoney ? FillingEventType :
          fundId === KnightSalaryType.personnalDeduct ? PersonalCutEventType : '';
      fund_list.map((ele) => {
        const temp = {
          _id: ele._id, // id
          platform: [ele.platform_code], // 平台
          city: [ele.city_spelling], // 城市
          district: [ele.district_id], // 商圈
          selectKnight: [ele.staff_id], // 选择的骑士
          deductEvent: typeList[ele.handl_type] ? [`${typeList[ele.handl_type]}`] : '', // 扣款项目
          deductAmount: ele.amount ? `${ele.amount}` : 0, // 扣款金额
          deductReason: ele.cut_subsidy_other_cause || '', // 原因
          knight: districtKnightList[ele.district_id], // 骑士
          date: ele.date,  // 扣补款日期
        };
        manualDataSource.push(temp);
      });
      return {
        ...state,
        manualDataSource,
        parentId: id,
      };
    },
    // 删除某条扣款列表中的一条数据
    deleteOneRecordOfListR(state, { payload }) {
      const { index } = payload;
      const manualDataSource = _.cloneDeep(state.manualDataSource);
      manualDataSource.splice(index, 1);
      return {
        ...state,
        manualDataSource,
      };
    },
    // 删除某条扣款列表中的一条数据
    deleteOneRecordDetailOfListR(state, { payload }) {
      const { index } = payload;
      const knightFillingMessage = state.knightFillingMessage;
      knightFillingMessage.fund_list.splice(index, 1);
      return {
        ...state,
        knightFillingMessage,
      };
    },
    // 为某一条数据添加骑士列表选项
    setKnightListByIndexR(state, { payload }) {
      const { data, index } = payload;
      const manualDataSource = state.manualDataSource;
      manualDataSource[index].knight = data;
      return {
        ...state,
        manualDataSource,
      };
    },
    // 为某一条数据添加骑士列表选项
    setKnightListR(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        knights: data,
      };
    },
    // 清空母单单号
    clearParentIdR(state, { payload }) {
      return {
        ...state,
        parentId: payload,
        manualDataSource: [{ // 手动输入的列表值
          platform: [], // 平台
          city: [], // 城市
          district: [], // 商圈
          knight: [], // 骑士
          selectKnight: [], // 选择的骑士
          deductEvent: [], // 扣款项目
          deductAmount: '', // 扣款金额
          deductReason: '', // 原因
          date: '', // 扣补款日期
        }],
      };
    },
    // 骑士扣款（汇总审核）
    reducerKnightChargeSourceR(state, { payload }) {
      return {
        ...state,
        knightChargeSource: payload,
      };
    },
    // 清空删除的首页数据
    refreshIndexPageR(state, { payload }) {
      const { fillingMoneyList } = state;
      const { index } = payload;
      fillingMoneyList.data.splice(index, 1);
      return {
        ...state,
        fillingMoneyList,
      };
    },
    // 添加一行新数据
    addNewRowR(state, { payload }) {
      const { tempSource } = payload;
      return {
        ...state,
        manualDataSource: tempSource,
      };
    },
    // 薪资指标库
    getSalarySpecificationsR(state, { payload }) {
      return {
        ...state,
        specifications: payload,
      };
    },
    // 职位信息
    getPositionInfoR(state, { payload }) {
      return {
        ...state,
        positionList: payload.result,
      };
    },
    // 可创建薪资模板商圈
    getEnableBizR(state, { payload }) {
      return {
        ...state,
        areaList: payload,
      };
    },
  },
};
