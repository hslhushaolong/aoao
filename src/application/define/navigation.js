// 导航栏菜单结构
import Modules from './modules';

export default [
  // 超级管理
  {
    module: Modules.MenuAdmin,
    routes: [
      // 系统信息
      { module: Modules.ModuleAdminSystem },
      // 权限管理
      { module: Modules.ModuleAdminAuthorize },
      // 角色管理
      { module: Modules.ModuleAdminManagementRoles },
      // 开发参考模块
      { module: Modules.ModuleAdminInterface },
      // 开发测试模块
      { module: Modules.ModuleAdminDeveloper },
    ],
  },

  // 查询管理
  {
    module: Modules.MenuSearch,
    routes: [
      // 收支查询
      {
        module: Modules.ModuleSearchInquire,
        operations: [
          // 收支查询,限制城市级查询(站长,调度)
          { module: Modules.OperateBalanceSearchLimitCity },
        ],
      },
      // 分析报表
      { module: Modules.ModuleAnalysisReport },
    ],
  },

  // 操作管理
  {
    module: Modules.MenuOperation,
    routes: [
      // 上传KPI文件
      { module: Modules.ModuleOperationUploadKPI },
      // KPI模版设置
      {
        module: Modules.ModuleOperationKPITemplateList,
        relative: [
          // 编辑KPI模版
          { module: Modules.ModuleOperationKPIUpdate },
          // KPI模版详情
          { module: Modules.ModuleOperationKPIDetail },
          // 新建KPI模版
          { module: Modules.ModuleOperationKPIBuild },
        ],
      },
    ],
  },

  // 员工管理
  {
    module: Modules.MenuEmployee,
    routes: [
      // 查看员工
      {
        module: Modules.ModuleEmployeeSearch,
        operations: [
          // 导出EXCEL
          { module: Modules.OperateEmployeeSearchExportExcel },
          // 查看员工详情按钮
          {
            module: Modules.OperateEmployeeSearchDetailButton,
            relative: [
              // 员工详情
              { module: Modules.ModuleEmployeeDetail },
            ],
          },
          // 编辑员工信息按钮
          {
            module: Modules.OperateEmployeeSearchEditButton,
            relative: [
              // 员工编辑
              {
                module: Modules.ModuleEmployeeUpdate,
                operations: [
                  // 商圈选项
                  { module: Modules.OperateEmployeePermission },
                ],
              },
            ],
          },
          // 离职按钮
          { module: Modules.OperateEmployeeResignVerifyForceButton },
        ],
        relative: [


        ],
      },
      // 添加员工
      {
        module: Modules.ModuleEmployeeCreate,
        operations: [
          // 添加员工,批量上传骑士(站长，调度)
          { module: Modules.OperateEmployeeUploadKnight },
          // 添加员工,平台是否多选(城市经理以上多选)
          { module: Modules.OperateEmployeeAddEmployeePlatForm },
          // 添加员工，城市是否可多选
          { module: Modules.OperateEmployeeCreateCityModeButton },
          // 添加员工，商圈是否显示
          { module: Modules.OperateEmployeeCreateDistrictShowButton },
          // 添加员工,商圈是否多选
          { module: Modules.OperateEmployeeAddEmployeeDistrict },
          // 添加员工,获取合同归属列表(除超管外都可见)
          // { module: Modules.OperateEmployeeContractAttribution },

        ],
      },
      // 离职审批
      {
        module: Modules.ModuleEmployeeResign,
        operations: [
          // 离职审核按钮
          { module: Modules.OperateEmployeeResignVerifyButton },
        ],
      },
      // 工号管理
      {
        module: Modules.ModuleEmployeeDelivery,
        relative: [

          // 工号详情
          { module: Modules.ModuleEmployeeDeliveryDetail },
        ],
        operations: [
          // 工号管理,启用／停用按钮
          {
            module: Modules.OperateEmployeeDeliveryStartButton,
            relative: [
              // 工号编辑
              { module: Modules.ModuleEmployeeDeliveryEdit },
            ],
          },
        ],
      },
      // 今日待入职员工
      {
        module: Modules.ModuleEmployeeTodayEntry,
        relative: [
          // 待入职员工编辑
          { module: Modules.ModuleEmployeeTodayEntryEdit },
        ],
      },
    ],
  },

  // 物资管理
  {
    module: Modules.MenuMateriel,
    routes: [
      // 库存信息
      {
        module: Modules.MenuMaterielStores,
        routes: [
          // 查看库存
          {
            module: Modules.ModuleMaterielStoresSearch,
            operations: [
              // 变动明细按钮
              {
                module: Modules.OperateMaterielStoresLogDetailButton,
                relative: [
                  // 变动明细
                  { module: Modules.ModuleMaterielStoresLogDetail },
                ],
              },
            ],
          },
          // 品目明细
          {
            module: Modules.ModuleMaterielStoresItem,

            operations: [
              // 添加品目按钮
              { module: Modules.OperateMaterielStoresItemCreateButton },
              // 编辑品目按钮
              { module: Modules.OperateMaterielStoresItemEditButton },
            ],
          },
          // 查看骑士物资
          {
            module: Modules.ModuleMaterielStoresKnight,
            relative: [
              // 物资详情
              { module: Modules.ModuleMaterielStoresKnightDetail },
            ],
          },
        ],
      },

      // 采购|报废
      {
        module: Modules.MenuMaterielPurchase,
        routes: [
          // 采购|报废记录
          {
            module: Modules.ModuleMaterielPurchaseLog,
            relative: [
              // 查看详情
              { module: Modules.ModuleMaterielPurchaseDetail },

            ],
            operations: [
              // 采购|报废审核按钮
              { module: Modules.OperateMaterielPurchaseVerifyButton },
              // 报错审核按钮
              {
                module: Modules.OperateMaterielPurchaseErrorVerifyButton,
                relative: [

                  // 报错单
                  { module: Modules.ModuleMaterielPurchaseErrorOrder },
                ],
              },

              // 报错审核按钮
              { module: Modules.OperateMaterielPurchaseWrongVerifyButton },
            ],
          },
          // 新建物资采购|报废
          { module: Modules.ModuleMaterielPurchaseCreate },
        ],

        operations: [


          // 报废审核按钮
          // { module: Modules.OperateMaterielPurchaseScrapVerifyButton },

        ],
      },
      // 分发|退货记录
      {
        module: Modules.MenuMaterielDispatch,
        routes: [
          // 分发|退货记录
          {
            module: Modules.ModuleMaterielDispatcherLog,
            relative: [
              // 查看详情
              { module: Modules.ModuleMaterielDispatcherDetail },
            ],
            operations: [
              // 分发|退货审核按钮
              { module: Modules.OperateMaterielDispatchRetritVerifyButton },
            ],
          },
          // 新建物资分发
          { module: Modules.ModuleMaterielDispatcherCreate },
        ],
      },
    ],
  },

  // 费用管理
  {
    module: Modules.MenuExpense,
    routes: [
      // 科目设置
      {
        module: Modules.ModuleExpenseSubject,
        operations: [
          // 科目编辑新建
          { module: Modules.OperateExpenseSubjectEditButton },
        ],
      },
      // 审批流设置
      {
        module: Modules.ModuleExpenseExamine,
        operations: [
          // 审批流编辑新建
          { module: Modules.OperateExpenseExamineEditButton },
        ],
        relative: [
          // 审批流新增页面
          {
            module: Modules.ModuleExpenseExamineNew,
          },
          // 审批流编辑页面
          {
            module: Modules.ModuleExpenseExamineEdit,
          },
        ],
      },
      // 费用类型设置
      {
        module: Modules.ModuleExpenseType,
        operations: [
          // 费用类型编辑新建
          { module: Modules.OperateExpenseExpenseTypeButton },
        ],
        relative: [
          // 费用类型设置新建
          {
            module: Modules.ModuleExpenseTypeCreate,
          },
          // 费用类型设置编辑
          {
            module: Modules.ModuleExpenseTypeEdit,
          },
        ],
      },
      // 新建费用申请
      {
        module: Modules.ModuleExpenseManageCreate,
        relative: [
          // 费用申请创建
          { module: Modules.ModuleExpenseManageTemplateCreate },
          // 费用申请编辑
          { module: Modules.ModuleExpenseManageTemplateUpdate },
          // 费用申请详情页
          { module: Modules.ModuleExpenseManageTemplateDetail },
          // 费用申请汇总
          { module: Modules.ModuleExpenseManageSummaryCreate },
          // 费用申请汇总详情
          { module: Modules.ModuleExpenseManageSummaryDetail },
        ],
      },
      // 费用申请/审核记录
      {
        module: Modules.ModuleExpenseManageAudit,
        operations: [
          // 审批单编辑
          { module: Modules.OperateExpenseManageEditButton },
          // 审批单审批
          { module: Modules.OperateExpenseManageApprovalButton },
           // 费用申请详情页
           { module: Modules.ModuleExpenseManageTemplateDetail },
           // 费用申请汇总详情
           { module: Modules.ModuleExpenseManageSummaryDetail },
        ],
      },
      // 记录明细
      {
        module: Modules.ModuleExpenseManageRecords,
        relative: [
          // 编辑明细列表
          { module: Modules.ModuleExpenseManageRecordsSummaryCreate },
          // 编辑明细记录
          { module: Modules.ModuleExpenseManageRecordsForm },
          // 明细记录详情
          { module: Modules.ModuleExpenseManageRecordsDetail },
        ],
        operations: [
          // 项目明细续租／断租等
          { module: Modules.OperateExpenseManageRecordsEditButton },
        ],
      },
    ],
  },

  // 薪资管理
  {
    module: Modules.MenuSalary,
    routes: [
      // 薪资汇总
      {
        module: Modules.ModuleSalarySearch,
        relative: [
          {
            // 薪资更新任务
            module: Modules.ModuleSalaryTask,
          },
          // 城市薪资明细
          {
            module: Modules.ModuleSalarySearchRecords,
            operations: [
              // 批量缓发按钮
              { module: Modules.OperateSalarySearchRecordsDelayButton },
            ],
            relative: [
              // 骑士薪资明细
              { module: Modules.ModuleSalarySearchDetail },
            ],
          },
        ],
        operations: [
          // 薪资汇总查询，同意驳回操作
          { module: Modules.OperateSalarySearchSummaryManagement },
          // 薪资汇总查询，提交薪资单审核
          { module: Modules.OperateSalarySearchSummarySubmit },
          // 薪资汇总查询，更新薪资单
          { module: Modules.OperateSalarySearchSummaryUpdate },
          // 薪资汇总查询，撤回薪资单
          { module: Modules.OperateSalarySearchSummaryRevert },
        ],
      },
      // 薪资缓发|补发明细
      {
        module: Modules.ModuleFinanceSalary,
        operations: [
          // 提交审批按钮
          { module: Modules.OperateFinanceSalarySubmitButton },
          // 导出EXCEL按钮-去除导出功能
          // { module: Modules.OperateFinanceSalaryExcelButton },
        ],
      },
      // 薪资设置
      {
        module: Modules.ModuleSalarySetting,
        relative: [

          // 查看详情
          { module: Modules.ModuleSalarySettingDetail },
        ],
        operations: [
          // 新建薪资模版按钮
          {
            module: Modules.OperateSalarySettingCreateButton,
            relative: [
              // 新建薪资模板
              { module: Modules.ModuleSalarySettingCreate },
            ],
          },
          // 薪资模版审核按钮
          { module: Modules.OperateSalarySettingVerifyButton },
          // 薪资设置列表，编辑按钮
          { module: Modules.OperateSalarySettingEditButton },
          // 薪资设置列表，停用按钮
          { module: Modules.OperateSalarySettingStopButton },
          // 薪资设置列表，复制按钮
          { module: Modules.OperateSalarySettingCopyButton },
          // 薪资设置列表，撤回按钮
          { module: Modules.OperateSalarySettingWithdrawButton },
        ],
      },
      // 薪资发放
      {
        module: Modules.ModuleSalaryDistribute,
        operations: [
          // 薪资汇总查询，下载薪资单
          { module: Modules.OperateSalaryDistributeDownload },
        ],
      },
      // 骑士扣款
      {
        module: Modules.ModuleSalaryManageKnightDeduct,
        operations: [
          // 新建骑士扣款按钮
          {
            module: Modules.OperateSalaryDeductionsCreateButton,
          },
          // 骑士扣款审核按钮(5.4.1版本隐藏)
          // { module: Modules.OperateSalaryDeductionsVerifyButton },
        ],
        relative: [
          // 新建骑士扣款
          { module: Modules.ModuleSalaryManageKnightDeductCreate },
          // 编辑骑士扣款
          { module: Modules.ModuleSalaryManageKnightDeductEdit },
          // 查看骑士扣款详情
          { module: Modules.ModuleSalaryManageKnightDeductDetail },
        ],
      },
      // 骑士扣款（审核）
      {
        module: Modules.ModuleSalaryManageKnightDeductVerify,
        relative: [
          // 骑士扣款，审核，详情
          { module: Modules.ModuleSalaryManageKnightDeductVerifyDetail },
        ],
      },
      // 骑士补款
      {
        module: Modules.ModuleSalaryManageKnightSupplement,
        relative: [
          // 查看骑士补款详情
          { module: Modules.ModuleSalaryManageKnightSupplementDetail },
          // 新建骑士补款
          { module: Modules.ModuleSalaryManageKnightSupplementCreate },
          // 编辑骑士补款
          { module: Modules.ModuleSalaryManageKnightSupplementEdit },
        ],
        operations: [
          // 新建骑士补款按钮
          { module: Modules.OperateSalaryFillingMoneyCreateButton },
          // 骑士补款审核按钮(5.4.1版本隐藏权限)
          // { module: Modules.OperateSalaryFillingMoneyVerifyButton },
        ],
      },
      // 骑士补款-审核
      {
        module: Modules.ModuleSalaryManageKnightSupplementVerify,
        relative: [
          // 骑士补款-审核，详情
          { module: Modules.ModuleSalaryManageKnightSupplementVerifyDetail },
        ],
      },
      // 人事扣款
      {
        module: Modules.ModuleSalaryManageHumanResourcesDeduct,
        relative: [
          // 查看人事扣款详情
          { module: Modules.ModuleSalaryManageHumanResourcesDeductDetail },
          // 新建人事扣款
          { module: Modules.ModuleSalaryManageHumanResourcesDeductCreate },
          // 编辑人事扣款
          { module: Modules.ModuleSalaryManageHumanResourcesDeductEdit },
        ],
        operations: [
          // 新建人事扣款按钮
          { module: Modules.OperateSalaryPersonnalDeductCreateButton },
        ],
      },
      // 人事扣款,审核
      {
        module: Modules.ModuleSalaryManageHumanResourcesDeductVerify,
        relative: [
          // 查看人事扣款,审核详情
          { module: Modules.ModuleSalaryManageHumanResourcesDeductVerifyDetail },
        ],
      },
    ],
  },

  // 我的账户
  {
    module: Modules.MenuAccount,
    routes: [
      // 我的账户
      { module: Modules.ModuleAccount },
      // 个人离职
      { module: Modules.ModuleAccountResign },
    ],
  },

  // 系统管理
  {
    module: Modules.MenuSystem,
    routes: [
      // 用户管理
      {
        module: Modules.ModuleSystemUser,
        operations: [
          // 添加用户,员工信息确认
          { module: Modules.OperateSystemUserSearch },
          // 添加用户,用户供应商选项
          { module: Modules.OperateSystemUserSupplier },
          // 添加用户,用户平台选项
          { module: Modules.OperateSystemUserPlatForm },
          // 添加用户,用户城市选项
          { module: Modules.OperateSystemUserCity },
          // 添加用户,用户商圈选项
          { module: Modules.OperateSystemUserArea },
        ],
      },
      // 关联账号
      {
        module: Modules.ModuleSystemAccounts,
        operations: [
          // 添加账号
          // 编辑账号
          // 全部解除关联
        ],
      },
      // 字段管理 TODO 暂时隐藏
      // { module: Modules.ModuleSystemField,  },
      // 指标管理 TODO 暂时隐藏
      // { module: Modules.ModuleSystemTarget,  },
      // 供应商管理
      {
        module: Modules.ModuleSystemSupplier,
        relative: [
          // 供应商管理-查看详情
          { module: Modules.ModuleSystemSupplierDetail },
          // 添加供应商
          { module: Modules.ModuleSystemSupplierCreate },
          // 编辑供应商
          { module: Modules.ModuleSystemSupplierUpdate },
          // 业务分布情况(商圈)
          {
            module: Modules.ModuleSystemSupplierRange,
            operations: [
              {
                module: Modules.OperateModuleSystemSupplierRange,
              }, {
                module: Modules.OperateModuleSystemDistrict,
              },
            ],
          },
          // 业务分布情况(城市)
          { module: Modules.ModuleSystemCityRange },
        ],
      },
      // 骑士类型设置
      { module: Modules.ModuleSystemKnightType },
      // 骑士薪资指标库
      { module: Modules.ModuleSystemSalaryIndex },
      // 合同归属管理
      {
        module: Modules.ModuleSystemOperationManage,
        operations: [
          // 编辑|禁用按钮
          { module: Modules.OperateSystemEditCompany },
          // 添加公司按钮
          { module: Modules.OperateSystemAddCompany },
        ],
      },
      // 异常账号管理
      { module: Modules.ModuleSystemAccountException },

    ],
    relative: [
      // 异常账号处理界面
      {
        module: Modules.ModuleSystemAccountExceptionManage,
        operations: [
          // 操作异常账号
          { module: Modules.OperateSystemCheckAccountException },
        ],
      },
    ],
  },
  // 高级管理
  {
    module: Modules.MenuAdvanceSetting,
    operations: [
      // 向下跨级管理
      { module: Modules.OperateAdminManageLowerLevel },
      // 向上跨级管理
      { module: Modules.OperateAdminManageHigherLevel },
    ],
  },
];
