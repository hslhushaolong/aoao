/**
 * system Model
 **/
import { message } from 'antd';
import dot from 'dot-prop';
import {
  getAccountList,
  addAccount,
  updateAccount,
  getApproveList,
  getSupplierList,
  editSupplier,
  addSupplierAreaS,
  getSupplierDetailS,
  getNotSupplierS,
  getCompanyList,
  editCompany,
  addCompany,
  addKnightType,
  editKnightType,
  getKnightType,
  getHandleErrStaff,             // 已经处理的异常账号信息
  getAccountsList,               // 获取关联账号列表
  getAllAccounts,                // 获取所有有效账号
  getAddAccounts,                // 添加关联账号
  getEditAccounts,               // 编辑关联账号
  getBusinessDistributionS,      // 获取业务分部情况信息
  getCityDistributionS,          // 获取城市分部情况
  bizSetUpS,
  getSalarySpecifications,      // 获取薪资指标模板
  updateBizDistrict,            // 更新商圈禁用状态
  removeBizDistrict,            // 移除商圈
} from './../services/system';
import { getEmployeeDetailS, getEmployeeListS, editEmployeeS } from './../services/employee';
import { getAreas } from './../services/account';
import aoaoBossTools from './../utils/util';
import Modules from '../application/define/modules';
import { authorize } from '../application';
import { copyNotEmptyProperty } from '../application/utils';

export default {

  namespace: 'system',
  state: {
    loading: false, // 添加用户loading
    editLoading: false, //
    // 账户列表
    accountList: {
      _meta: {
        result_count: 0,
      },
      data: [],
    },
    // 离职申请后的员工详情以及添加账户的待筛选员工列表 数据格式为以下 不可更改去除data属性
    employeeDetail: {
      data: [],
      state: 50,  // staff/get_staff_info  50在职，-50离职， 1离职待审核
    },
    // 审批人列表
    approveList: {
      superior_list: [],
    },
    // 城市平台信息
    platformList: {
      platform: [],
      cityList: [],
      areaList: [],
    },
    // 供应商列表
    supplierList: {
      data: [],
      _meta: {
        has_more: true,
        result_count: 0,
      },
    },
    // 所有供应商信息
    allSupplierList: {
      data: [],
      _meta: {
        has_more: true,
        result_count: 0,
      },
    },
    // 供应商详情
    supplierDetail: {
      _id: '',  // id
      biz_district_info_list: [],   // 商圈列表
      supplier_name: '',            // 供应商名字
      supplier_id: '', // 供应商id
      state: '', // 状态
      created_at: '', // 创建时间
      disable_at: '', // 禁用时间
      updated_at: '', // 最新操作时间
      operator_name: '', // 最新操作人
    },
    // 没有商圈的供应商
    notSupplierDistrict: [],
    // 所有商圈信息
    areaList: {
      biz_district_list: [],
    },
    // 三方公司列表
    companyList: {
      _meta: {
        has_more: true,
        result_count: 10,
      },
      data: [],
    },
    // 三方公司列表控制table Loading状态
    confirmLoading: true,
    // 是否创建用户成功
    isCreateUserSuccess: false,
    // 骑士类型列表
    knightTypeList: {
      data: [],
      _meta: {
        has_more: true,
        result_count: 0,
      },
    },
    // 已处理的账号列表
    handleErrStaff: {
      data: [],
      _meta: {
        has_more: true,
        result_count: 0,
      },
    },
    // 关联账号列表
    accountsList: {
      data: [],
      _meta: {
        has_more: true,
        result_count: 0,
      },
    },
    // 所有有效账号
    allAccounts: [],
    visible: false,              // 控制模态框
    isOperationSuccess: false,   // 控制是否提交成功
    // 业务分配列表
    distributeList: {
      data: [],
      _meta: {
        has_more: true,
        result_count: 0,
      },
    },
    // 业务分配列表
    cityDistributeList: {
      data: [],
      _meta: {
        has_more: true,
        result_count: 0,
      },
    },
    salarySpecifications: {}, // 骑士薪资指标
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;
        const [limit, page] = [30, 1]; // 默认的分页以及每页数据条数
        switch (pathname) {
          // 供应商详情
          case '/System/EditSupplier':
            dispatch({
              type: 'getSupplierDetailE',
              payload: {
                _id: location.query.id,
              },
            });
            break;
          case '/Salary/Task':
            dispatch({
              type: 'getSupplierListE',
              payload: {
                permission_id: Modules.ModuleSystemSupplier.id,
                limit: 1000,
                page: 1,
                option: false,  // 查找所有的供应商-支持查询供应名称和id
              },
            });
            break;
          // 新建薪资模板请求供应商列表
          case '/Salary/Setting/Create':
            dispatch({
              type: 'getSupplierListE',
              payload: {
                permission_id: Modules.ModuleSystemSupplier.id,
                limit: 1000,
                page: 1,
                option: false,  // 查找所有的供应商-支持查询供应名称和id
              },
            });
            break;
          // 所有供应商
          case '/System/Supplier':
            dispatch({
              type: 'getSupplierListE',
              payload: {
                permission_id: Modules.ModuleSystemSupplier.id,
                limit: 1000,
                page: 1,
                option: false,  // 查找所有的供应商-支持查询供应名称和id
              },
            });
            dispatch({
              type: 'getAllSupplierListE',
              payload: {
                permission_id: Modules.ModuleSystemSupplier.id,
                limit: 1000,
                page: 1,
                option: false,  // 查找所有的供应商-查询条件使用
              },
            });
            dispatch({
              type: 'getAllAreaListE',
              payload: {
                all_biz_district: 100,  // 是否获取全部商圈(传100获取所有商圈) platform/get_biz_district
              },
            });
            break;
          case '/System/Supplier/Detail':
            dispatch({
              type: 'getSupplierDetailE',
              payload: {
                _id: location.query.id,
              },
            });
            break;
          // 用户列表
          case '/System/User':
            dispatch({
              type: 'getAccountListE',
              payload: {
                limit,
                page,
                state: '100', // 状态(100:启用 -100:禁用) account/gain_account_list文档
                permission_id: Modules.ModuleSystemUser.id,
              },
            });
            break;
          // 用户详情
          case '/Account/PersonalLeave':
            // 获取审批人列表
            dispatch({ type: 'getApproveListE', payload: {} });
            break;

          // 页面产品取消了
          // 字段管理
          case '/System/Field':
            // dispatch({
            // type: '',
            // payload: {},
            // });
            break;
          // 页面产品取消了
          // 指标管理
          case '/System/Target':
            // dispatch({
            // type: '',
            // payload: {},
            // });
            break;
          // 获取三方公司列表
          case '/System/OperationManage':
          case '/Employee/Search':
            dispatch({
              type: 'getCompanyListE',
              payload: `limit=10&page=1&supplier_id=${aoaoBossTools.readDataFromLocal(1, 'supplier_id')}&permission_id=${Modules.ModuleSystemOperationManage.id}`,
            });
            break;
          // 骑士类型设置
          case '/System/KnightType':
            dispatch({
              type: 'getKnightTypeE',
              payload: {
                permission_id: Modules.ModuleSystemKnightType.id,
                account_id: aoaoBossTools.readDataFromLocal(1, 'account_id'),
                limit: 30,
                page: 1,
                state: 60,  // 启用状态
              },
            });
            break;
          // 薪资模版的创建页面
          case '/Salary/Setting/Create':
            dispatch({
              type: 'getKnightTypeE',
              payload: {
                account_id: aoaoBossTools.readDataFromLocal(1, 'account_id'),
                permission_id: Modules.ModuleSalarySettingCreate.id,
                state: 60,  // 启用状态
                limit: 999,
                page: 1,
              },
            });
            break;
          // 薪资模版的创建页面
          case '/System/Range/Supplier':
            dispatch({
              type: 'getBusinessDistributionE',
              payload: {
                limit,
                page,
              },
            });
            break;
          // 薪资模版的创建页面
          case '/System/Range/City':
            dispatch({
              type: 'getCityDistributionE',
              payload: {
                limit,
                page,
              },
            });
            break;
          case '/System/SalaryIndex':
            dispatch({
              type: 'getSalarySpecificationsE',
              payload: {
                permission_id: Modules.ModuleSystemSalaryIndex.id,
              },
            });
            break;
          default:
            break;
        }
      });
    },
  },

  effects: {
    // 获取账户列表
    *getAccountListE({ payload }, { call, put }) {
      // 亚军的内部方法，从localstorage里取值的标志位
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = account_id;
      const result = yield call(getAccountList, payload);
      yield put({ type: 'getAccountListR', payload: result });
    },

    // 获取员工详情列表
    *getEmployeeDetailOneE({ payload }, { call, put }) {
      const staffId = aoaoBossTools.readDataFromLocal(1, 'staff_id');
      payload.staff_id = staffId;
      if (!payload.permission_id) {
        payload.permission_id = Modules.ModuleEmployeeUpdate.id;
      }
      const result = yield call(getEmployeeDetailS, payload);
      yield put({ type: 'getEmployeeDetailOneR', payload: result });
    },

    // 获取员工列表
    *getEmployeeListOfAccountE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const biz_district_id_list = payload.biz_district_id_list; // 存储商圈列表
      const value = payload;
      payload = aoaoBossTools.ItemOfArrayToNubmer(value); // 转换参数数据格式
      payload.biz_district_id_list = biz_district_id_list; // 商圈列表参数为string,需提前存储
      const result = yield call(getEmployeeListS, payload);
      yield put({ type: 'getEmployeeDetailOneR', payload: result });
    },

    // 获取审批人列表
    *getApproveListE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(getApproveList, payload);
      yield put({ type: 'getApproveListR', payload: result });
    },

    // 提出离职申请
    *leaveApplication({ payload }, { call, put }) {
      const staffId = aoaoBossTools.readDataFromLocal(1, 'staff_id');
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.staff_id = staffId;
      payload.account_id = account_id;
      const result = yield call(editEmployeeS, payload);
      if (result.ok) {
        message.success('申请成功');
        yield put({ type: 'getEmployeeDetailOneE', payload: { permission_id: Modules.ModuleAccountResign.id } });
      }
    },

    // 添加账户
    *addAccountE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = account_id;
      // 页数
      const current = payload.current;
      delete payload.current;
      const result = yield call(addAccount, payload);
      // 是否请求结束
      yield put({ type: 'updateLoadingR', payload: false });
      if (result.ok) {
        message.success('添加成功');
        // 获取账户列表
        yield put({
          type: 'getAccountListE',
          payload: {
            limit: 30,
            page: current,  // 页数
            state: '100', // 状态启用
            permission_id: Modules.ModuleSystemUser.id,
          },
        });
        yield put({ type: 'reduceCreateAccount', payload: { isCreateUserSuccess: true } });
      }
    },
    // 开启loading
    *updateLoading({ payload }, { call, put }) {
      yield put({ type: 'updateLoadingR', payload: true });
    },
    // 编辑loading
    *updateEditLoading({ payload }, { call, put }) {
      yield put({ type: 'updateEditLoadingR', payload: true });
    },
    // 编辑账户信息
    *updateAccountE({ payload }, { call, put }) {
      const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = account_id;
      // 页数
      const current = payload.current;
      delete payload.current;
      const result = yield call(updateAccount, payload);
      // 是否请求结束：关闭loading
      yield put({ type: 'updateEditLoadingR', payload: false });
      if (result.ok) {
        message.success('账户更新成功');
        // 提交成功后回调
        yield put({
          type: 'getAccountListE',
          payload: {
            limit: 30,
            page: current,  // 页数
            state: '100', // 状态启用
            permission_id: Modules.ModuleSystemUser.id,
          },
        });
      }
    },

    // 重置创建账户成功的状态
    *resetCreateAccountE({ payload }, { call, put }) {
      yield put({ type: 'reduceCreateAccount', payload: { isCreateUserSuccess: false } });
    },

    // 获取供应商列表
    *getSupplierListE({ payload }, { call, put }) {
      // 超管请求供应商
      const result = yield call(getSupplierList, payload);
      yield put({ type: 'getSupplierListR', payload: result });
    },

    // 获取所有供应商列表
    *getAllSupplierListE({ payload }, { call, put }) {
      const result = yield call(getSupplierList, payload);
      yield put({ type: 'getAllSupplierListR', payload: result });
    },

    // 禁用供应商
    *disableSupplierE({ payload }, { call, put }) {
      if (payload.queryId) {
        const queryId = payload.queryId;
        delete payload.queryId;
        const result = yield call(editSupplier, payload);
        if (result.ok) {
          message.success('操作成功');
          yield put({
            type: 'getSupplierDetailE',
            payload: {
              _id: queryId,
            },
          });
        }
      } else if (payload.searchParam) {
        const searchParam = payload.searchParam;
        delete payload.searchParam;
        const result = yield call(editSupplier, payload);
        if (result.ok) {
          message.success('操作成功');
          yield put({
            type: 'getSupplierListE',
            payload: searchParam,
          });
        }
      }
    },

    // 添加供应商
    *addSupplierAreaE({ payload }, { call }) {
      const result = yield call(addSupplierAreaS, payload);
      if (result.ok) {
        message.success('添加成功');
        location.href = '/#/System/Supplier';
      }
    },

    // 获取供应商详情
    *getSupplierDetailE({ payload }, { call, put }) {
      const result = yield call(getSupplierDetailS, payload);
      yield put({ type: 'getSupplierDetailR', payload: result });
    },

    // 获取没有供应商的商圈
    *getNotSupplierE({ payload }, { call, put }) {
      const result = yield call(getNotSupplierS, payload);
      yield put({ type: 'getNotSupplierR', payload: result });
    },
    // 获取所有商圈
    *getAllAreaListE({ payload }, { call, put }) {
      const result = yield call(getAreas, payload);
      yield put({ type: 'getAllAreaListR', payload: result });
    },

    // 获取三方公司信息列表
    *getCompanyListE({ payload }, { call, put }) {
      if (aoaoBossTools.readDataFromLocal(1, 'supplier_id') !== '') {
        const result = yield call(getCompanyList, payload);
        yield put({ type: 'getCompanyListR', payload: result });
      } else {
        console.warn('当前账号供应商缺失');
      }
    },

    // 编辑三方公司信息
    *editCompanyE({ payload }, { call, put }) {
      yield put({ type: 'showLoadingR', payload: {} });
      const result = yield call(editCompany, payload);

      if (result.ok) {
        message.success('操作成功');
        yield put({
          type: 'getCompanyListE',
          payload: `limit=10&page=${payload.page}&supplier_id=${aoaoBossTools.readDataFromLocal(1, 'supplier_id')}&permission_id=${Modules.ModuleSystemOperationManage.id}`,
        });
      } else {
        yield put({ type: 'showLoadingFalseR', payload: {} });
      }
    },

    // 增加三方公司信息
    *addCompanyE({ payload }, { call, put }) {
      yield put({ type: 'showLoadingR', payload: {} });
      const result = yield call(addCompany, payload);
      if (result.ok) {
        message.success('操作成功');
        yield put({
          type: 'getCompanyListE',
          payload: `limit=10&page=${payload.page}&supplier_id=${aoaoBossTools.readDataFromLocal(1, 'supplier_id')}&permission_id=${Modules.ModuleSystemOperationManage.id}`,
        });
      } else {
        yield put({ type: 'showLoadingFalseR', payload: {} });
      }
    },

    // 获取骑士类型列表
    *getKnightTypeE({ payload }, { call, put }) {
      const result = yield call(getKnightType, payload);
      yield put({ type: 'getKnightTypeR', payload: result });
    },

    // 编辑骑士类型
    *editKnightTypeE({ payload }, { call, put }) {
      const result = yield call(editKnightType, payload);
      if (result.ok) {
        message.success('操作成功');
        yield put({
          type: 'getKnightTypeE',
          payload: {
            permission_id: Modules.ModuleSystemKnightType.id,
            account_id: aoaoBossTools.readDataFromLocal(1, 'account_id'),
            limit: 30,
            page: 1,
          },
        });
        // 更新缓存
        yield put({ type: 'storage/getKnightType' });
      }
    },

    // 新建骑士类型
    *addKnightTypeE({ payload }, { call, put }) {
      const result = yield call(addKnightType, payload);
      if (result.ok) {
        message.success('操作成功');
        yield put({
          type: 'getKnightTypeE',
          payload: {
            permission_id: Modules.ModuleSystemKnightType.id,
            account_id: aoaoBossTools.readDataFromLocal(1, 'account_id'),
            limit: 30,
            page: 1,
          },
        });
        // 更新缓存
        yield put({ type: 'storage/getKnightType' });
      } else {
        message.error('操作失败');
      }
    },

    // 获取已处理异常账号列表
    *getHandleErrStaffE({ payload }, { call, put }) {
      const params = {
        page: dot.get(payload, 'page', 1),
        limit: dot.get(payload, 'limit', 30),
      };
      if (dot.has(payload, 'platform_code')) {
        params.platform_code = payload.platform_code;
      }
      const result = yield call(getHandleErrStaff, payload);
      if (result == undefined) {
        return;
      }
      yield put({ type: 'getHandleErrStaffR', payload: result });
    },

    // 关联账号列表
    *getAccountsListE({ payload }, { call, put }) {
      const params = {
        page: dot.get(payload, 'page', 1),
        limit: dot.get(payload, 'limit', 10),
        state: 100,      // 启用状态
      };

      if (dot.has(payload, 'account_id')) {
        params.account_id = payload.account_id;
      }
      const result = yield call(getAccountsList, params);
      if (result !== undefined) {
        yield put({ type: 'getAccountsListR', payload: result });
      }
    },

    // 有效账号
    *getAllAccountsE({ payload }, { call, put }) {
      const result = yield call(getAllAccounts);
      if (result !== undefined) {
        // 存储所有有效账号
        authorize.phones = result;
        yield put({ type: 'getAllAccountsR', payload: result });
      }
    },

    // 添加账号
    *getAddAccountsE({ payload }, { call, put }) {
      const result = yield call(getAddAccounts, payload);
      if (dot.get(result, 'ok')) {
        // 操作成功后，清除表单数据
        yield put({ type: 'updateOperationState', payload: true });
        // 刷新列表
        yield put({ type: 'getAccountsListE' });
      }
    },

    // 编辑账号、删除账号
    *getEditAccountsE({ payload }, { call, put }) {
      const result = yield call(getEditAccounts, payload);
      if (dot.get(result, 'ok')) {
        // 编辑成功后，清除表单数据
        if (dot.has(payload, 'account_ids') && payload.account_ids.length > 0) {
          yield put({ type: 'updateOperationState', payload: true });
        }
        // 刷新列表
        yield put({ type: 'getAccountsListE' });
      }
    },

    // 获取商圈分布情况
    *getBusinessDistributionE({ payload }, { call, put }) {
      // 组装数据
      const { page, limit, params = {} } = payload;
      const tempParams = {
        page,
        limit,
        supplier_id_list: params.supplier,
        platform_code_list: params.platform,
        city_spelling_list: params.city,
        biz_district_id_list: params.district,
        biz_district_id: params.districtId,
        allot: Number(params.distributeType),
        state: Number(params.state),
      };
      const result = yield call(getBusinessDistributionS, copyNotEmptyProperty(tempParams));
      yield put({ type: 'getBusinessDistributionR', payload: result });
    },
    // 获取城市分布情况
    *getCityDistributionE({ payload }, { call, put }) {
      // 组装数据
      const { page, limit, params = {} } = payload;
      const tempParams = {
        page,
        limit,
        supplier_id_list: params.supplier,
        platform_code_list: params.platform,
        city_spelling_list: params.city,
        allot: Number(params.distributeType),
      };
      const result = yield call(getCityDistributionS, copyNotEmptyProperty(tempParams));
      yield put({ type: 'getCityDistributionR', payload: result });
    },
    // 商圈设置修改
    *bizSetUpE({ payload }, { call, put }) {
      const tempParams = {
        biz_district_id: payload.biz_district_id,
        remind: payload.flag,
      };
      // 组装数据
      const result = yield call(bizSetUpS, tempParams);
      if (result.ok) {
        yield put({
          type: 'getBusinessDistributionE',
          payload: {
            limit: payload.limit,
            page: payload.page,
            params: payload.params,
          },
        });
        message.success('修改成功', 1);
      }
    },
    // 薪资指标模板
    *getSalarySpecificationsE({ payload }, { call, put }) {
      // 组装数据
      const result = yield call(getSalarySpecifications, payload);
      if (result.salary_specifications) {
        yield put({
          type: 'getSalarySpecificationsR',
          payload: result.salary_specifications.view_data,
        });
      }
    },
    // 更新商圈分布情况
    *updateBizDistrictE({ payload }, { call, put }) {
      const { biz_district_id, state, index } = payload;
      const tempParam = {
        biz_district_id,
        state,
      };
      // 组装数据
      const result = yield call(updateBizDistrict, tempParam);
      if (result.ok) {
        message.success('操作成功', 1);
        yield put({
          type: 'updateBizDistrictR',
          payload: {
            index,
            stateCode: state,
          },
        });
      }
    },
    // 更新商圈分布情况
    *removeBizDistrictE({ payload }, { call, put }) {
      const { biz_district_id, supplier_id } = payload;
      const tempParam = {
        biz_district_list: Array.isArray(biz_district_id) ? biz_district_id : [biz_district_id],
        supplier_id,
      };
      // 组装数据
      const result = yield call(removeBizDistrict, tempParam);
      yield put({
        type: 'getSupplierDetailE',
        payload: {
          _id: supplier_id,
        },
      });
    },
  },

  reducers: {
    // 账户列表
    getAccountListR(state, action) {
      return {
        ...state,
        accountList: action.payload,
      };
    },

    // 员工详情列表
    getEmployeeDetailOneR(state, action) {
      return {
        ...state,
        employeeDetail: action.payload,
      };
    },

    // 审批人列表
    getApproveListR(state, action) {
      return {
        ...state,
        approveList: action.payload,
      };
    },

    // 员工详情级联数据
    platformListR(state) {
      const platform = aoaoBossTools.readDataFromLocal(1, 'region'); // 平台数据
      const platFormCode = aoaoBossTools.getArrayFormObject(platform, 'platform_code'); // 平台id列表
      const cityList = aoaoBossTools.getArrayFromIndex(platform, platFormCode, 'city_name_joint'); // 城市数据
      const cityIdList = aoaoBossTools.getArrayFormObject(cityList, 'city_spelling'); // 城市id列表
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

    // 供应商列表
    getSupplierListR(state, action) {
      return {
        ...state,
        supplierList: action.payload,
      };
    },

    // 所有供应商信息
    getAllSupplierListR(state, action) {
      return {
        ...state,
        allSupplierList: action.payload,
      };
    },

    // 供应商详情
    getSupplierDetailR(state, action) {
      return {
        ...state,
        supplierDetail: action.payload,
      };
    },

    // 获取没有供应商的商圈
    getNotSupplierR(state, action) {
      return {
        ...state,
        notSupplierDistrict: action.payload.result,
      };
    },

    // 商圈信息
    getAllAreaListR(state, action) {
      return {
        ...state,
        areaList: action.payload,
      };
    },

    // 商圈添加列表缓存
    setAreaBundleListR(state, action) {
      const { supplierDetail } = state;
      supplierDetail.biz_district_info_list = action.payload;
      return {
        ...state,
        supplierDetail,
      };
    },

    // 获取三方公司列表
    getCompanyListR(state, action) {
      return {
        ...state,
        companyList: action.payload,
        confirmLoading: false,
      };
    },

    // 获取已处理的异常账号
    getHandleErrStaffR(state, action) {
      return {
        ...state,
        handleErrStaff: action.payload,
      };
    },
    // 控制列表Loading开启状态的公共reducer
    showLoadingR(state) {
      return {
        ...state,
        confirmLoading: true,
      };
    },

    // 控制列表Loading关闭状态的公共reducer
    showLoadingFalseR(state) {
      return {
        ...state,
        confirmLoading: false,
      };
    },

    // 重置创建账户成功的状态
    reduceCreateAccount(state, action) {
      return {
        ...state,
        isCreateUserSuccess: action.payload.isCreateUserSuccess,
      };
    },

    // 重置创建账户成功的状态
    getKnightTypeR(state, action) {
      return {
        ...state,
        knightTypeList: action.payload,
      };
    },

    // 关联账号列表
    getAccountsListR(state, action) {
      return {
        ...state,
        accountsList: action.payload,
      };
    },

    // 所有有效账号
    getAllAccountsR(state, action) {
      return {
        ...state,
        allAccounts: action.payload,
      };
    },

    // 判断是否编辑成功
    updateOperationState(state, action) {
      return {
        ...state,
        isOperationSuccess: action.payload,
      };
    },
    // 获取业务分部列表
    getBusinessDistributionR(state, action) {
      return {
        ...state,
        distributeList: action.payload,
      };
    },
    // 获取业务分部列表
    getCityDistributionR(state, action) {
      return {
        ...state,
        cityDistributeList: action.payload,
      };
    },
    getSalarySpecificationsR(state, action) {
      return {
        ...state,
        salarySpecifications: action.payload,
      };
    },
    updateBizDistrictR(state, action) {
      const { index, stateCode } = action.payload;
      const { distributeList } = state;
      distributeList.data[index].state = stateCode;
      return {
        ...state,
        distributeList,
      };
    },
    removeBizDistrictR(state, action) {
      const { index } = action.payload;
      const { supplierDetail } = state;
      if (Array.isArray(index)) {
        supplierDetail.biz_district_info_list.filter((item, _index) => {
          return index.indexOf(_index) === -1;
        });
      } else {
        supplierDetail.biz_district_info_list.splice(index, 1);
      }
      return {
        ...state,
        supplierDetail,
      };
    },
    // 添加用户loading
    updateLoadingR(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    // 添加用户loading
    updateEditLoadingR(state, action) {
      return {
        ...state,
        editLoading: action.payload,
      };
    },
  },
};
