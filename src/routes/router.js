/**
 *  按需加载路由配置
 * */
import { authorize } from '../application';
import { Roles } from '../application/define';
import accountException from '../application/utils/accountException';
import Operate from '../application/define/operate';

export default {
  path: '/',
  getComponent: (nextState, callback) => {
    // 加载layout，判断是否登陆
    const isLogin = authorize.isLogin();
    const isAuth = authorize.isAuth();
    if (isLogin === false || isAuth === false) {
      // 如果没登陆，则加载登陆或多账号界面布局
      require.ensure([], (require) => { callback(null, require('./account/authorize/index')); });
      return;
    }

    // 如果登陆，则加载布局
    require.ensure([], (require) => {
      // 判断访问权限，如果权限不存在，则直接跳转到404页面
      const pathname = nextState.location.pathname;
      if (pathname !== '/404' && authorize.canAccess(pathname) === false) {
        callback(null, require('./layout/error'));
      } else {
        callback(null, require('./layout/index'));
      }
    });
  },

  // 默认，账户首页
  getIndexRoute(nextState, cb) {
    // 如果有账户异常需要显示，则跳转
    if (Operate.canOperateSystemCheckAccountException() === true && accountException.isDisplayException()) {
      window.location.href = '/#/System/AccountException/Manage';
      return;
    }

    // 采购首页进入我的账户页
    // TODO:AUTH 这部分权限需要写死，采购的id不能变更才能实现此部分功能
    if (authorize.roleId() === Roles.buyer) {
      window.location.href = '/#/Account';
      return;
    }

    // 默认进入大查询
    window.location.href = '/#/Search/Inquire';
  },

  childRoutes: [
    // 登录相关
    {
      path: 'authorize/:route',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => { cb(null, require('./account/authorize')); });
      },
    },
    // -----------------------超级管理----------------------
    // 系统信息
    {
      path: 'Admin/System',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => { cb(null, require('./admin/system')); });
      },
    },
    // 模块权限信息
    {
      path: 'Admin/Management/Authorize',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => { cb(null, require('./admin/management/authorize')); });
      },
    },
    // 角色管理
    {
      path: 'Admin/Management/Roles',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => { cb(null, require('./admin/management/roles')); });
      },
    },
    // 开发参考模块
    {
      path: 'Admin/Interface',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => { cb(null, require('./admin/interface')); });
      },
    },
    // 开发参考模块
    {
      path: 'Admin/Developer',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => { cb(null, require('./admin/developer')); });
      },
    },
    // ----------------------查询管理-------------------------
    // 收支查询
    {
      path: 'Search/Inquire',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./inquire/index'));
        });
      },
    },

    // 分析报表
    {
      path: 'Analysis/Report',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./analysis/report'));
        });
      },
    },

    // ----------------------操作管理-------------------------
    // 上传kpi文件
    {
      path: 'Handle/Upload',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./operationManage/index'));
        });
      },
    },
    // kpi模版设置
    {
      path: 'Handle/kpiTemplateList',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./operationManage/kpiTemplate/index'));
        });
      },
    },
    // 编辑kpi模版(子页)
    {
      path: 'Handle/editKpi',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./operationManage/kpiTemplate/editKpi'));
        });
      },
    },
    // kpi模版详情(子页)
    {
      path: 'Handle/detailKpi',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./operationManage/kpiTemplate/detailKpi'));
        });
      },
    },
    // 新建kpi模版(子页)
    {
      path: 'Handle/buildKpi',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./operationManage/kpiTemplate/buildKpi'));
        });
      },
    },

    // -----------------------员工管理-----------------------
    // 查看员工
    {
      path: 'Employee/Search',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./employee/search/index'));
        });
      },
    },
    // 添加员工
    {
      path: 'Employee/Add',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./employee/add/index'));
        });
      },
    },
    // 离职审批
    {
      path: 'Employee/LeaveFlow',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./employee/leaveApproval/index'));
        });
      },
    },
    // 员工详情(子页)
    {
      path: 'Employee/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./employee/search/detail'));
        });
      },
    },
    // 工号管理
    {
      path: 'Employee/Delivery',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./employee/delivery/index'));
        });
      },
    },
    // 工号管理-编辑
    {
      path: 'Employee/Delivery/Edit',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./employee/delivery/edit'));
        });
      },
    },
    // 工号管理-详情
    {
      path: 'Employee/Delivery/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./employee/delivery/detail'));
        });
      },
    },
    // 员工编辑(子页)
    {
      path: 'Employee/Edit',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./employee/search/edit'));
        });
      },
    },
    // 待入职员工列表
    {
      path: 'Employee/TodayEntry',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./employee/todayEntry/index'));
        });
      },
    },
    // 员工编辑(子页)
    {
      path: 'Employee/TodayEntry/Edit',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./employee/todayEntry/edit'));
        });
      },
    },

    // -----------------------物资管理----------------------
    // 查看库存
    {
      path: 'Materiel/Stores/Search',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/inventory/stores'));
        });
      },
    },
    // 品目明细
    {
      path: 'Materiel/Stores/Item',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/inventory/itemList'));
        });
      },
    },
    // 查看骑士物资
    {
      path: 'Materiel/Stores/Knight',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/inventory/knightMaterials'));
        });
      },
    },
    // 变动明细(子页)
    {
      path: 'Materiel/Stores/Log/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/inventory/changeMessage'));
        });
      },
    },
    // 物资详情(子页)
    {
      path: 'Materiel/Stores/Knight/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/inventory/materialsDetail'));
        });
      },
    },
    // 采购|报废记录
    {
      path: 'Materiel/Purchase/Log',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/purchase/pickRecord'));
        });
      },
    },
    // 新建物资采购／报废
    {
      path: 'Materiel/Purchase/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/purchase/purchaseOrder'));
        });
      },
    },
    // 详情(子页)
    {
      path: 'Materiel/Purchase/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/purchase/detail'));
        });
      },
    },
    // 报错单(子页)
    {
      path: 'Materiel/Purchase/ErrorOrder',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/purchase/errorOrder'));
        });
      },
    },

    // 分发|退货记录
    {
      path: 'Materiel/Dispatcher/Log',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/distribute/distributeLog'));
        });
      },
    },
    // 新建物资分发
    {
      path: 'Materiel/Dispatcher/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/distribute/distributeOrder'));
        });
      },
    },
    // 详情
    {
      path: 'Materiel/Dispatcher/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./materials/distribute/detail'));
        });
      },
    },

    // -----------------------财务管理----------------------
    // 薪资缓发|补发明细
    {
      path: 'Finance/Salary',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/search/payment'));
        });
      },
    },
    // 资金申请记录，财务申请主页面
    {
      path: 'Finance/FinanceApply',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/index'));
        });
      },
    },
    // 详情(子页)
    {
      path: 'Finance/FinanceApply/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/detail'));
        });
      },
    },
    // 续租(子页)
    {
      path: 'Finance/FinanceApply/Relet',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/relet'));
        });
      },
    },
    // 断租(子页)
    {
      path: 'Finance/FinanceApply/BreakDetail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/breakDetail'));
        });
      },
    },
    // 续租详情(子页)
    {
      path: 'Finance/FinanceApply/ReletDetail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/reletDetail'));
        });
      },
    },
    // 差旅报销(子页)
    {
      path: 'Finance/FinanceApply/TravelDetail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/travelDetail'));
        });
      },
    },
    // 团建|招待申请详情(子页)
    {
      path: 'Finance/FinanceApply/TeamBuildDetail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/teamBuildDetail'));
        });
      },
    },
    // 意外支出申请详情(子页)
    {
      path: 'Finance/FinanceApply/UnexpectedDetail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/unexpectedDetail'));
        });
      },
    },
    // 收购款申请详情(子页)
    {
      path: 'Finance/FinanceApply/PurchaseDetail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/purchaseDetail'));
        });
      },
    },
    // 盖章罚款申请详情(子页)
    {
      path: 'Finance/FinanceApply/PunishmentDetail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/punishmentDetail'));
        });
      },
    },
    // 其他申请详情(子页)
    {
      path: 'Finance/FinanceApply/MoreDetail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/otherApplyDetail'));
        });
      },
    },
    // 办公费用详情(子页)
    {
      path: 'Finance/FinanceApply/OfficeDetail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/financeApply/officeApplyDetail'));
        });
      },
    },
    // 新建财务申请主页面
    {
      path: 'Finance/NewFinanceApply',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./finance/newFinanceApply/index'));
        });
      },
    },

    // -----------------------薪资管理----------------------
    // 薪资汇总查询
    {
      path: 'Salary/Search',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/search/summary'));
        });
      },
    },
    // 薪资查询
    {
      path: 'Salary/Search/Records',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/search/records'));
        });
      },
    },
    // 薪资明细(子页)
    {
      path: 'Salary/Search/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/search/detail'));
        });
      },
    },
    // 薪资更新任务
    {
      path: 'Salary/Task',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/search/task'));
        });
      },
    },
    // 薪资发放
    {
      path: 'Salary/Distribute',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/search/distribute'));
        });
      },
    },
    // 骑士扣款
    {
      path: 'Salary/Manage/Knight/Deduct',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/deduct'));
        });
      },
    },
    // 新建骑士扣款(子页)
    {
      path: 'Salary/Manage/Knight/Deduct/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/deduct/form'));
        });
      },
    },
    // 骑士扣款编辑页面(子页)
    {
      path: 'Salary/Manage/Knight/Deduct/Edit',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/deduct/form'));
        });
      },
    },
    // 骑士扣款详情(子页)
    {
      path: 'Salary/Manage/Knight/Deduct/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/deduct/detail'));
        });
      },
    },
    // 骑士扣款-审核
    {
      path: 'Salary/Manage/Knight/Deduct/Verify',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/deduct/verify'));
        });
      },
    },
    // 骑士扣款审核-详情(子页)
    {
      path: 'Salary/Manage/Knight/Deduct/Verify/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/deduct/verify/detail'));
        });
      },
    },
    // 骑士补款
    {
      path: 'Salary/Manage/Knight/Supplement',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/supplement'));
        });
      },
    },
    // 新建骑士补款(子页)
    {
      path: 'Salary/Manage/Knight/Supplement/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/supplement/form'));
        });
      },
    },
    // 编辑骑士补款
    {
      path: 'Salary/Manage/Knight/Supplement/Edit',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/supplement/form'));
        });
      },
    },
    // 骑士补款-详情页
    {
      path: 'Salary/Manage/Knight/Supplement/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/supplement/detail'));
        });
      },
    },
    // 骑士补款-审核
    {
      path: 'Salary/Manage/Knight/Supplement/Verify',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/supplement/verify'));
        });
      },
    },
    // 骑士补款-审核详情页
    {
      path: 'Salary/Manage/Knight/Supplement/Verify/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/knight/supplement/verify/detail'));
        });
      },
    },
    // 人事扣款
    {
      path: 'Salary/Manage/HumanResources/Deduct',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/humanResources/deduct'));
        });
      },
    },
    // 新建人事扣款页
    {
      path: 'Salary/Manage/HumanResources/Deduct/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/humanResources/deduct/form'));
        });
      },
    },
    // 人事扣款编辑页面
    {
      path: 'Salary/Manage/HumanResources/Deduct/Edit',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/humanResources/deduct/form'));
        });
      },
    },
    // 人事扣款-详情页
    {
      path: 'Salary/Manage/HumanResources/Deduct/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/humanResources/deduct/detail'));
        });
      },
    },
    // 人事扣款-审核
    {
      path: 'Salary/Manage/HumanResources/Deduct/Verify',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/humanResources/deduct/verify'));
        });
      },
    },
    // 人事扣款-审核详情页
    {
      path: 'Salary/Manage/HumanResources/Deduct/Verify/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/manage/humanResources/deduct/verify/detail'));
        });
      },
    },
    // 薪资设置
    {
      path: 'Salary/Setting',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/setting/index'));
        });
      },
    },
    // 新建薪资模版(子页)
    {
      path: 'Salary/Setting/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/setting/create'));
        });
      },
    },
    // 薪资模版详情(子页)
    {
      path: 'Salary/Setting/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./salary/setting/detail'));
        });
      },
    },
    // -----------------------我的账户----------------------
    // 我的账户
    {
      path: 'Account',
      // onEnter: (nextState, replace, next) => {
      // },
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./account/index'));
        });
      },
    },
    // 个人离职
    {
      path: 'Account/PersonalLeave',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./account/personalLeave/index'));
        });
      },
    },

    // -----------------------系统管理----------------------
    // 用户管理
    {
      path: 'System/User',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/user/index'));
        });
      },
    },
    // 关联账号
    {
      path: 'System/Accounts',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/accountManage/index'));
        });
      },
    },
    // 异常账号管理
    {
      path: 'System/AccountException',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/accountException/index/index'));
        });
      },
    },
    // 异常账号管理
    {
      path: 'System/AccountException/Manage',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/accountException/manage/index'));
        });
      },
    },
    // 供应商管理
    {
      path: 'System/Supplier',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/supplier/index'));
        });
      },
    },
    // 供应商管理-详情页
    {
      path: 'System/Supplier/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/supplier/detail'));
        });
      },
    },
    // 供应商业务分布
    {
      path: 'System/Range/Supplier',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/supplier/range'));
        });
      },
    },
    // 供应商业务分布
    {
      path: 'System/Range/City',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/supplier/cityRange'));
        });
      },
    },
    // 添加供应商(子页)
    {
      path: 'System/AddSupplier',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/supplier/add'));
        });
      },
    },
    // 编辑供应商(子页)
    {
      path: 'System/EditSupplier',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/supplier/edit'));
        });
      },
    },
    // TODO 暂时隐藏, 字段管理
    {
      path: 'System/Field',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/field/index'));
        });
      },
    },
    // TODO 暂时隐藏, 指标管理
    {
      path: 'System/Target',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/target/index'));
        });
      },
    },
    // 骑士薪资指标库
    {
      path: 'System/SalaryIndex',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/salaryIndex/index'));
        });
      },
    },
    // 合同归属管理
    {
      path: 'System/OperationManage',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/operationManage/companyList'));
        });
      },
    },
    // 骑士类型设置
    {
      path: 'System/KnightType',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./system/knightType/index'));
        });
      },
    },

    // -----------------------------费用类型------------------------
    // 科目设置
    {
      path: 'Expense/Subject',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/subject/index'));
        });
      },
    },
    // 审批溜设置
    {
      path: 'Expense/Examine',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/examine/index'));
        });
      },
    },
    // 新建审批溜
    {
      path: 'Expense/Examine/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/examine/create.js'));
        });
      },
    },
    // 编辑审批溜
    {
      path: 'Expense/Examine/Edit',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/examine/edit.js'));
        });
      },
    },
    // 费用类型
    {
      path: 'Expense/Type',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/type'));
        });
      },
    },
    // 新建费用类型
    {
      path: 'Expense/Type/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/type/create.js'));
        });
      },
    },
    // 编辑费用类型
    {
      path: 'Expense/Type/Edit',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/type/edit.js'));
        });
      },
    },
    // 新建费用申请
    {
      path: 'Expense/Manage/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/manage/create'));
        });
      },
    },
    // 新建费用申请汇总提交
    {
      path: 'Expense/Manage/Summary/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/manage/summary/create'));
        });
      },
    },
    // 费用申请汇总详情
    {
      path: 'Expense/Manage/Summary/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/manage/summary/detail'));
        });
      },
    },
    // 新建费用申请表单
    {
      path: 'Expense/Manage/Template/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/manage/template/create'));
        });
      },
    },
    // 编辑费用申请表单
    {
      path: 'Expense/Manage/Template/Update',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/manage/template/update'));
        });
      },
    },
    // 费用申请表单详情
    {
      path: 'Expense/Manage/Template/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/manage/template/detail'));
        });
      },
    },
    // 费用申请/审核记录
    {
      path: 'Expense/Manage/Audit',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/manage/audit/index'));
        });
      },
    },
    // 记录明细
    {
      path: 'Expense/Manage/Records',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/manage/records/index'));
        });
      },
    },
    // 记录明细, 编辑明细列表. 编辑续租，断租，退租，续签列表
    {
      path: 'Expense/Manage/Records/Summary/Create',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/manage/records/summary/create'));
        });
      },
    },
    // 记录明细, 编辑明细. 编辑续租，断租，退租，续签
    {
      path: 'Expense/Manage/Records/Form',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/manage/records/form/index'));
        });
      },
    },
    // 记录明细, 明细详情. 续租，断租，退租，续签
    {
      path: 'Expense/Manage/Records/Detail',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./expense/manage/records/detail'));
        });
      },
    },
    // -----------------------全局----------------------
    // error
    {
      path: '*',
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./layout/error'));
        });
      },
    },
  ],
};
