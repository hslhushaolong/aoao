// 模块对象(页面)
class Module {
  constructor({ id, key = '', title = '', path = '' }) {
    this.id = id;             // 对应服务器的模块id
    this.key = key;           // 模块的key, 标示
    this.title = title;       // 模块的标题
    this.path = path;         // 模块的路径
    this.isMenu = false;      // 是否是菜单
    this.isPage = false;      // 是否是页面
    this.isRule = false;      // 是否是页面内置功能
    this.canAccess = false;   // 是否有权限访问(默认没有权限)
  }
}

// 菜单对象
class Menu extends Module {
  constructor({ id, key, icon = '', title = '' }) {
    super({ id, key, title, path: `menu-${key}` });
    this.icon = icon;   // 菜单栏icon
    this.isMenu = true; // 是否是菜单
  }
}

// 页面
class Page extends Module {
  constructor({ id, key, title = '', path = '' }) {
    super({ id, key, title, path });
    this.isPage = true; // 是否是页面
  }
}

// 操作
class Operate extends Module {
  constructor({ id, key, title = '' }) {
    super({ id, key, title, path: `operate-${key}` });
    this.isOperate = true;    // 是否是页面操作
  }
}

// 系统所有注册的模块
export default {
  // 超级管理
  MenuAdmin: new Menu({ id: '2-0', key: 'MenuAdmin', title: '超级管理(仅限超管)', icon: 'code' }),
  ModuleAdminSystem: new Page({ id: '2-1', key: 'ModuleAdminSystem', title: '系统信息', path: 'Admin/System' }),
  ModuleAdminAuthorize: new Page({ id: '2-2', key: 'ModuleAdminAuthorize', title: '权限管理', path: 'Admin/Management/Authorize' }),
  ModuleAdminManagementRoles: new Page({ id: '2-3', key: 'ModuleAdminManagementRoles', title: '角色管理', path: 'Admin/Management/Roles' }),
  ModuleAdminInterface: new Page({ id: '2-4', key: 'ModuleAdminInterface', title: '开发文档', path: 'Admin/Interface' }),
  ModuleAdminDeveloper: new Page({ id: '2-5', key: 'ModuleAdminDeveloper', title: '开发调试', path: 'Admin/Developer' }),

  // 查询管理
  MenuSearch: new Menu({ id: '1-0', key: 'MenuSearch', title: '查询管理', icon: 'search' }),
  ModuleSearchInquire: new Page({ id: '1-1', key: 'ModuleSearchInquire', title: '收支查询', path: 'Search/Inquire' }),
  OperateBalanceSearchLimitCity: new Operate({ id: '1-6', key: 'OperateBalanceSearchLimitCity', title: '查询条件,禁止查询城市级数据' }),

  // 分析报表 TODO：临时模块，后续会独立开发
  ModuleAnalysisReport: new Page({ id: '1-7', key: 'ModuleAnalysisReport', title: '商圈预估利润表', path: 'Analysis/Report' }),

  // 操作管理
  MenuOperation: new Menu({ id: '4-0', key: 'MenuOperation', title: '操作管理', icon: 'desktop' }),
  ModuleOperationUploadKPI: new Page({ id: '4-1', key: 'ModuleOperationUploadKPI', title: '上传KPI文件', path: 'Handle/Upload' }),
  ModuleOperationKPIUpdate: new Page({ id: '4-2', key: 'ModuleOperationKPIUpdate', title: '编辑KPI模版', path: 'Handle/editKpi' }),
  ModuleOperationKPIDetail: new Page({ id: '4-3', key: 'ModuleOperationKPIDetail', title: 'KPI模版详情', path: 'Handle/detailKpi' }),
  ModuleOperationKPIBuild: new Page({ id: '4-4', key: 'ModuleOperationKPIBuild', title: '新建KPI模版', path: 'Handle/buildKpi' }),
  ModuleOperationKPITemplateList: new Page({ id: '4-5', key: 'ModuleOperationKPITemplateList', title: 'KPI模版设置', path: 'Handle/kpiTemplateList' }),

  // 员工管理
  MenuEmployee: new Menu({ id: '3-0', key: 'MenuEmployee', title: '员工管理', icon: 'user' }),
  ModuleEmployeeSearch: new Page({ id: '3-1', key: 'ModuleEmployeeSearch', title: '查看员工', path: 'Employee/Search' }),
  ModuleEmployeeCreate: new Page({ id: '3-2', key: 'ModuleEmployeeCreate', title: '添加员工', path: 'Employee/Add' }),
  ModuleEmployeeDetail: new Page({ id: '3-3', key: 'ModuleEmployeeDetail', title: '员工详情', path: 'Employee/Detail' }),
  ModuleEmployeeUpdate: new Page({ id: '3-4', key: 'ModuleEmployeeUpdate', title: '员工编辑', path: 'Employee/Edit' }),
  ModuleEmployeeResign: new Page({ id: '3-5', key: 'ModuleEmployeeResign', title: '离职审批', path: 'Employee/LeaveFlow' }),
  ModuleEmployeeDelivery: new Page({ id: '3-6', key: 'ModuleEmployeeDelivery', title: '工号管理', path: 'Employee/Delivery' }),
  ModuleEmployeeDeliveryEdit: new Page({ id: '3-7', key: 'ModuleEmployeeDeliveryEdit', title: '工号编辑', path: 'Employee/Delivery/Edit' }),
  ModuleEmployeeDeliveryDetail: new Page({ id: '3-8', key: 'ModuleEmployeeDeliveryDetail', title: '工号详情', path: 'Employee/Delivery/Detail' }),
  OperateEmployeeSearchExportExcel: new Operate({ id: '3-9', key: 'OperateEmployeeSearchExportExcel', title: '导出EXCEL' }),
  OperateEmployeeSearchDetailButton: new Operate({ id: '3-10', key: 'OperateEmployeeSearchDetailButton', title: '查看详情按钮' }),
  OperateEmployeeSearchEditButton: new Operate({ id: '3-11', key: 'OperateEmployeeSearchEditButton', title: '编辑按钮' }),
  OperateEmployeeResignVerifyButton: new Operate({ id: '3-12', key: 'OperateEmployeeResignVerifyButton', title: '离职审核按钮' }),
  OperateEmployeePermission: new Operate({ id: '3-14', key: 'OperateEmployeePermission', title: '商圈选项' }),
  OperateEmployeeContractAttribution: new Operate({ id: '3-15', key: 'OperateEmployeeContractAttribution', title: '添加员工,获取合同归属列表(除超管外都可见)(待删除)' }),
  OperateEmployeeAddEmployeePlatForm: new Operate({ id: '3-16', key: 'OperateEmployeeAddEmployeePlatForm', title: '平台多选' }),
  OperateEmployeeAddEmployeeDistrict: new Operate({ id: '3-17', key: 'OperateEmployeeAddEmployeeDistrict', title: '商圈多选' }),
  OperateEmployeeUploadKnight: new Operate({ id: '3-18', key: 'OperateEmployeeUploadKnight', title: '批量上传员工' }),
  OperateEmployeeDeliveryStartButton: new Operate({ id: '3-13', key: 'OperateEmployeeDeliveryStartButton', title: '编辑／启用／停用按钮' }),
  OperateEmployeeCreateCityModeButton: new Operate({ id: '3-19', key: 'OperateEmployeeCreateCityModeButton', title: '城市多选' }),
  OperateEmployeeCreateDistrictShowButton: new Operate({ id: '3-20', key: 'OperateEmployeeCreateDistrictShowButton', title: '显示商圈选项' }),
  OperateEmployeeResignVerifyForceButton: new Operate({ id: '3-21', key: 'OperateEmployeeResignVerifyForceButton', title: '强制离职按钮' }),
  ModuleEmployeeTodayEntry: new Page({ id: '3-22', key: 'ModuleEmployeeTodayEntry', title: '今日待入职员工', path: 'Employee/TodayEntry' }),
  ModuleEmployeeTodayEntryEdit: new Page({ id: '3-23', key: 'ModuleEmployeeTodayEntryEdit', title: '编辑', path: 'Employee/TodayEntry/Edit' }),

  // 物资管理
  MenuMateriel: new Menu({ id: '6-0', key: 'MenuMateriel', title: '物资管理', icon: 'database' }),
  MenuMaterielStores: new Menu({ id: '6-1', key: 'MenuMaterielStores', title: '库存信息' }),
  MenuMaterielPurchase: new Menu({ id: '6-2', key: 'MenuMaterielPurchase', title: '采购|报废' }),
  MenuMaterielDispatch: new Menu({ id: '6-3', key: 'MenuMaterielDispatch', title: '分发|退货记录' }),
  ModuleMaterielStoresSearch: new Page({ id: '6-4', key: 'ModuleMaterielStoresSearch', title: '查看库存', path: 'Materiel/Stores/Search' }),
  ModuleMaterielStoresLogDetail: new Page({ id: '6-5', key: 'ModuleMaterielStoresLogDetail', title: '变动明细', path: 'Materiel/Stores/Log/Detail' }),
  ModuleMaterielStoresItem: new Page({ id: '6-6', key: 'ModuleMaterielStoresItem', title: '品目明细', path: 'Materiel/Stores/Item' }),
  ModuleMaterielStoresKnight: new Page({ id: '6-7', key: 'ModuleMaterielStoresKnight', title: '查看骑士物资', path: 'Materiel/Stores/Knight' }),
  ModuleMaterielStoresKnightDetail: new Page({ id: '6-8', key: 'ModuleMaterielStoresKnightDetail', title: '骑士物资详情', path: 'Materiel/Stores/Knight/Detail' }),
  ModuleMaterielPurchaseLog: new Page({ id: '6-9', key: 'ModuleMaterielPurchaseLog', title: '采购|报废记录', path: 'Materiel/Purchase/Log' }),
  ModuleMaterielPurchaseCreate: new Page({ id: '6-10', key: 'ModuleMaterielPurchaseCreate', title: '新建物资采购|报废', path: 'Materiel/Purchase/Create' }),
  ModuleMaterielPurchaseDetail: new Page({ id: '6-11', key: 'ModuleMaterielPurchaseDetail', title: '查看详情', path: 'Materiel/Purchase/Detail' }),
  ModuleMaterielPurchaseErrorOrder: new Page({ id: '6-12', key: 'ModuleMaterielPurchaseErrorOrder', title: '提交报错单', path: 'Materiel/Purchase/ErrorOrder' }),
  ModuleMaterielDispatcherLog: new Page({ id: '6-13', key: 'ModuleMaterielDispatcherLog', title: '分发|退货记录', path: 'Materiel/Dispatcher/Log' }),
  ModuleMaterielDispatcherCreate: new Page({ id: '6-14', key: 'ModuleMaterielDispatcherCreate', title: '新建物资分发', path: 'Materiel/Dispatcher/Create' }),
  ModuleMaterielDispatcherDetail: new Page({ id: '6-15', key: 'ModuleMaterielDispatcherDetail', title: '查看详情', path: 'Materiel/Dispatcher/Detail' }),
  OperateMaterielStoresItemCreateButton: new Operate({ id: '6-16', key: 'OperateMaterielStoresItemCreateButton', title: '添加品目按钮' }),
  OperateMaterielStoresItemEditButton: new Operate({ id: '6-17', key: 'OperateMaterielStoresItemEditButton', title: '编辑品目按钮' }),
  OperateMaterielPurchaseErrorVerifyButton: new Operate({ id: '6-18', key: 'OperateMaterielPurchaseErrorVerifyButton', title: '报错按钮' }),
  OperateMaterielPurchaseVerifyButton: new Operate({ id: '6-19', key: 'OperateMaterielPurchaseVerifyButton', title: '采购|报废审核按钮' }),
  // OperateMaterielPurchaseScrapVerifyButton: new Operate({ id: 'xxx', key: 'OperateMaterielPurchaseScrapVerifyButton', title: '报废审核按钮' }),
  OperateMaterielPurchaseWrongVerifyButton: new Operate({ id: '6-21', key: 'OperateMaterielPurchaseWrongVerifyButton', title: '报错审核按钮' }),
  OperateMaterielDispatchRetritVerifyButton: new Operate({ id: '6-20', key: 'OperateMaterielDispatchRetritVerifyButton', title: '分发|退货审核按钮' }),
  OperateMaterielStoresLogDetailButton: new Operate({ id: '6-22', key: 'OperateMaterielDispatchRetritVerifyButton', title: '变动明细按钮' }),

  // 财务管理
  MenuFinance: new Menu({ id: '5-0', key: 'MenuFinance', title: '财务管理', icon: 'pay-circle-o' }),
  ModuleFinanceApply: new Page({ id: '5-1', key: 'ModuleFinanceApply', title: '资金申请记录', path: 'Finance/FinanceApply' }),
  ModuleFinanceApplyCreate: new Page({ id: '5-2', key: 'ModuleFinanceApplyCreate', title: '新建资金申请', path: 'Finance/NewFinanceApply' }),
  ModuleFinanceApplyDetail: new Page({ id: '5-3', key: 'ModuleFinanceApplyDetail', title: '详情', path: 'Finance/FinanceApply/Detail' }),
  ModuleFinanceApplyRelet: new Page({ id: '5-4', key: 'ModuleFinanceApplyRelet', title: '续租', path: 'Finance/FinanceApply/Relet' }),
  ModuleFinanceApplyBreakDetail: new Page({ id: '5-5', key: 'ModuleFinanceApplyBreakDetail', title: '断租', path: 'Finance/FinanceApply/BreakDetail' }),
  ModuleFinanceApplyReletDetail: new Page({ id: '5-6', key: 'ModuleFinanceApplyReletDetail', title: '续租详情', path: 'Finance/FinanceApply/ReletDetail' }),
  ModuleFinanceApplyTravelDetail: new Page({ id: '5-7', key: 'ModuleFinanceApplyTravelDetail', title: '差旅报销', path: 'Finance/FinanceApply/TravelDetail' }),
  ModuleFinanceApplyTeamBuildDetail: new Page({ id: '5-8', key: 'ModuleFinanceApplyTeamBuildDetail', title: '团建 | 招待申请详情', path: 'Finance/FinanceApply/TeamBuildDetail' }),
  ModuleFinanceApplyUnexpectedDetail: new Page({ id: '5-9', key: 'ModuleFinanceApplyUnexpectedDetail', title: '意外支出申请详情', path: 'Finance/FinanceApply/UnexpectedDetail' }),
  ModuleFinanceApplyPurchaseDetail: new Page({ id: '5-10', key: 'ModuleFinanceApplyPurchaseDetail', title: '收购款申请详情', path: 'Finance/FinanceApply/PurchaseDetail' }),
  ModuleFinanceApplyPunishmentDetail: new Page({ id: '5-11', key: 'ModuleFinanceApplyPunishmentDetail', title: '盖章罚款申请详情', path: 'Finance/FinanceApply/PunishmentDetail' }),
  ModuleFinanceApplyMoreDetail: new Page({ id: '5-12', key: 'ModuleFinanceApplyMoreDetail', title: '其他申请详情', path: 'Finance/FinanceApply/MoreDetail' }),
  ModuleFinanceApplyOfficeDetail: new Page({ id: '5-13', key: 'ModuleFinanceApplyOfficeDetail', title: '办公费用详情', path: 'Finance/FinanceApply/OfficeDetail' }),
  ModuleFinanceSalary: new Page({ id: '5-15', key: 'ModuleFinanceSalary', title: '薪资缓发|补发明细', path: 'Finance/Salary' }),
  OperateFinanceApplyVerifyButton: new Operate({ id: '5-14', key: 'OperateFinanceApplyVerifyButton', title: '资金申请审核按钮' }),
  OperateFinanceSalarySubmitButton: new Operate({ id: '5-21', key: 'OperateFinanceSalarySubmitButton', title: '提交审批按钮' }), // xxxx
  OperateFinanceSalaryExcelButton: new Operate({ id: '5-18', key: 'OperateFinanceSalaryExcelButton', title: '导出EXCEL按钮' }), // xxxx

  // 费用管理
  MenuExpense: new Menu({ id: '10-0', key: 'MenuExpense', title: '费用管理', icon: 'pay-circle-o' }),
  ModuleExpenseSubject: new Page({ id: '10-1', key: 'ModuleExpenseSubject', title: '科目设置', path: 'Expense/Subject' }),
  ModuleExpenseExamine: new Page({ id: '10-3', key: 'ModuleExpenseExamine', title: '审批流设置', path: 'Expense/Examine' }),
  ModuleExpenseExamineNew: new Page({ id: '10-4', key: 'ModuleExpenseExamineNew', title: '审批流新增页面', path: 'Expense/Examine/Create' }),
  ModuleExpenseExamineEdit: new Page({ id: '10-28', key: 'ModuleExpenseExamineEdit', title: '审批流编辑页面', path: 'Expense/Examine/Edit' }),
  ModuleExpenseType: new Page({ id: '10-5', key: 'ModuleExpenseType', title: '费用类型设置', path: 'Expense/Type' }),
  ModuleExpenseTypeCreate: new Page({ id: '10-6', key: 'ModuleExpenseTypeCreate', title: '费用类型设置新增', path: 'Expense/Type/Create' }),
  ModuleExpenseTypeEdit: new Page({ id: '10-21', key: 'ModuleExpenseTypeEdit', title: '费用类型设置编辑', path: 'Expense/Type/Edit' }),
  ModuleExpenseManageCreate: new Page({ id: '10-7', key: 'ModuleExpenseManageCreate', title: '新建费用申请', path: 'Expense/Manage/Create' }),
  ModuleExpenseManageSummaryCreate: new Page({ id: '10-10', key: 'ModuleExpenseManageSummaryCreate', title: '费用申请汇总创建', path: 'Expense/Manage/Summary/Create' }),
  ModuleExpenseManageSummaryDetail: new Page({ id: '10-20', key: 'ModuleExpenseManageSummaryDetail', title: '费用申请汇总详情', path: 'Expense/Manage/Summary/Detail' }),
  ModuleExpenseManageTemplateCreate: new Page({ id: '10-15', key: 'ModuleExpenseManageTemplateCreate', title: '费用申请创建', path: 'Expense/Manage/Template/Create' }),
  ModuleExpenseManageTemplateUpdate: new Page({ id: '10-16', key: 'ModuleExpenseManageTemplateUpdate', title: '费用申请编辑', path: 'Expense/Manage/Template/Update' }),
  ModuleExpenseManageTemplateDetail: new Page({ id: '10-17', key: 'ModuleExpenseManageTemplateDetail', title: '费用申请详情', path: 'Expense/Manage/Template/Detail' }),
  ModuleExpenseManageAudit: new Page({ id: '10-9', key: 'ModuleExpenseManageAudit', title: '费用申请/审核记录', path: 'Expense/Manage/Audit' }),
  ModuleExpenseManageRecords: new Page({ id: '10-12', key: 'ModuleExpenseManageRecords', title: '记录明细', path: 'Expense/Manage/Records' }),
  // 续签、断租、退租、续租汇总页面
  ModuleExpenseManageRecordsSummaryCreate: new Page({ id: '10-14', key: 'ModuleExpenseManageRecordsSummaryCreate', title: '编辑明细列表', path: 'Expense/Manage/Records/Summary/Create' }),
  // 续签、断租、退租、续租的编辑
  ModuleExpenseManageRecordsForm: new Page({ id: '10-18', key: 'ModuleExpenseManageRecordsForm', title: '编辑明细记录', path: 'Expense/Manage/Records/Form' }),
  // 续签、断租、退租、续租的详情
  ModuleExpenseManageRecordsDetail: new Page({ id: '10-19', key: 'ModuleExpenseManageRecordsDetail', title: '明细记录详情', path: 'Expense/Manage/Records/Detail' }),
  // 科目编辑新建
  OperateExpenseSubjectEditButton: new Operate({ id: '10-22', key: 'OperateExpenseSubjectEditButton', title: '科目编辑,新建' }),
  // 审批流编辑新建
  OperateExpenseExamineEditButton: new Operate({ id: '10-23', key: 'OperateExpenseExamineEditButton', title: '审批流编辑,新建' }),
  // 费用类型编辑新建
  OperateExpenseExpenseTypeButton: new Operate({ id: '10-24', key: 'OperateExpenseTypeEditButton', title: '费用类型编辑,新建' }),
  // 审批单编辑
  OperateExpenseManageEditButton: new Operate({ id: '10-25', key: 'OperateExpenseManageEditButton', title: '审批单编辑' }),
  // 审批单审批
  OperateExpenseManageApprovalButton: new Operate({ id: '10-26', key: 'OperateExpenseManageApprovalButton', title: '审批单审批' }),
  // 项目明细续租／断租等
  OperateExpenseManageRecordsEditButton: new Operate({ id: '10-27', key: 'OperateExpenseManageRecordsEditButton', title: '项目明细续租／断租等' }),

  // 薪资管理
  MenuSalary: new Menu({ id: '8-0', key: 'MenuSalary', title: '薪资管理', icon: 'bank' }),
  ModuleSalarySearch: new Page({ id: '8-33', key: 'ModuleSalarySearch', title: '薪资汇总', path: 'Salary/Search' }),
  ModuleSalarySearchRecords: new Page({ id: '8-1', key: 'ModuleSalarySearchRecords', title: '城市薪资明细', path: 'Salary/Search/Records' }),
  ModuleSalarySearchDetail: new Page({ id: '8-2', key: 'ModuleSalarySearchDetail', title: '骑士薪资明细', path: 'Salary/Search/Detail' }),

  // 骑士扣款
  ModuleSalaryManageKnightDeduct: new Page({ id: '8-3', key: 'ModuleSalaryManageKnightDeduct', title: '骑士扣款(提交)', path: 'Salary/Manage/Knight/Deduct' }),
  ModuleSalaryManageKnightDeductCreate: new Page({ id: '8-4', key: 'ModuleSalaryManageKnightDeductCreate', title: '新建骑士扣款', path: 'Salary/Manage/Knight/Deduct/Create' }),
  ModuleSalaryManageKnightDeductDetail: new Page({ id: '8-5', key: 'ModuleSalaryManageKnightDeductDetail', title: '查看详情', path: 'Salary/Manage/Knight/Deduct/Detail' }),
  ModuleSalaryManageKnightDeductEdit: new Page({ id: '8-30', key: 'ModuleSalaryManageKnightDeductEdit', title: '编辑骑士扣款', path: 'Salary/Manage/Knight/Deduct/Edit' }),
  ModuleSalaryManageKnightDeductVerify: new Page({ id: '8-46', key: 'ModuleSalaryManageKnightDeductVerify', title: '骑士扣款(审核)', path: 'Salary/Manage/Knight/Deduct/Verify' }),
  ModuleSalaryManageKnightDeductVerifyDetail: new Page({ id: '8-49', key: 'ModuleSalaryManageKnightDeductVerifyDetail', title: '骑士扣款(审核)详情', path: 'Salary/Manage/Knight/Deduct/Verify/Detail' }),

  // 骑士补款
  ModuleSalaryManageKnightSupplement: new Page({ id: '8-6', key: 'ModuleSalaryManageKnightSupplement', title: '骑士补款(提交)', path: 'Salary/Manage/Knight/Supplement' }),
  ModuleSalaryManageKnightSupplementCreate: new Page({ id: '8-7', key: 'ModuleSalaryManageKnightSupplementCreate', title: '新建骑士补款', path: 'Salary/Manage/Knight/Supplement/Create' }),
  ModuleSalaryManageKnightSupplementDetail: new Page({ id: '8-8', key: 'ModuleSalaryManageKnightSupplementDetail', title: '查看详情', path: 'Salary/Manage/Knight/Supplement/Detail' }),
  ModuleSalaryManageKnightSupplementEdit: new Page({ id: '8-31', key: 'ModuleSalaryManageKnightSupplementEdit', title: '编辑骑士补款', path: 'Salary/Manage/Knight/Supplement/Edit' }),
  ModuleSalaryManageKnightSupplementVerify: new Page({ id: '8-47', key: 'ModuleSalaryManageKnightSupplementVerify', title: '骑士补款(审核)', path: 'Salary/Manage/Knight/Supplement/Verify' }),
  ModuleSalaryManageKnightSupplementVerifyDetail: new Page({ id: '8-50', key: 'ModuleSalaryManageKnightSupplementVerifyDetail', title: '骑士补款(审核)详情', path: 'Salary/Manage/Knight/Supplement/Verify/Detail' }),

  // 人事扣款
  ModuleSalaryManageHumanResourcesDeduct: new Page({ id: '8-22', key: 'ModuleSalaryManageHumanResourcesDeduct', title: '人事扣款(提交)', path: 'Salary/Manage/HumanResources/Deduct' }),
  ModuleSalaryManageHumanResourcesDeductCreate: new Page({ id: '8-23', key: 'ModuleSalaryManageHumanResourcesDeductCreate', title: '新建人事扣款', path: 'Salary/Manage/HumanResources/Deduct/Create' }),
  ModuleSalaryManageHumanResourcesDeductEdit: new Page({ id: '8-29', key: 'ModuleSalaryManageHumanResourcesDeductEdit', title: '编辑人事扣款', path: 'Salary/Manage/HumanResources/Deduct/Edit' }),
  ModuleSalaryManageHumanResourcesDeductDetail: new Page({ id: '8-24', key: 'ModuleSalaryManageHumanResourcesDeductDetail', title: '查看详情', path: 'Salary/Manage/HumanResources/Deduct/Detail' }),
  ModuleSalaryManageHumanResourcesDeductVerify: new Page({ id: '8-48', key: 'ModuleSalaryManageHumanResourcesDeductVerify', title: '人事扣款(审核)', path: 'Salary/Manage/HumanResources/Deduct/Verify' }),
  ModuleSalaryManageHumanResourcesDeductVerifyDetail: new Page({ id: '8-51', key: 'ModuleSalaryManageHumanResourcesDeductVerifyDetail', title: '人事扣款(审核)详情', path: 'Salary/Manage/HumanResources/Deduct/Verify/Detail' }),

  // 薪资设置
  ModuleSalarySetting: new Page({ id: '8-9', key: 'ModuleSalarySetting', title: '薪资设置', path: 'Salary/Setting' }),
  ModuleSalarySettingCreate: new Page({ id: '8-10', key: 'ModuleSalarySettingCreate', title: '新建薪资模板', path: 'Salary/Setting/Create' }),
  ModuleSalarySettingDetail: new Page({ id: '8-11', key: 'ModuleSalarySettingDetail', title: '查看详情', path: 'Salary/Setting/Detail' }),
  ModuleSalaryDistribute: new Page({ id: '8-45', key: 'ModuleSalaryDistribute', title: '薪资发放', path: 'Salary/Distribute' }),
  ModuleSalaryTask: new Page({ id: '8-43', key: 'ModuleSalaryTask', title: '薪资更新任务', path: 'Salary/Task' }),
  OperateSalarySearchSummaryManagement: new Operate({ id: '8-12', key: 'OperateSalarySearchSummaryManagement', title: '同意驳回操作' }),
  OperateSalarySearchSummarySubmit: new Operate({ id: '8-41', key: 'OperateSalarySearchSummarySubmit', title: '提交薪资单审核' }),
  OperateSalarySearchSummaryUpdate: new Operate({ id: '8-42', key: 'OperateSalarySearchSummaryUpdate', title: '更新薪资单' }),
  OperateSalarySearchSummaryRevert: new Operate({ id: '8-44', key: 'OperateSalarySearchSummaryRevert', title: '撤回薪资单' }),
  OperateSalarySearchRecordsDelayButton: new Operate({ id: '8-21', key: 'OperateSalarySearchRecordsDelayButton', title: '批量缓发按钮' }),
  OperateSalaryDistributeDownload: new Operate({ id: '8-20', key: 'OperateSalaryDistributeDownload', title: '下载薪资单' }),
  OperateSalaryFillingMoneyCreateButton: new Operate({ id: '8-13', key: 'OperateSalaryFillingMoneyCreateButton', title: '新建骑士补款按钮' }),
  OperateSalaryFillingMoneyVerifyButton: new Operate({ id: '8-16', key: 'OperateSalaryFillingMoneyVerifyButton', title: '骑士补款审核按钮' }),
  OperateSalaryDeductionsCreateButton: new Operate({ id: '8-15', key: 'OperateSalaryDeductionsCreateButton', title: '新建骑士扣款按钮' }),
  OperateSalaryDeductionsVerifyButton: new Operate({ id: '8-14', key: 'OperateSalaryDeductionsVerifyButton', title: '骑士扣款审核按钮' }),
  OperateSalaryPersonnalDeductCreateButton: new Operate({ id: '8-38', key: 'OperateSalaryPersonnalDeductCreateButton', title: '新建人事扣款按钮' }),
  OperateSalarySettingCreateButton: new Operate({ id: '8-17', key: 'OperateSalarySettingCreateButton', title: '新建薪资模版按钮' }),
  OperateSalarySettingVerifyButton: new Operate({ id: '8-18', key: 'OperateSalarySettingVerifyButton', title: '薪资模版审核按钮' }),
  OperateSalarySettingEditButton: new Operate({ id: '8-19', key: 'OperateSalarySettingEditButton', title: '薪资设置列表，编辑按钮' }),
  OperateSalarySettingStopButton: new Operate({ id: '8-40', key: 'OperateSalarySettingStopButton', title: '薪资设置列表，停用按钮' }),
  OperateSalarySettingCopyButton: new Operate({ id: '8-39', key: 'OperateSalarySettingCopyButton', title: '薪资设置列表，复制按钮' }),
  OperateSalarySettingWithdrawButton: new Operate({ id: '8-52', key: 'OperateSalarySettingWithdrawButton', title: '薪资设置列表，撤回按钮' }),

  // 我的账户
  MenuAccount: new Menu({ id: '7-0', key: 'MenuAccount', title: '我的账户', icon: 'solution' }),
  ModuleAccount: new Page({ id: '7-1', key: 'ModuleAccount', title: '我的账户', path: 'Account' }),
  ModuleAccountResign: new Page({ id: '7-2', key: 'ModuleAccountResign', title: '个人离职', path: 'Account/PersonalLeave' }),

  // 系统管理
  MenuSystem: new Menu({ id: '9-0', key: 'MenuSystem', title: '系统管理', icon: 'setting' }),
  ModuleSystemUser: new Page({ id: '9-1', key: 'ModuleSystemUser', title: '用户管理', path: 'System/User' }),
  ModuleSystemAccounts: new Page({ id: '9-22', key: 'ModuleSystemAccounts', title: '关联账号', path: 'System/Accounts' }),
  ModuleSystemAccountException: new Page({ id: '9-2', key: 'ModuleSystemAccountException', title: '异常账号记录', path: 'System/AccountException' }),
  ModuleSystemAccountExceptionManage: new Page({ id: '9-12', key: 'ModuleSystemAccountExceptionManage', title: '异常账号处理界面', path: 'System/AccountException/Manage' }),
  ModuleSystemField: new Page({ id: '9-4', key: 'ModuleSystemField', title: '字段管理', path: 'System/Field' }),
  // 暂时隐藏, 指标管理
  // ModuleSystemTarget: new Page({ id: '9-5', key: 'ModuleSystemTarget', title: '指标管理', path: 'System/Target' }),
  ModuleSystemSupplier: new Page({ id: '9-6', key: 'ModuleSystemSupplier', title: '供应商管理', path: 'System/Supplier' }),
  ModuleSystemSupplierDetail: new Page({ id: '9-5', key: 'ModuleSystemSupplierDetail', title: '查看详情', path: 'System/Supplier/Detail' }),
  ModuleSystemSupplierCreate: new Page({ id: '9-7', key: 'ModuleSystemSupplierCreate', title: '添加供应商', path: 'System/AddSupplier' }),
  ModuleSystemSupplierUpdate: new Page({ id: '9-8', key: 'ModuleSystemSupplierUpdate', title: '编辑供应商', path: 'System/EditSupplier' }),
  ModuleSystemSupplierRange: new Page({ id: '9-24', key: 'ModuleSystemSupplierRange', title: '业务分布情况（商圈）', path: 'System/Range/Supplier' }),
  ModuleSystemCityRange: new Page({ id: '9-25', key: 'ModuleSystemCityRange', title: '业务分布情况(城市)', path: 'System/Range/City' }),
  ModuleSystemSalaryIndex: new Page({ id: '9-9', key: 'ModuleSystemSalaryIndex', title: '骑士薪资指标库', path: 'System/SalaryIndex' }),
  ModuleSystemOperationManage: new Page({ id: '9-10', key: 'ModuleSystemOperationManage', title: '合同归属管理', path: 'System/OperationManage' }),
  ModuleSystemKnightType: new Page({ id: '9-11', key: 'ModuleSystemKnightType', title: '骑士类型设置', path: 'System/KnightType' }),
  OperateSystemCheckAccountException: new Operate({ id: '9-3', key: 'OperateSystemCheckAccountException', title: '操作异常账号' }),
  OperateSystemEditCompany: new Operate({ id: '9-13', key: 'OperateSystemEditCompany', title: '编辑|禁用按钮' }),
  OperateSystemAddCompany: new Operate({ id: '9-14', key: 'OperateSystemAddCompany', title: '添加公司按钮' }),
  OperateSystemUserSearch: new Operate({ id: '9-17', key: 'OperateSystemUserSearch', title: '添加用户,员工信息确认' }),
  OperateSystemUserPlatForm: new Operate({ id: '9-18', key: 'OperateSystemUserPlatForm', title: '添加用户,用户平台选项' }),
  OperateSystemUserArea: new Operate({ id: '9-20', key: 'OperateSystemUserArea', title: '添加用户,用户商圈选项' }),
  OperateSystemUserCity: new Operate({ id: '9-19', key: 'OperateSystemUserCity', title: '添加用户,用户城市选项' }),
  OperateSystemUserSupplier: new Operate({ id: '9-21', key: 'OperateSystemUserSupplier', title: '添加用户,用户供应商选项' }),
  OperateModuleSystemSupplierRange: new Operate({ id: '9-26', key: 'OperateModuleSystemSupplierRange', title: '异常账号提醒设置（操作）' }),
  OperateModuleSystemDistrict: new Operate({ id: '9-27', key: 'OperateModuleSystemDistrict', title: '启用|禁用商圈' }),

  // 全局
  hasPositionEmployeeEditIdCard: new Operate({ id: 'xxx', key: 'hasPositionEmployeeEditIdCard', title: '员工编辑,设置身份证' }),
  hasPositionEmployeeEditKnightType: new Operate({ id: 'xxx', key: 'hasPositionEmployeeEditKnightType', title: '员工编辑,设置骑士类型' }),
  knightTypeShow: new Operate({ id: 'xxx', key: 'knightTypeShow', title: '骑士类型权限' }),
  knightShow: new Operate({ id: 'xxx', key: 'knightShow', title: '骑士权限' }),
  // 高级设置
  MenuAdvanceSetting: new Menu({ id: '11-0', key: 'AdvanceSetting', title: '高级权限', icon: 'setting' }),
  OperateAdminManageHigherLevel: new Operate({ id: '11-1', key: 'OperateAdminManageHigherLevel', title: '向上跨级管理' }),
  OperateAdminManageLowerLevel: new Operate({ id: '11-2', key: 'OperateAdminManageLowerLevel', title: '向下跨级管理' }),
};
