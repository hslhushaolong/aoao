/**
 * 费用管理
 **/
import is from 'is_js';
import moment from 'moment';
import { message } from 'antd';
import { getUniqueHouseNumS, getTypeNameListS, submitTypeApplyS, typeApplyListS, typeApplyDetailS, typeApplyEditS, submitTypeApplyGroupS, getApprovalListS, approvalEditS, getRecordListS, recordEditS, getExamineSimpleNameS, getExamineSimpleDetailS, getApprovalProcessS, getTypeNameSimpleS, typeApplyDeleteS } from '../../services/expense';
import { authorize } from '../../application';
import { ExpenseType, ExpenseVerifyState, ExpenseHouseState, ExpenseRequestCType } from '../../application/define';

const takeLatest = { type: 'takeLatest' };
const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export default {
  namespace: 'approval',
  state: {
    uniqueHouseNum: 0, // 费用申请租房生成唯一房屋编号
    typeNameList: [], // 费用申请获得费用类型名称
    typeApplyList: {  // 费用申请记录列表
      _meta: {
        has_more: false,
        result_count: 0,
      },
      data: [],
    },
    typeApplyDetail: {},   // 费用申请费用申请单详情
    approvalList: {        // 审批单列表
      _meta: {
        has_more: false,
        result_count: 0,
      },
      data: [],
    },
    getRecordList: {        // 记录明细列表
      _meta: {
        has_more: false,
        result_count: 0,
      },
      data: [],
    },
    examineSimpleNameList: [],   // 审批流名称接口
    examineSimpleDetail: {},       // 审批单详情接口
    approvalProcess: [],            // 审批单进度
    recordEdit: undefined,         // 编辑审批单号
    batchOrder: [],               // 批量审批
    dispatching: false, // 默认没有处理请求
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location;
        // 如果账号处于未登录，不进行处理
        if (authorize.isLogin() === false) {
          return;
        }

        // 创建流水类型选择页面
        if (pathname === '/Expense/Manage/Create') {
          // 获取费用类型
          dispatch({ type: 'getTypeNameListE' });
        }

        // 创建单条流水页面
        if (pathname === '/Expense/Manage/Template/Create') {
          // 获取房屋编号
          dispatch({ type: 'getUniqueHouseNumE' });
        }

        // 单条流水记录的编辑页面
        if (pathname === '/Expense/Manage/Template/Update') {
          // 获取单条流水记录的详情数据
          dispatch({ type: 'typeApplyDetailE', payload: { order_id: query.recordId } });
        }

        // 单条流水记录的详情页面
        if (pathname === '/Expense/Manage/Template/Detail') {
          // 获取单条流水记录的详情数据
          dispatch({ type: 'typeApplyDetailE', payload: { order_id: query.recordId } });
        }

        // 断租，续租，续签，退租 表单页面
        if (pathname === '/Expense/Manage/Records/Form') {
          // 获取单条流水记录的详情数据
          dispatch({ type: 'typeApplyDetailE', payload: { order_id: query.recordId } });
        }

        // 断租，续租，续签，退租 详情页面
        if (pathname === '/Expense/Manage/Records/Detail') {
          // 获取单条流水记录的详情数据
          dispatch({ type: 'typeApplyDetailE', payload: { order_id: query.recordId } });
        }

        // 创建汇总流水页面，
        if (pathname === '/Expense/Manage/Summary/Create') {
          // 获取审批流列表数据
          dispatch({ type: 'getExamineSimpleNameE' });
          // 获取审批单详情的列表数据
          dispatch({ type: 'typeApplyListE', payload: { examineflow_id: query.summaryId, limit: 30, page: 1 } });
          // 获取审批单详情的基本信息
          dispatch({ type: 'getExamineSimpleDetailE', payload: { examine_id: query.summaryId } });
          // 获取审批单审批进度
          dispatch({ type: 'getApprovalProcessE', payload: { examine_id: query.summaryId } });
        }

        // 汇总流水详情页面
        if (pathname === '/Expense/Manage/Summary/Detail') {
          // 获取审批单详情的基本信息
          dispatch({ type: 'getExamineSimpleDetailE', payload: { examine_id: query.summaryId } });
          // 获取审批单详情的列表数据
          dispatch({ type: 'typeApplyListE', payload: { examineflow_id: query.summaryId, limit: 30, page: 1 } });
          // 获取审批单审批进度
          dispatch({ type: 'getApprovalProcessE', payload: { examine_id: query.summaryId } });
        }

        // 费用审核记录页面
        if (pathname === '/Expense/Manage/Audit') {
          // 获取费用类型
          dispatch({ type: 'getTypeNameSimpleE' });

          // 获取费用审核的数据
          dispatch({ type: 'getApprovalListE', payload: { limit: 30, page: 1 } });
        }

        // 记录明细页面
        if (pathname === '/Expense/Manage/Records') {
          // 获取费用类型
          dispatch({ type: 'getTypeNameListE' });
          // 获取明细列表数据
          dispatch({ type: 'getRecordListE', payload: { limit: 30, page: 1 } });
        }

        // 记录明细页面, 编辑明细列表
        if (pathname === '/Expense/Manage/Records/Summary/Create') {
          // 获取审批流列表数据
          dispatch({ type: 'getExamineSimpleNameE' });
        }
      });
    },
  },

  effects: {

    // 费用申请租房生成唯一房屋编号
    * getUniqueHouseNumE({ payload }, { call, put }) {
      const result = yield call(getUniqueHouseNumS, payload);
      if (result === undefined) {
        return;
      }
      if (result.ok) {
        yield put({ type: 'getUniqueHouseNumR', payload: result.result });
      }
    },

    // 费用申请获得费用类型名称
    * getTypeNameListE({ payload }, { call, put }) {
      const result = yield call(getTypeNameListS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getTypeNameListR', payload: result });
    },

    // 费用申请获得费用类型名称
    * getTypeNameSimpleE({ payload }, { call, put }) {
      const result = yield call(getTypeNameSimpleS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getTypeNameListR', payload: result });
    },

    submitTypeApplyE: [
      function*({ payload }, { call, put }) {
        yield put({ type: 'dispatchingR', payload: true });
        const type = payload.type;
        delete payload.type;
        // 项目信息转换
        const transKey = (value) => {
          if (value === 'platform') {
            return 'platform_code';
          }
          if (value === 'vendor') {
            return 'supplier_id';
          }
          if (value === 'city') {
            return 'city_spelling';
          }
          if (value === 'district') {
            return 'biz_id';
          }
          if (value === 'costCount') {
            return 'custom_money';
          }
        };
        //  将前端数据转换为后端要的数据
        const transPayload = (values) => {
          const data = {};
          // 房屋编号
          if (is.existy(values.houseNum) && !is.empty(values.houseNum)) {
            data.house_num = values.houseNum;
          }
          // 房屋编号
          if (is.existy(values.house_num) && !is.empty(values.house_num)) {
            data.house_num = values.house_num;
          }
          // 房屋用途
          if (is.existy(values.usage) && !is.empty(values.usage)) {
            data.use = values.usage;
          }
          // 房屋面积
          if (is.existy(values.area) && !is.empty(values.area)) {
            data.area = parseFloat(values.area);
          }
          // 是否开发票
          if (is.existy(values.hasInvoice) && !is.empty(values.hasInvoice)) {
            data.has_invoice = values.hasInvoice != 0;
          }
          // 费用金额(报销等)
          if (is.existy(values.money) && !is.empty(values.money)) {
            data.reimb_money = values.money;
          }
          // 合同租期起始时间
          if (is.existy(values.contractDateRanage) && !is.empty(values.contractDateRanage)) {
            data.contract_start_date = moment(values.contractDateRanage[0]).format('YYYY-MM-DD');
            data.contract_end_date = moment(values.contractDateRanage[1]).format('YYYY-MM-DD');
          }
          // 月租金
          if (is.existy(values.monthRent) && !is.empty(values.monthRent)) {
            data.month_rent = values.monthRent;
          }
          // 每次付款月数
          if (is.existy(values.month) && !is.empty(values.month)) {
            data.pay_time = values.month;
          }
          // 提前付款天数
          if (is.existy(values.days) && !is.empty(values.days)) {
            data.payment_date = parseFloat(values.days);
          }
          // 成本中心(1:项目 2:项目主体 3:城市 4:商圈 5:骑士)
          if (is.existy(values.expense.costCenter) && !is.empty(values.expense.costCenter)) {
            data.cost_center = parseFloat(values.expense.costCenter);
          }
          // 成本归属(6:平均分摊 7:单量比例分摊 8:自定义分摊)
          if (is.existy(values.expense.costCenter) && !is.empty(values.expense.costCenter)) {
            data.cost_belong = parseFloat(values.expense.costBelong);
          }
          // 收款信息
          if (is.existy(values.expense.costItems) && !is.empty(values.expense.costItems)) {
            const items = values.expense.costItems;
            const cost = [];
            // 因为首款信息可以有多条所以是数组先循环
            items.forEach((item) => {
              const per = {};
              for (const key in item) {
                // 遍历属性，排除原型链
                if (item.hasOwnProperty(key)) {
                  // 如果属性值不是undefined或者
                  if (item[key] != undefined) {
                    // 就单独转换各属性名
                    per[transKey(key)] = item[key];
                  }
                }
              }
              cost.push(per);
            });
            data.cost_belong_items = cost;
          }
          // 备注
          if (is.existy(values.note) && !is.empty(values.note)) {
            data.desc = values.note;
          }
          // 科目
          if (is.existy(values.subjects.subjectOne) && !is.empty(values.subjects.subjectOne)) {
            data.catalog_id = values.subjects.subjectOne;
          }
          // 科目
          if (is.existy(values.subjects.subjectTwo) && !is.empty(values.subjects.subjectTwo)) {
            data.catalog_id = values.subjects.subjectTwo;
          }
          // 科目
          if (is.existy(values.subjects.subjectThree) && !is.empty(values.subjects.subjectThree)) {
            data.catalog_id = values.subjects.subjectThree;
          }
          // 文件列表
          if (is.existy(values.files_address) && !is.empty(values.files_address)) {
            data.files_address = values.files_address;
          }
          // 收款人相关
          if (is.existy(values.bankName) && !is.empty(values.bankName)) {
            data.payee_info = {
              address: values.bankName,  // 开户行
              card_num: values.payeeAccount, // 银行卡号
              name: values.payee,   // 收款人
            };
          }
          // 科目id
          if (is.existy(values.catalog_id) && !is.empty(values.catalog_id)) {
            data.catalog_id = values.catalog_id;
          }
          // 申请人id
          if (is.existy(values.apply_account) && !is.empty(values.apply_account)) {
            data.apply_account = values.apply_account;
          }
          // 房屋状态
          if (is.existy(values.thing_state) && !is.empty(values.thing_state)) {
            data.thing_state = values.thing_state;
          }
          // 费用类型
          if (is.existy(values.costclass_id) && !is.empty(values.costclass_id)) {
            data.costclass_id = values.costclass_id;
          }
          // 订单号
          if (is.existy(values.examine_id) && !is.empty(values.examine_id)) {
            data.examine_id = values.examine_id;
          }
          // 申请单 初创、续租（批量） 薪资单列表（批量）
          if (is.existy(values.apply_id_list) && !is.empty(values.apply_id_list)) {
            data.apply_id_list = values.apply_id_list;
          }
          // 判断创建页面 1 初创新增 2 续租、批量续租 3 批量缓发薪资
          if (is.existy(values.c_type) && !is.empty(values.c_type)) {
            data.c_type = values.c_type;
          }
          return data;
        };
        const result = yield call(submitTypeApplyS, transPayload(payload));
        yield put({ type: 'dispatchingR', payload: false });
        if (result === undefined) {
          return;
        }
        if (result.ok) {
          window.location.href = `/#/Expense/Manage/Summary/Create?type=${type}&summaryId=${result._id}`;
        }
      },
      takeLatest],
      // 费用申请提交费用申请单
      * submitSalaryApplyE({ payload }, { call, put }) {
        // 判断薪资id数据
        if (is.not.existy(payload.ids) || is.empty(payload.ids) || is.not.array(payload.ids)) {
          return message.error('提交的数据错误');
        }

        const params = {
          c_type: ExpenseRequestCType.salary,  // 费用管理申请单接口参数，批量缓发薪资
          apply_id_list: payload.ids,           // 薪资数据ids
        };
        const result = yield call(submitTypeApplyS, params);
        if (result === undefined) {
          return;
        }
        if (result.ok) {
          message.success('操作成功，页面跳转中');
          window.location.href = `/#/Expense/Manage/Summary/Create?type=${ExpenseType.salary}&summaryId=${result._id}`;
        } else {
          message.error('操作失败', result);
        }
      },

      // 费用申请记录列表
      * typeApplyListE({ payload }, { call, put }) {
        const result = yield call(typeApplyListS, payload);
        if (result === undefined) {
          return;
        }
        yield put({ type: 'typeApplyListR', payload: result });
      },

      // 费用申请费用申请单详情
      * typeApplyDetailE({ payload }, { call, put }) {
        const result = yield call(typeApplyDetailS, payload);
        if (result === undefined) {
          return;
        }
        yield put({ type: 'typeApplyDetailR', payload: result.result });
      },

      // 费用申请费用申请单编辑
      * typeApplyEditE({ payload }, { call, put }) {
        // 首款信息属性名字转换函数
        const transKey = (value) => {
          if (value === 'platform') {
            return 'platform_code';   // 平台
          }
          if (value === 'vendor') {
            return 'supplier_id';    // 供应商
          }
          if (value === 'city') {
            return 'city_spelling';   // 城市
          }
          if (value === 'district') {
            return 'biz_id';   // 商圈
          }
          if (value === 'costCount') {
            return 'custom_money';  // 平摊金额
          }
        };
        // 将前端数据转换为后端要的数据
        const transPayload = (values) => {
          const data = {};
          function existy(value) {
            if (value == null || value === '') {
              return false;
            }
            return true;
          }
          // 房屋编号
          if (existy(values.houseNum) && !is.empty(values.houseNum)) {
            data.house_num = values.houseNum;
          }
          // 房屋编号
          if (existy(values.house_num) && !is.empty(values.house_num)) {
            data.house_num = values.house_num;
          }
          // 房屋用途
          if (existy(values.usage) && !is.empty(values.usage)) {
            data.use = values.usage;
          }
          // 房屋面积
          if (existy(values.area) && !is.empty(values.area)) {
            data.area = parseFloat(values.area);
          }
          // 是否开发票
          if (existy(values.hasInvoice) && !is.empty(values.hasInvoice)) {
            data.has_invoice = values.hasInvoice != 0;
          }
          // 费用金额(报销等)
          if (existy(values.money) && !is.empty(values.money)) {
            data.reimb_money = values.money;
          }
          // 合同租期起始时间
          if (existy(values.contractDateRanage) && !is.empty(values.contractDateRanage) && Array.isArray(values.contractDateRanage)) {
            data.contract_start_date = moment(values.contractDateRanage[0]).format('YYYY-MM-DD');
            data.contract_end_date = moment(values.contractDateRanage[1]).format('YYYY-MM-DD');
          }
          // 月租金
          if (existy(values.monthRent) && !is.empty(values.monthRent)) {
            data.month_rent = values.monthRent;
          }
          // 每次付款月数
          if (existy(values.month) && !is.empty(values.month)) {
            data.pay_time = values.month;
          }
          // 提前付款天数
          if (existy(values.days) && !is.empty(values.days)) {
            data.payment_date = parseFloat(values.days);
          }
          // 成本中心(1:项目 2:项目主体 3:城市 4:商圈 5:骑士)
          if (is.existy(values.expense.costCenter) && !is.empty(values.expense.costCenter)) {
            data.cost_center = parseFloat(values.expense.costCenter);
          }
          // 成本归属(6:平均分摊 7:单量比例分摊 8:自定义分摊)
          if (is.existy(values.expense.costCenter) && !is.empty(values.expense.costCenter)) {
            data.cost_belong = parseFloat(values.expense.costBelong);
          }
          // 收款信息
          if (is.existy(values.expense.costItems) && !is.empty(values.expense.costItems)) {
            const items = values.expense.costItems;
            const cost = [];
            // 因为首款信息可以有多条所以是数组先循环
            items.forEach((item) => {
              const per = {};
              for (const key in item) {
                if (item.hasOwnProperty(key)) {
                  // // 如果属性值不是undefined或者0
                  if (item[key] != undefined) {
                    // 就单独转换属性名
                    per[transKey(key)] = item[key];
                  }
                }
              }
              cost.push(per);
            });
            data.cost_belong_items = cost;
          }
          // 备注
          if (existy(values.note) && !is.empty(values.note)) {
            data.desc = values.note;
          }
          // 科目
          if (is.existy(values.subjects.subjectOne) && !is.empty(values.subjects.subjectOne)) {
            data.catalog_id = values.subjects.subjectOne;
          }
          // 科目
          if (is.existy(values.subjects.subjectTwo) && !is.empty(values.subjects.subjectTwo)) {
            data.catalog_id = values.subjects.subjectTwo;
          }
          // 科目
          if (is.existy(values.subjects.subjectThree) && !is.empty(values.subjects.subjectThree)) {
            data.catalog_id = values.subjects.subjectThree;
          }
          // 文件列表
          if (existy(values.files_address) && !is.empty(values.files_address)) {
            data.files_address = values.files_address;
          }
          // 收款人信息
          if (existy(values.bankName) && !is.empty(values.bankName)) {
            data.payee_info = {
              address: values.bankName,    // 开户行
              card_num: values.payeeAccount,  // 银行卡号
              name: values.payee,  // 收款人
            };
          }
          // 科目id
          if (existy(values.catalog_id) && !is.empty(values.catalog_id)) {
            data.catalog_id = values.catalog_id;
          }
          // 申请人id
          if (existy(values.apply_account) && !is.empty(values.apply_account)) {
            data.apply_account = values.apply_account;
          }
          // 房屋状态
          if (existy(values.thing_state) && !is.empty(values.thing_state)) {
            data.thing_state = values.thing_state;
          }
          // 费用类型
          if (existy(values.costclass_id) && !is.empty(values.costclass_id)) {
            data.costclass_id = values.costclass_id;
          }
          // 订单号
          if (existy(values.order_id) && !is.empty(values.order_id)) {
            data.order_id = values.order_id;
          }
          // 申请单 初创、续租（批量） 薪资单列表（批量）
          if (existy(values.apply_id_list) && !is.empty(values.apply_id_list)) {
            data.apply_id_list = values.apply_id_list;
          }
          // 判断创建页面 1 初创新增 2 续租、批量续租 3 批量缓发薪资
          if (existy(values.c_type) && !is.empty(values.c_type)) {
            data.c_type = values.c_type;
          }

          return data;
        };
        const result = yield call(typeApplyEditS, transPayload(payload));
        if (result === undefined) {
          return;
        }
        if (result.ok) {
          // 如果成功后退返回列表页
          window.history.back(-1);
        }
      },

    // 费用申请费用申请单编辑--断租／续租／退租／续签
    * typeApplyEditRentE({ payload }, { call, put }) {
      const result = yield call(typeApplyEditS, payload);
      if (result === undefined) {
        return;
      }
      if (result.ok) {
        // 如果成功后退返回列表页
        window.history.back(-1);
      }
    },

    // 费用申请删除费用申请单审批
    * typeApplyDeleteE({ payload }, { call, put }) {
      const result = yield call(typeApplyDeleteS, payload);
      if (result === undefined) {
        return;
      }
      if (result.ok) {
        message.success('操作成功');
        yield put({
          type: 'typeApplyListE',
          payload: {
            examineflow_id: payload.examine_id,
            limit: 30,
            page: 1,
          },
        });
      }
    },
    // 费用申请提交费用申请单审批
    * submitTypeApplyGroupE({ payload }, { call, put }) {
      const result = yield call(submitTypeApplyGroupS, payload);
      if (result === undefined) {
        return;
      }
      if (result.ok) {
        message.success('操作成功');
        window.location.href = '#/Expense/Manage/Audit';
      }
    },

    // 获取审批流列表
    * getExamineSimpleNameE({ payload }, { call, put }) {
      const result = yield call(getExamineSimpleNameS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getExamineSimpleNameR', payload: result.result });
    },

    // 审批单详情接口
    * getExamineSimpleDetailE({ payload }, { call, put }) {
      const result = yield call(getExamineSimpleDetailS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getExamineSimpleDetailR', payload: result.result });
    },

    // --------------------审批单--------------------
    // 获取费用审核的数据
    * getApprovalListE({ payload }, { call, put }) {
      const result = yield call(getApprovalListS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getApprovalListR', payload: result });
    },

    // 审批单进度
    * getApprovalProcessE({ payload }, { call, put }) {
      const result = yield call(getApprovalProcessS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getApprovalProcessR', payload: result });
    },

    // 审批
    * approvalEditE({ payload }, { call, put }) {
      const result = yield call(approvalEditS, payload);
      if (result === undefined) {
        return;
      }
      if (result.ok) {
        message.success('审批成功');
        yield put({ type: 'getApprovalListE', payload: { limit: 30, page: 1 } });
      }
    },

    // -------------记录明细-----------------
    // 记录明细列表
    * getRecordListE({ payload }, { call, put }) {
      const result = yield call(getRecordListS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getRecordListR', payload: result });
    },

    // 续租/断租/续签/退租
    * recordEditE({ payload }, { call, put }) {
      const summaryId = payload.summaryId;
      delete payload.summaryId;
      const result = yield call(recordEditS, payload);
      if (result === undefined) {
        return;
      }
      if (result.ok) {
        yield put({ type: 'recordEditR', payload: result._id });
        // 获取审批单详情的基本信息
        // yield put({ type: 'getExamineSimpleDetailE', payload: { examine_id: result._id } });
        // 获取审批单详情的列表数据
        // yield put({ type: 'typeApplyListE', payload: { examineflow_id: result._id, limit: 30, page: 1 } });

        window.location.href = `/#/Expense/Manage/Records/Summary/Create?recordId=${result._id}&houseState=${payload.thing_state}&summaryId=${summaryId}`;
      }
    },
    // 批量续租
    * batchRecordEditE({ payload }, { call, put }) {
      // const summaryId = payload.summaryId;
      // delete payload.summaryId;
      const result = yield call(submitTypeApplyS, payload);
      if (result === undefined) {
        return;
      }
      if (result.ok) {
        // 获取审批单详情的基本信息
        // yield put({ type: 'getExamineSimpleDetailE', payload: { examine_id: result._id } });
        // 获取审批单详情的列表数据
        // yield put({ type: 'typeApplyListE', payload: { examineflow_id: result._id, limit: 30, page: 1 } });
        yield put({ type: 'recordEditR', payload: result._id });
        // 把id带上跳转到编辑列表页，因为需要带上后台返回的订单id
        window.location = `/#/Expense/Manage/Records/Summary/Create?&houseState=${ExpenseHouseState.continue}&recordId=${result._id}`;
      }
    },
  },
  reducers: {
    // 费用申请租房生成唯一房屋编号
    getUniqueHouseNumR(state, action) {
      return {
        ...state,
        uniqueHouseNum: action.payload,
      };
    },
    // 费用申请获得费用类型名称
    getTypeNameListR(state, action) {
      return {
        ...state,
        typeNameList: action.payload,
      };
    },
    // 费用申请记录列表
    typeApplyListR(state, action) {
      return {
        ...state,
        typeApplyList: action.payload,
      };
    },
    // 费用申请费用申请单详情
    typeApplyDetailR(state, action) {
      return {
        ...state,
        typeApplyDetail: action.payload,
      };
    },
    // 审批单列表
    getApprovalListR(state, action) {
      return {
        ...state,
        approvalList: action.payload,
      };
    },
    // 审批单进度
    getApprovalProcessR(state, action) {
      return {
        ...state,
        approvalProcess: action.payload,
      };
    },
    // 记录明细列表
    getRecordListR(state, action) {
      return {
        ...state,
        getRecordList: action.payload,
      };
    },
    // 获取审批流列表
    getExamineSimpleNameR(state, action) {
      return {
        ...state,
        examineSimpleNameList: action.payload,
      };
    },
    // 审批单详情接口
    getExamineSimpleDetailR(state, action) {
      return {
        ...state,
        examineSimpleDetail: action.payload,
      };
    },
    // 断租等传id
    recordEditR(state, action) {
      return {
        ...state,
        recordEdit: action.payload,
      };
    },
    dispatchingR(state, action) {
      return {
        ...state,
        dispatching: action.payload,
      };
    },
  },
};
