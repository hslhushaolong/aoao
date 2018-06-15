/**
 * stores Model
 * */
import { message } from 'antd';
import {
getStorgeMaterials,
getChangeOfMaterials,
getMessageOfItemList,
getPickOrderDetailS,
addItemIntoStore,
editItemOfStore,
getMaterialsDetail,
getKnightMaterialsDetail,
getDistributeOrderListS,
editOrderToErrorListS,
editDistributeOrderS,
createDistributeOrderS,
getDistributeDetailS,
getPickOrderListS,
createNewOrderS,
auditSingleS,
} from './../services/stores.js';
import { getEmployeeListS } from './../services/employee';
import aoaoBossTools from './../utils/util';
import { Position } from '../application/define';
import Modules from '../application/define/modules';
import { authorize } from '../application';

export default {

  namespace: 'materials',
  state: {
    // 库存列表
    materialsList: {
      total_count: '',  // 总量
      supplier_id: '',  // 供应商id
      material_stock_list: [],  // 物资库存量
    },

    // 变动明细详情
    changeDetail: {
      platform_name: '',  // 平台
      begin_stock_amount: '',  // 区初存量
      end_stock_amount: '',  // 区末存量
      city_name: '',  // 城市名
      total_count: '', // 总量
      material: '', // 物资
      material_stock_detail_list: [],  // 物资库存详情
    },

    // 品目列表
    itemList: {
      material_list: [],  // 物资列表
    },

    // 品目详情
    itemDetail: {
      material_name: '',  // 物资名
      material_type: '',  // 物资类型
      purchase_price: '',  // 采购价
      deposit: '',  // 库存
      monthly_fee: '',  // 月费用
      state: '',  // 状态
    },

    // 骑士列表
    knightList: {
      data: [],
      _meta: {
        result_count: 0,
      },
    },

    // 物资详情
    KnightMaterialsDetail: {
      name: '--',       // 姓名
      phone: '--',      // 手机号
      position_id: '',  // 职位
      supplier_name: '--', // 供应商
      platform_name: '--', // 平台
      city_name_joint: '--', // 城市
      biz_district_name: '--', // 商圈
      knight_material_list: [], // 骑士物资列表
    },

    // 采购记录
    pickOrderList: {
      data: [],
      _meta: {
        result_count: 0,
      },
    },

    // 采购|报废|报错详情
    pickDetail: {
      material_list: [],  // 物资流动详情列表
      real_item_amount: '',  // 实际总品数
      order_id: '',  // 单号
      created_at: '',  // 创建时间
      applicant_phone: '',  // 操作人手机号
      procurement_reason: '',  // 申请采购原因
      applicant_name: '',  // 操作人姓名
      real_handle_amount: '',  // 实际操作数量
      handle_amount: '', // 操作数量
      handle_type: '',  // 申请类型
      total_money: '',  // 总金额
      real_total_money: '',  // 实际总金额
      item_amount: '',  // 总品数
    },

    // 新建采购单及报废单模板
    itemModules: {
      material_list: [],  // 物资列表
    },

    // 物资分发记录
    distributeLogList: {
      data: [],
      _meta: {
        result_count: 0,  // 分发结果
      },
    },

    // 分发及退货详情
    distributeLogDetail: {
      material_list: [],  // 物资流动详情列表
      real_item_amount: '',  // 实际总品数
      order_id: '',  // 单号
      created_at: '',  // 创建时间
      applicant_phone: '',  // 操作人手机号
      procurement_reason: '',  // 申请采购原因
      applicant_name: '',  // 操作人姓名
      real_handle_amount: '',  // 实际操作数量
      handle_amount: '', // 操作数量
      handle_type: '',  // 申请类型
      total_money: '',  // 总金额
      real_total_money: '',  // 实际总金额
      item_amount: '',  // 总品数
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;
        const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
        const platformList = aoaoBossTools.getAllAreaFromPermission('platform_code');
        const cityList = aoaoBossTools.getAllAreaFromPermission('city_list');
        const startDate = aoaoBossTools.prctoMinute(new Date(), 0).substr(0, 10);
        const endDate = aoaoBossTools.prctoMinute(new Date(), 0).substr(0, 10);
        // 过滤不同的路由更新不同的state
        switch (pathname) {
        // 骑士列表
          case '/Materiel/Stores/Knight':
            dispatch({
              type: 'getKnightListE',
              payload: {
                permission_id: Modules.ModuleMaterielStoresKnight.id,
                position_id_list: [Position.postmanManager, Position.postman],
                page: 1,
                limit: 30,
              },
            });
            break;
          // 采购报废记录
          case '/Materiel/Purchase/Log':
            dispatch({
              type: 'getPickOrderListE',
              payload: {
                account_id: accountId,
                page: 1,
                limit: 30,
              },
            });
            break;
          // 分发退货记录
          case '/Materiel/Dispatcher/Log':
            dispatch({
              type: 'getDistributeOrderListE',
              payload: {
                account_id: accountId,
                page: 1,
                limit: 30,
              },
            });
            break;
          // 物资详情
          case '/Materiel/Stores/Knight/Detail':
            dispatch({
              type: 'getKnightMaterialsDetailE',
              payload: {
                staff_id: location.query.id,
              },
            });
            break;
          // 单子详情
          case '/Materiel/Purchase/Detail':
            dispatch({
              type: 'getPickOrderDetailE',
              payload: {
                order_id: location.query.id,
              },
            });
            break;
          // 单子报错
          case '/Materiel/Purchase/ErrorOrder':
            dispatch({
              type: 'getPickOrderDetailE',
              payload: {
                order_id: location.query.id,
              },
            });
            break;
          // 分发退货单详情
          case '/Materiel/Dispatcher/Detail':
            dispatch({
              type: 'getDistributeDetailE',
              payload: {
                order_id: location.query.id,
              },
            });
            break;
        }
      });
    },
  },

  effects: {
    // 获取库存列表
    *getStoreListE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(getStorgeMaterials, payload);
      yield put({
        type: 'getStoreListR',
        payload: result,
      });
    },

    // 获取变更详情
    *getChangeDetailOfStoreE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(getChangeOfMaterials, payload);
      yield put({
        type: 'getChangeDetailOfStoreR',
        payload: result,
      });
      location.href = '/#/Materiel/Stores/Log/Detail';
    },

    // 获取品目列表
    *getItemListE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      payload.permission_id = Modules.ModuleMaterielStoresItem.id;
      const result = yield call(getMessageOfItemList, payload);
      yield put({
        type: 'getItemListR',
        payload: result,
      });
    },

    // 添加品目
    *addItemOfTemplateE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(addItemIntoStore, payload);
      if (result.ok) {
        message.success('添加成功');
        yield put({
          type: 'getItemListE',
          payload: {
            platform_code: payload.platform_code,
          },
        });
      }
    },

    // 缓存品目详情
    *editItemDetailE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const platformCode = payload.platformCode;
      delete payload.platformCode;
      const result = yield call(editItemOfStore, payload);
      // 添加 platform_code 刷新页面
      // const platformList = aoaoBossTools.getAllAreaFromPermission('platform_code');
      // let platform_code = platformList[0]['platform_code'];
      const platform_code = platformCode;
      if (result.ok) {
        message.success('编辑成功');
        yield put({
          type: 'getItemListE',
          payload: {
            platform_code,
          },
        });
      }
    },

    // 获取骑士列表
    *getKnightListE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      payload.permission_id = Modules.ModuleEmployeeUpdate.id;
      const result = yield call(getEmployeeListS, payload);
      yield put({
        type: 'getKnightListR',
        payload: result,
      });
    },

    // 获取骑士物资详情
    *getKnightMaterialsDetailE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(getKnightMaterialsDetail, payload);
      yield put({
        type: 'getKnightMaterialsDetailR',
        payload: result,
      });
    },

    // 获取订单记录
    *getPickOrderListE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const value = payload;
      payload = aoaoBossTools.ItemOfArrayToNubmer(value);
      const result = yield call(getPickOrderListS, payload);
      yield put({
        type: 'getPickOrderListR',
        payload: result,
      });
    },

    // 获取订单详情
    *getPickOrderDetailE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(getPickOrderDetailS, payload);
      yield put({
        type: 'getPickOrderDetailR',
        payload: result,
      });
    },

    // 审核采购及报废、报错
    *auditSingleE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(auditSingleS, payload);
      if (result.ok) {
        message.success('操作成功');
        location.href = '/#/Materiel/Purchase/Log';
        yield put({
          type: 'getPickOrderListE',
          payload: {
            account_id: accountId,
            page: 1,
            limit: 30,
          },
        });
      }
    },

    // 新建采购单及报废单的品目模板
    *createBaseItemListE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(getMessageOfItemList, payload);
      yield put({
        type: 'createBaseItemListR',
        payload: result,
      });
    },

    // 生成采购单|报废单
    *createNewOrderE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(createNewOrderS, payload);
      if (result.ok) {
        message.success(`创建成功,单号为${result.order_id}`, 5);
        location.href = '/#/Materiel/Purchase/Log';
      }
    },

    // 单子报错
    *editOrderToErrorListE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(editOrderToErrorListS, payload);
      if (result.ok) {
        message.success(`创建成功,单号为${result.order_id}`, 5);
        location.href = '/#/Materiel/Purchase/Log';
      }
    },

    // 新建物品分发单
    *createDistributeOrderE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(createDistributeOrderS, payload);
      if (result.ok) {
        message.success(`创建成功,单号为${result.order_id}`, 5);
        location.href = '/#/Materiel/Dispatcher/Log';
      }
    },

    // 获取分发退货记录
    *getDistributeOrderListE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(getDistributeOrderListS, payload);
      yield put({
        type: 'getDistributeOrderListR',
        payload: result,
      });
    },

    // 分发退货单的审核
    *editDistributeOrderE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(editDistributeOrderS, payload);
      if (result.ok) {
        message.success('操作成功');
        location.href = '/#/Materiel/Dispatcher/Log';
        yield put({
          type: 'getDistributeOrderListE',
          payload: {
            account_id: accountId,
            page: 1,
            limit: 30,
          },
        });
      }
    },

    // 分发退货详情
    *getDistributeDetailE({ payload }, { call, put }) {
      const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
      payload.account_id = accountId;
      const result = yield call(getDistributeDetailS, payload);
      yield put({
        type: 'getDistributeDetailR',
        payload: result,
      });
    },

  },

  reducers: {
    // 库存列表
    getStoreListR(state, action) {
      return {
        ...state,
        materialsList: action.payload,
      };
    },

    // 更改详情
    getChangeDetailOfStoreR(state, action) {
      return {
        ...state,
        changeDetail: action.payload,
      };
    },

    // 品目列表
    getItemListR(state, action) {
      return {
        ...state,
        itemList: action.payload,
      };
    },

    // 品目详情
    bundleItemDetailR(state, action) {
      const result = {};
      Object.assign(result, action.payload);
      return {
        ...state,
        itemDetail: result,
      };
    },

    // 骑士列表
    getKnightListR(state, action) {
      return {
        ...state,
        knightList: action.payload,
      };
    },

    // 物资详情
    getKnightMaterialsDetailR(state, action) {
      return {
        ...state,
        KnightMaterialsDetail: action.payload,
      };
    },

    // 采购单列表
    getPickOrderListR(state, action) {
      return {
        ...state,
        pickOrderList: action.payload,
      };
    },

    // 单子详情
    getPickOrderDetailR(state, action) {
      return {
        ...state,
        pickDetail: action.payload,
      };
    },

    // 添加采购单报废单的模板
    createBaseItemListR(state, action) {
      return {
        ...state,
        itemModules: action.payload,
      };
    },

    // 分发退货记录
    getDistributeOrderListR(state, action) {
      return {
        ...state,
        distributeLogList: action.payload,
      };
    },

    // 分发退货详情
    getDistributeDetailR(state, action) {
      return {
        ...state,
        distributeLogDetail: action.payload,
      };
    },
    // 清空
    removeMaterialListR(state, action) {
      return {
        ...state,
        itemModules: {
          material_list: [],
        },
      };
    },
    // 清空详情物资列表
    removePickDetailMaterialListR(state, action) {
      return {
        ...state,
        pickDetail: {
          ...state.pickDetail,
          material_list: [],
        },
      };
    },
    // 晴空物资库存列表
    removeMaterialStockListR(state, action) {
      return {
        ...state,
        materialsList: {},
      };
    },
    // 清空品目列表
    removeItemListR(state, action) {
      return {
        ...state,
        itemList: {
          material_list: [],
        },
      };
    },
  },

};
