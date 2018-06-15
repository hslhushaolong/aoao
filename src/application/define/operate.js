/**
 * 操作模块的权限判断
 */
import { Position } from './index';
import { authorize } from '../index';
import Modules from './modules';

class Operate {

  // 判断数据是否在数组中
  static inArray = (item = '', array = []) => {
    // 检测数据是否在数组中
    if (array.indexOf(item) !== -1) {
      return true;
    }

    // 不存在则直接返回
    return false;
  }

  // NOTE: 查询管理----------------------------------
  // NOTE: 新增6
  // 收支查询,限制城市级查询(站长,调度)
  static canOperateBalanceSearchLimitCity = () => {
    return authorize.canOperate(Modules.OperateBalanceSearchLimitCity);
  }

  // NOTE: 员工管理----------------------------------
  // 导出EXCEL(超级管理员)
  static canOperateEmployeeSearchExportExcel = () => {
    return authorize.canOperate(Modules.OperateEmployeeSearchExportExcel);
  }
  // 编辑员工信息按钮
  static canOperateEmployeeSearchEditButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeSearchEditButton);
  }
  // TODO:AUTH 产品需求待定，权限由后台判断返回 离职审核按钮(站长，调度)
  static canOperateEmployeeResignVerifyButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeResignVerifyButton);
  }
  // NOTE: OPERATE 员工编辑,商圈选项(除总监外都可见)
  static canOperateEmployeePermission = () => {
    return authorize.canOperate(Modules.OperateEmployeePermission);
  }
  // NOTE: 新增2
  // 添加员工,获取合同归属列表(除超管外都可见)
  static canOperateEmployeeContractAttribution = () => {
    return authorize.canOperate(Modules.OperateEmployeeContractAttribution);
  }
  // NOTE: 新增3
  // 添加员工,平台是否多选(城市经理以上多选)
  static canOperateEmployeeAddEmployeePlatForm = () => {
    return authorize.canOperate(Modules.OperateEmployeeAddEmployeePlatForm);
  }
  // NOTE: 新增4
  // 添加员工,商圈是否多选(站长以上多选)
  static canOperateEmployeeAddEmployeeDistrict = () => {
    return authorize.canOperate(Modules.OperateEmployeeAddEmployeeDistrict);
  }
  // NOTE: 新增5
  // 添加员工,批量上传骑士(站长，调度)
  static canOperateEmployeeUploadKnight = () => {
    return authorize.canOperate(Modules.OperateEmployeeUploadKnight);
  }
  // 工号管理,启用／停用按钮
  static canOperateEmployeeDeliveryStartButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeDeliveryStartButton);
  }
  // 添加员工，城市是否可多选
  static canOperateEmployeeCreateCityModeButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeCreateCityModeButton);
  }
  // 添加员工，显示商圈选项
  static canOperateEmployeeCreateDistrictShowButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeCreateDistrictShowButton);
  }
  // 查看员工显示离职按钮
  static canOperateEmployeeResignVerifyForceButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeResignVerifyForceButton);
  }
  // 查看员工详情按钮
  static canOperateEmployeeSearchDetailButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeSearchDetailButton);
  }
  //-----------------------------------------------
  // 员工详情
  static canAccessModuleEmployeeDetail = () => {
    return authorize.canAccess(Modules.ModuleEmployeeDetail.path);
  }

  // NOTE: 物资管理----------------------------------
  // 添加品目按钮(采购)
  static canOperateMaterielStoresItemCreateButton = () => {
    return authorize.canOperate(Modules.OperateMaterielStoresItemCreateButton);
  }
  // 编辑品目按钮(采购)
  static canOperateMaterielStoresItemEditButton = () => {
    return authorize.canOperate(Modules.OperateMaterielStoresItemEditButton);
  }
  // 报错按钮(城市经理，城市助理)
  static canOperateMaterielPurchaseErrorVerifyButton = () => {
    return authorize.canOperate(Modules.OperateMaterielPurchaseErrorVerifyButton);
  }
  // 采购|报废审核按钮(coo,采购)
  static canOperateMaterielPurchaseVerifyButton = (state) => {
    // 判断模块权限
    return authorize.canOperate(Modules.OperateMaterielPurchaseVerifyButton);
  }

  // 报废审核按钮
  // static canOperateMaterielPurchaseScrapVerifyButton = () => {
  //   return authorize.canOperate(Modules.OperateMaterielPurchaseScrapVerifyButton);
  // }
  // 报错审核按钮
  static canOperateMaterielPurchaseWrongVerifyButton = () => {
    return authorize.canOperate(Modules.OperateMaterielPurchaseWrongVerifyButton);
  }

  // 分发|退货记录审核按钮(调度,站长)
  static canOperateMaterielDispatchRetritVerifyButton = () => {
    return authorize.canOperate(Modules.OperateMaterielDispatchRetritVerifyButton);
  }
  // 变动明细按钮
  static canOperateMaterielStoresLogDetailButton = () => {
    return authorize.canOperate(Modules.OperateMaterielStoresLogDetailButton);
  }

  // NOTE: 财务管理----------------------------------
  // 薪资缓发|补发明细,提交审批按钮(运营)
  static canOperateFinanceSalarySubmitButton = () => {
    return authorize.canOperate(Modules.OperateFinanceSalarySubmitButton) && authorize.canAccess(Modules.ModuleExpenseManageSummaryCreate.path);
  }
  // 薪资缓发|补发明细,导出EXCEL按钮按钮
  static canOperateFinanceSalaryExcelButton = () => {
    return authorize.canOperate(Modules.OperateFinanceSalaryExcelButton);
  }
  // 资金申请审核按钮(coo)
  static canOperateFinanceApplyVerifyButton = () => {
    return authorize.canOperate(Modules.OperateFinanceApplyVerifyButton);
  }

  // NOTE: 薪资管理----------------------------------
  // 薪资汇总查询，同意驳回操作
  static canOperateSalarySearchSummaryManagement = () => {
    return authorize.canOperate(Modules.OperateSalarySearchSummaryManagement);
  }
  // 薪资汇总查询，提交薪资单审核
  static canOperateSalarySearchSummarySubmit = () => {
    return authorize.canOperate(Modules.OperateSalarySearchSummarySubmit);
  }
  // 薪资汇总查询，更新薪资单
  static canOperateSalarySearchSummaryUpdate = () => {
    return authorize.canOperate(Modules.OperateSalarySearchSummaryUpdate);
  }
  // 薪资汇总查询，撤回薪资单
  static canOperateSalarySearchSummaryRevert = () => {
    return authorize.canOperate(Modules.OperateSalarySearchSummaryRevert);
  }
  // 薪资发放，下载薪资单
  static canOperateSalaryDistributeDownload = () => {
    return authorize.canOperate(Modules.OperateSalaryDistributeDownload);
  }
  // 薪资查询列表，批量缓发按钮(城市经理，城市助理)
  static canOperateSalarySearchRecordsDelayButton = () => {
    return authorize.canOperate(Modules.OperateSalarySearchRecordsDelayButton);
  }
  // 骑士补款,新建按钮(城市经理，城市助理)
  static canOperateSalaryFillingMoneyCreateButton = () => {
    return authorize.canOperate(Modules.OperateSalaryFillingMoneyCreateButton);
  }
  // 骑士补款,审核按钮 (coo)
  static canOperateSalaryFillingMoneyVerifyButton = () => {
    return authorize.canOperate(Modules.OperateSalaryFillingMoneyVerifyButton);
  }
  // 骑士扣款,新建按钮 (站长，调度)
  static canOperateSalaryDeductionsCreateButton = () => {
    return authorize.canOperate(Modules.OperateSalaryDeductionsCreateButton);
  }
  // 骑士扣款,审核按钮(站长，调度)
  static canOperateSalaryDeductionsVerifyButton = () => {
    return authorize.canOperate(Modules.OperateSalaryDeductionsVerifyButton);
  }
  // 人事扣款,新建按钮(人事角色)
  static canOperateSalaryPersonnalDeductCreateButton = () => {
    return authorize.canOperate(Modules.OperateSalaryPersonnalDeductCreateButton);
  }
  // 薪资设置,新建按钮(城市经理, 城市助理)
  static canOperateSalarySettingCreateButton = () => {
    return authorize.canOperate(Modules.OperateSalarySettingCreateButton);
  }
  // 薪资设置,审核按钮(coo)
  static canOperateSalarySettingVerifyButton = () => {
    return authorize.canOperate(Modules.OperateSalarySettingVerifyButton);
  }
  // 薪资设置,编辑按钮(城市经理)
  static canOperateSalarySettingEditButton = () => {
    return authorize.canOperate(Modules.OperateSalarySettingEditButton);
  }
  // 薪资设置,停用按钮
  static canOperateSalarySettingStopButton = () => {
    return authorize.canOperate(Modules.OperateSalarySettingStopButton);
  }
  // 薪资设置,复制按钮
  static canOperateSalarySettingCopyButton = () => {
    return authorize.canOperate(Modules.OperateSalarySettingCopyButton);
  }
  // 薪资设置,撤回按钮
  static canOperateSalarySettingWithdrawButton = () => {
    return authorize.canOperate(Modules.OperateSalarySettingWithdrawButton);
  }

  // NOTE: 系统管理----------------------------------
  // 查看异常账号（站长，调度）
  static canOperateSystemCheckAccountException = () => {
    return authorize.canOperate(Modules.OperateSystemCheckAccountException);
  }
  // 运营管理录入,更改公司名称(运营管理)
  static canOperateSystemEditCompany = () => {
    return authorize.canOperate(Modules.OperateSystemEditCompany);
  }
  // 运营管理录入,添加公司名称(运营管理)
  static canOperateSystemAddCompany = () => {
    return authorize.canOperate(Modules.OperateSystemAddCompany);
  }
  // 用户管理,添加编辑用户员工信息确认(总监到站长)
  static canOperateSystemUserSearch = () => {
    return authorize.canOperate(Modules.OperateSystemUserSearch);
  }
  // 用户管理,添加编辑用户员工平台权限(总监到城市助理)
  static canOperateSystemUserPlatForm = () => {
    return authorize.canOperate(Modules.OperateSystemUserPlatForm);
  }
  // 用户管理,添加编辑用户员工商圈权限(调度／站长)
  static canOperateSystemUserArea = () => {
    return authorize.canOperate(Modules.OperateSystemUserArea);
  }
  // 用户管理,添加编辑用户员工城市权限(总监到城市助理)
  static canOperateSystemUserCity = () => {
    return authorize.canOperate(Modules.OperateSystemUserCity);
  }
  // 用户管理,添加编辑用户员工供应商(coo)
  static canOperateSystemUserSupplier = () => {
    return authorize.canOperate(Modules.OperateSystemUserSupplier);
  }
  // 商圈分布状态是否可以操作
  static canOperateModuleSystemDistrict = () => {
    return authorize.canOperate(Modules.OperateModuleSystemDistrict);
  }
  // 商圈分布状态异常账号提醒
  static canOperateModuleSystemSupplierRange = () => {
    return authorize.canOperate(Modules.OperateModuleSystemSupplierRange);
  }

  // NOTE: 费用类型--------------------------------
  // 科目编辑新建
  static canOperateExpenseSubjectEditButton = () => {
    return authorize.canOperate(Modules.OperateExpenseSubjectEditButton);
  }
  // 审批流编辑新建
  static canOperateExpenseExamineEditButton = () => {
    return authorize.canOperate(Modules.OperateExpenseExamineEditButton);
  }
  // 费用类型编辑新建
  static canOperateExpenseExpenseTypeButton = () => {
    return authorize.canOperate(Modules.OperateExpenseExpenseTypeButton);
  }
  // 审批单编辑
  static canOperateExpenseManageEditButton = () => {
    return authorize.canOperate(Modules.OperateExpenseManageEditButton);
  }
  // 审批单审批
  static canOperateExpenseManageApprovalButton = () => {
    return authorize.canOperate(Modules.OperateExpenseManageApprovalButton);
  }
  // 项目明细续租／断租等
  static canOperateExpenseManageRecordsEditButton = () => {
    return authorize.canOperate(Modules.OperateExpenseManageRecordsEditButton);
  }

  // NOTE: 全局----------------------------------

  // NOTE: 职位相关的判断
  // ------ 骑士相关，权限过滤 ------

  // 骑士类型权限
  static knightTypeShow = (positionId) => {
    return [
      Position.superAdmin,
      Position.chiefManager,
      Position.cityManager,
      Position.cityAssistant,
      Position.dispatcher,
      Position.postman,
      Position.postmanManager,   // 骑士长
    ].includes(positionId);
  }

  // 骑士权限
  static knightShow = (positionId) => {
    return [
      Position.superAdmin,
      Position.chiefManager,
      Position.cityManager,
      Position.cityAssistant,
      Position.dispatcher,
    ].includes(positionId);
  }


  static hasPositionEmployeeEditIdCard= (positionId) => {
    return [
      Position.postmanManager,
      Position.postman,
      Position.client,
    ].includes(positionId);
  }


  static hasPositionEmployeeEditKnightType= (positionId) => {
    return [
      Position.postmanManager,
      Position.postman,
      Position.client,
    ].includes(positionId);
  }
}
export default Operate;
