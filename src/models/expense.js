/**
 * 费用管理
 **/
import is from 'is_js';
import { message } from 'antd';
import { getSubjectNameS, buildSubjectS, getSubjectListS, editSubjectS, getExamineListS, editExamineS, getExamineNameS, buildExamineS, getExamineDetailS, getTypeListS, editTypeS, buildTypeS, getTypeDetailS } from '../services/expense';
import { authorize } from '../application';

export default {
  namespace: 'expense',
  state: {
    // 全体科目名称
    subjectData: [],
    // 一级科目名称
    subjectName: [],
    // 二级科目名称
    subjectSec: [],
    // 三级科目名称
    subjectThr: [],
    // 科目列表
    subjectList: [
      '_meta':{
        has_more:false,
        result_count:0
      },
      'data':[],
    ],
    // 审批流------------------------

    // 审批流列表
    examineList: [
      '_meta':{
        has_more:false,
        result_count:0
      },
      'data':[],
    ],

    // 申请人名字
    examineName: [],
    // 申请人名字树
    examineTree: [],
    // 保存搜索之前的examineTree
    storeExamineTree: [],
    // 审批流详情
    examineDetail: {
      _id: '',           // ID
      examine_tree: [],    // 审批流设置
      name: '',    // 审批流名称
      desc: '',   // 审批流描述
    },
    // 费用类型--------------------
    // 费用类型列表
    typeList: [
      '_meta':{
        has_more:false,
        result_count:0
      },
      'data':[],
    ],
    // 费用类型详情
    // 费用类型
    typeDetail: {
      _id: '',
      name: '',
      template: 1,  // 模版一
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;
        // 如果账号处于未登录，不进行处理
        if (authorize.isLogin() === false) {
          return;
        }
        // 获取科目名称
        if (pathname === '/Expense/Subject' || pathname === '/Expense/Manage/Template/Create' || pathname === '/Expense/Manage/Template/Update' || pathname === '/Expense/Manage/Records/Form') {
          dispatch({ type: 'getSubjectNameE' });
          dispatch({ type: 'getSubjectListE', payload: { page: 1, limit: 30 } });
        }
        // 获取审批流列表
        if (pathname === '/Expense/Examine') {
          dispatch({ type: 'getExamineListE', payload: { page: 1, limit: 30 } });
        }
        // 获取审批人列表
        if (pathname === '/Expense/Examine/Create') {
          dispatch({ type: 'getExamineNameE' });
        }
        if (pathname === '/Expense/Examine/Edit') {
          dispatch({ type: 'getExamineNameE' });
          dispatch({ type: 'getExamineDetailE', payload: { _id: location.query.id } });
        }
        // 获取费用类型列表
        if (pathname === '/Expense/Type') {
          dispatch({ type: 'getTypeListE', payload: { page: 1, limit: 30 } });
        }
        // 编辑费用类型
        if (pathname === '/Expense/Type/Edit') {
          dispatch({ type: 'getTypeDetailE', payload: { _id: location.query.id } });
        }
      });
    },
  },

  effects: {
    // 获取科目名称
    * getSubjectNameE({ payload }, { call, put }) {
      const result = yield call(getSubjectNameS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getSubjectNameR', payload: result });
    },

    // 新建科目
    * buildSubjectE({ payload }, { call, put }) {
      const result = yield call(buildSubjectS, payload);
      if (result.ok) {
        message.info('新建科目成功');
        yield put({ type: 'getSubjectListE', payload: { page: 1, limit: 30 } });
      }
    },

    // 编辑科目
    * editSubjectE({ payload }, { call, put }) {
      const result = yield call(editSubjectS, payload);
      if (result.ok) {
        message.info('操作成功');
        yield put({ type: 'getSubjectListE', payload: { page: 1, limit: 30 } });
      }
    },

    // 获取科目列表
    * getSubjectListE({ payload }, { call, put }) {
      const result = yield call(getSubjectListS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getSubjectListR', payload: result });
    },
    // 审批流 ---------------------
    // 获取审批流列表
    * getExamineListE({ payload }, { call, put }) {
      const result = yield call(getExamineListS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getExamineListR', payload: result });
    },

    // 编辑审批流
    * editExamineE({ payload }, { call, put }) {
      const result = yield call(editExamineS, payload);
      if (result.ok) {
        message.info('操作成功');
        yield put({ type: 'getExamineListE', payload: { page: 1, limit: 30 } });
      }
    },

    // 编辑审批流
    * editExamineNameE({ payload }, { call, put }) {
      const result = yield call(editExamineS, payload);
      if (result.ok) {
        message.info('操作成功');
        window.location.href = '/#/Expense/Examine';
      }
    },

    // 获取审批流名称
    * getExamineNameE({ payload }, { call, put }) {
      const result = yield call(getExamineNameS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getExamineNameR', payload: result });
    },

    // 新建审批流
    * buildExamineE({ payload }, { call }) {
      const result = yield call(buildExamineS, payload);
      if (result.ok) {
        window.location.href = '/#/Expense/Examine';
      }
    },

    // 获取审批流详情
    * getExamineDetailE({ payload }, { call, put }) {
      const result = yield call(getExamineDetailS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getExamineDetailR', payload: result });
    },

    // 费用类型 ---------------------
    // 获取费用类型列表
    * getTypeListE({ payload }, { call, put }) {
      const result = yield call(getTypeListS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getTypeListR', payload: result });
    },

    // 编辑费用类型
    * editTypeE({ payload }, { call, put }) {
      const result = yield call(editTypeS, payload);
      if (result.ok) {
        message.info('操作成功');
        yield put({ type: 'getTypeListE', payload: { page: 1, limit: 30 } });
      }
    },

    // 编辑审批流
    * editTypeNameE({ payload }, { call }) {
      const result = yield call(editTypeS, payload);
      if (result.ok) {
        message.info('操作成功');
        window.location.href = '/#/Expense/Type';
      }
    },

    // 新建费用类型
    * buildTypeE({ payload }, { call, put }) {
      const result = yield call(buildTypeS, payload);
      if (result.ok) {
        window.location.href = '/#/Expense/Type';
      }
    },

    // 获取费用类型详情
    * getTypeDetailE({ payload }, { call, put }) {
      const result = yield call(getTypeDetailS, payload);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'getTypeDetailR', payload: result });
    },
  },

  reducers: {
    // 获取科目名称
    getSubjectNameR(state, action) {
      const data = action.payload.result;
      const treeData = [];
      const treeSec = [];
      const treeThr = [];

      // 循环所有名称，讲不同级别加入对应数组
      for (let i = 0; i < data.length; i++) {
        if (data[i].level === 3) {   // 级别3
          treeThr.push(data[i]);
        } else if (data[i].level === 2) {   // 级别2
          treeSec.push(data[i]);
        } else {   // 级别1
          treeData.push(data[i]);
        }
      }
      // 将三级科目加入二级科目的childre字段中
      treeSec.forEach((item) => {
        item.children = [];
        treeThr.forEach((term) => {
          if (term.parent_id === item._id) {
            item.children.push(term);
          }
        });
      });
      // 将二级科目加入一级科目的childre字段中
      treeData.forEach((item) => {
        item.children = [];
        treeSec.forEach((term) => {
          if (term.parent_id === item._id) {
            item.children.push(term);
          }
        });
      });
      return {
        ...state,
        subjectName: treeData,     // 全部科目树
        subjectSec: treeSec,    // 全部二级科目
        subjectData: action.payload.result,   // 后端返回的原始数据格式
        subjectThr: treeThr,    // 全部三级科目
      };
    },
    // 获取科目列表
    getSubjectListR(state, action) {
      return {
        ...state,
        subjectList: action.payload,
      };
    },

    // 审批流------------------
    // 获取科目列表
    getExamineListR(state, action) {
      return {
        ...state,
        examineList: action.payload,
      };
    },
    // 获得科目名字
    getExamineNameR(state, action) {
      const data = action.payload;
      let position = [];
      const tree = [];
      const resource = [];
      // 将所有的职位字段加入数组
      for (let i = 0; i < data.length; i++) {
        position.push(data[i].gid);
      }
      // 数组去重，得到不重复的数组
      position = [...new Set(position)];
      // 将职位字段设置为不可选状态
      position.forEach((item) => {
        tree.push([{
          title: authorize.roleNameById(item),
          disabled: true,
          key: item.toString(),
        }]);
      });
      // 循环所有后台数据
      data.forEach((item) => {
        tree.forEach((branch) => {
          // 循环建成的树
          if (item.gid == branch[0].key) {
            // 将数据组装成姓名加电话的形式展示
            branch.push({
              title: `${item.name} ${item.phone}`,
              disabled: false,
              key: item._id,
            });
          }
        });
      });
      // 将所有数组加入resource展成一纬数组
      tree.forEach((item) => {
        item.forEach((it) => {
          resource.push(it);
        });
      });
      return {
        ...state,
        examineName: action.payload,    // 申请人名字
        examineTree: resource,     // 申请人名字树
      };
    },

    // 获取审批流详情
    getExamineDetailR(state, action) {
      return {
        ...state,
        examineDetail: action.payload,
      };
    },

    // 费用类型------------------
    // 获取费用类型列表
    getTypeListR(state, action) {
      return {
        ...state,
        typeList: action.payload,
      };
    },

    // 获取费用类型详情
    getTypeDetailR(state, action) {
      return {
        ...state,
        typeDetail: action.payload,
      };
    },
  },
};
