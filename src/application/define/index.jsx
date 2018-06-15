import dot from 'dot-prop';
import Modules from './modules';

// 单位类型定义（价格，距离）
const Unit = {
  price: 100,     // 价格单位（元）换算／100
  distance: 1000, // 距离单位（米）换算／1000
  description(rawValue) {
    switch (rawValue) {
      case this.price: return '元';
      case this.distance: return '千米';
      default: return '未定义';
    }
  },
  // 换算价格, 换算成元
  exchangePriceToYuan(price) {
    return price / Unit.price;
  },
  // 换算价格, 换算成分
  exchangePriceToCent(price) {
    return price * Unit.price;
  },
  // 换算距离, 换算成千米
  exchangeDistanceToKilometre(distance) {
    return distance / Unit.distance;
  },
  // 换算距离, 换算成米
  exchangeDistanceToMetre(distance) {
    return distance * Unit.distance;
  },
};
// 电话号码正则验证
const PhoneRegExp = /^1[13456789]\d{9}$/;
// 账户状态
const AccountState = {
  on: 100,
  off: -100,
  description(rawValue) {
    switch (rawValue) {
      case this.on: return '可用';
      case this.off: return '禁用';
      default: return '--';
    }
  },
};

// 账户招聘渠道
const AccountRecruitmentChannel = {
  third: 5001,
  personal: 5002,
  other: 5003,
  description(rawValue) {
    switch (rawValue) {
      case this.third: return '第三方';
      case this.personal: return '个人';
      case this.other: return '其他';
      default: return '--';
    }
  },
};

// 性别
const Gender = {
  male: 10,
  female: 20,
  description(rawValue) {
    switch (rawValue) {
      case this.male: return '男';
      case this.female: return '女';
      default: return '未知';
    }
  },
};

// 薪资模版指标数据
const SalaryIndex = {
  none: 1,
  description(rawValue) {
    switch (rawValue) {
      case this.none: return '指标数据待定';
      default: return '未定义';
    }
  },
};

// 薪资模版中满足的条件关系
const SalaryCondition = {
  all: 2,         // 同时满足
  atLeastOne: 3,  // 至少满足其中一个
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.all: return '全部';
      case this.atLeastOne: return '任一';
      default: return '未定义';
    }
  },
};

// 薪资模板设置审核状态
const SalaryVerifyState = {
  saving: 13000,    // 待提交
  pendding: 13001,  // 待审核
  waiting: 13002,   // 待使用
  reject: 13003,    // 审核未通过
  working: 13004,   // 使用中
  stoping: 13005,   // 停用
  remove: 13006,    // 删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.saving: return '待提交';
      case this.pendding: return '待审核';
      case this.waiting: return '待使用';
      case this.reject: return '不通过';
      case this.working: return '使用中';
      case this.stoping: return '停用';
      case this.remove: return '删除';
      default: return '未定义';
    }
  },
};

// 薪资模板中的逻辑公式
const SalaryFormula = {
  1: 'A<指标<B',
  2: '指标<A',
  7: '指标<=A',
  3: '指标>A',
  6: '指标>=A',
  4: '指标=A',
  5: '指标!=A',

  // 返回当前对象的keys
  keys() {
    return [1, 2, 7, 3, 6, 4, 5];
  },

  // 获取参数的数量
  getOptionsCount(index) {
    if (Number(index) === 1) {
      return 2;
    }
    return 1;
  },

  // 根据参数，返回公式
  formula(index, options = {}, specification = '指标') {
    const x = dot.get(options, 'x', 0);
    const y = dot.get(options, 'y', 0);

    switch (Number(index)) {
      case 1: return <div>{x} &lt; {specification} &lt; {y}</div>;
      case 2: return <div>{specification} &lt; {x}</div>;
      case 3: return <div>{specification} &gt; {x}</div>;
      case 4: return <div>{specification} = {x} </div>;
      case 5: return <div>{specification} != {x} </div>;
      case 6: return <div>{specification} &gt;= {x} </div>;
      case 7: return <div>{specification} &lt;= {x} </div>;
      default: return '';
    }
  },
};

// 薪资任务的状态
const SalaryTaskState = {
  waiting: 150000,    // 待执行
  working: 150001,    // 执行中
  finish: 150002,     // 执行成功
  reject: 150003,     // 异常
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.waiting: return '待更新';
      case this.working: return '更新中';
      case this.finish: return '更新成功';
      case this.reject: return '异常';
      default: return '未定义';
    }
  },
};

// 薪资任务更新时间段
const SalaryTaskTime = {
  earlyMonth: 101000,   // 上半月
  lastMonth: 101001,    // 下半月
  earlyPeriod: 101002,  // 上旬
  middlePeriod: 101003, // 中旬
  lastPeriod: 101004,   // 下旬
  weekOne: 101005,      // 第一周
  weekTwo: 101006,      // 第二周
  weekThree: 101007,    // 第三周
  weekFour: 101008,     // 第四周
  daily: 101009,        // 天
  month: 101010,        // 月
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.earlyMonth: return '上半月';
      case this.lastMonth: return '下半月';
      case this.earlyPeriod: return '上旬';
      case this.middlePeriod: return '中旬';
      case this.lastPeriod: return '下旬';
      case this.weekOne: return '第一周';
      case this.weekTwo: return '第二周';
      case this.weekThree: return '第三周';
      case this.weekFour: return '第四周';
      case this.daily: return '天';
      case this.month: return '月';
      default: return '未定义';
    }
  },
};

// 骑士工作性质
const JobCategory = {
  fulltimeDaily: 3001,        // 全职白班
  fulltimeNight: 3002,        // 全职夜班
  fulltimeBreakfast: 3003,    // 全职早餐
  parttime: 3004,             // 兼职

  description(rawValue) {
    switch (Number(rawValue)) {
      case this.fulltimeDaily: return '全职白班';
      case this.fulltimeNight: return '全职夜班';
      case this.fulltimeBreakfast: return '全职早餐';
      case this.parttime: return '兼职';
      default: return '未定义';
    }
  },
};

// NOTE: 站长和调度枚举址互换
// 角色
const Roles = {
  superAdmin: 1000,             // 超级管理员
  coo: 1001,                    // COO
  chiefOperatingManager: 1002,  // 运营管理
  chiefManager: 1003,           // 总监
  cityManager: 1004,            // 城市经理
  cityAssistant: 1005,          // 城市助理
  dispatcher: 1006,             // 调度
  stationManager: 1007,         // 站长
  buyer: 1008,                  // 采购
  postmanManager: 1009,         // 骑士长
  postman: 1010,                // 骑士
  chiefProjectManager: 1011,    // 项目总监
  personnelDirector: 1012,      // 人事总监
  // oa新增
  baSupremo: 1014,         // 巴朕巴总
  supremoAssistant: 1015,  // 总裁特别助理
  financePrincipal: 1016,   // 财务负责人
  financeManager: 1017,     // 财务经理
  cashier: 1018,           // 出纳
  personnel: 1019,         // 人事专员
  ceo: 1020,               // CEO

  description(rawValue) {
    switch (Number(rawValue)) {
      case this.superAdmin: return '超级管理员';
      case this.coo: return 'COO';
      case this.chiefOperatingManager: return '运营管理';
      case this.chiefManager: return '总监';
      case this.cityManager: return '城市经理';
      case this.cityAssistant: return '城市助理';
      case this.dispatcher: return '调度';
      case this.stationManager: return '站长';
      case this.buyer: return '采购';
      case this.baSupremo: return '巴朕巴总';
      case this.supremoAssistant: return '总裁特别助理';
      case this.financePrincipal: return '财务负责人';
      case this.financeManager: return '财务经理';
      case this.cashier: return '出纳';
      case this.personnel: return '人事专员';
      case this.personnelDirector: return '人事总监';
      case this.ceo: return 'CEO';
      case this.postmanManager: return '骑士长';
      case this.postman: return '骑士';
      case this.chiefProjectManager: return '项目总监';
      default: return '未定义';
    }
  },
};

// 角色状态
const RoleState = {
  available: 1,  // 可用
  disable: 0,    // 不可用
  deleted: -1,   // 删除（前端不显示
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.available: return '正常';
      case this.disable: return '禁用';
      case this.deleted: return '删除';
      default: return '未定义';
    }
  },
};

// 模块的状态
const ModuleState = {
  access: 1,
  forbid: 0,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.access: return '可访问';
      case this.forbid: return '禁止访问';
      default: return '未定义';
    }
  },
};

// NOTE: 站长和调度枚举址互换
// 员工职位
const Position = {
  superAdmin: 1000,             // 超级管理员
  coo: 1001,                    // coo
  chiefProjectManager: 1011,    // 项目总监
  chiefOperatingManager: 1002,  // 运营管理
  chiefManager: 1003,     // 总监
  cityManager: 1004,      // 城市经理
  cityAssistant: 1005,    // 城市助理
  dispatcher: 1006,       // 调度
  stationManager: 1007,   // 站长
  buyer: 1008,            // 采购
  postmanManager: 1009,   // 骑士长
  postman: 1010,          // 骑士
  client: 1020,           // 客户
  tester: 1016,           // 测试
  hr: 1017,               // 人事

  description(rawValue) {
    switch (Number(rawValue)) {
      case this.superAdmin: return '超级管理员';
      case this.coo: return 'coo';
      case this.chiefProjectManager: return '项目总监';
      case this.chiefOperatingManager: return '运营管理';
      case this.chiefManager: return '总监';
      case this.cityManager: return '城市经理';
      case this.cityAssistant: return '城市助理';
      case this.dispatcher: return '调度';
      case this.buyer: return '采购';
      case this.stationManager: return '站长';
      case this.postmanManager: return '骑士长';
      case this.postman: return '骑士';
      case this.client: return '客户';
      case this.tester: return '测试';
      case this.hr: return '人事';
      default: return '未定义';
    }
  },
};

// 应聘渠道
const RecruitmentChannel = {
  third: 5001,    // 第三方
  personal: 5002, // 个人
  other: 5003,    // 其他
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.third: return '第三方';
      case this.personal: return '个人';
      case this.other: return '其他';
      default: return '未定义';
    }
  },
};

// 员工是否在职
const DutyState = {
  onDuty: 50,           // 在职
  onResignToApprove: 1, // 离职待审核
  onResign: -50,        // 离职
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.onDuty: return '在职';
      case this.onResignToApprove: return '离职待审核';
      case this.onResign: return '离职';
      default: return '--';
    }
  },
};

// 合同归属
const ContractBelong = {
  quhuo: 4001,     // 趣活
  bodu: 4002,      // 伯渡
  changda: 4003,   // 盛世昌达
  zhongxin: 4004,  // 众鑫
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.quhuo: return '趣活';
      case this.bodu: return '伯渡';
      case this.changda: return '盛世昌达';
      case this.zhongxin: return '众鑫';
      default: return '未定义';
    }
  },
};

// 骑士类型状态定义
const KnightTypeState = {
  on: 60,
  off: -60,
  description(rawValue) {
    switch (rawValue) {
      case this.on: return '启用';
      case this.off: return '禁用';
      default: return '未定义';
    }
  },
};

// 平台定义
const Platform = {
  elem: 'elem',
  baidu: 'baidu',
  meituan: 'meituan',
  description(rawValue) {
    switch (rawValue) {
      case this.elem: return '饿了么';
      case this.baidu: return '百度';
      case this.meituan: return '美团';
      default: return '未定义';
    }
  },
};

// 骑士工作性质
const KnightTypeWorkProperty = {
  fulltime: 3001,
  parttime: 3002,
  description(rawValue) {
    switch (rawValue) {
      case this.fulltime: return '全职';
      case this.parttime: return '兼职';
      default: return '未定义';
    }
  },
  rawValue(description) {
    switch (description) {
      case '全职': return this.fulltime;
      case '兼职': return this.parttime;
      default: return undefined;
    }
  },
};

// 薪资发放状态
const SalaryPaymentState = {
  normal: 19001,
  delayed: 19002,
  reissue: 19003,
  notPay: 19004,
  paying: 19005,
  description(rawValue) {
    switch (rawValue) {
      case this.normal: return '正常';
      case this.delayed: return '缓发';
      case this.reissue: return '补发成功';
      case this.notPay: return '不发薪';
      case this.paying: return '补发中';
      default: return '未定义';
    }
  },
};

// 薪资计算周期-兼职
const SalaryPaymentCricle = {
  month: 14000,
  halfMonth: 14001,
  week: 14002,
  daily: 14003,
  asMonth: 14004,
  period: 14005,
  description(rawValue) {
    switch (rawValue) {
      case this.month: return '按月';
      case this.halfMonth: return '按半月';
      case this.week: return '按周';
      case this.daily: return '按天';
      case this.asMonth: return '按月'; // 试算月份
      case this.period: return '按旬';
      default: return '未定义';
    }
  },
};

// 薪资单审核状态
const SalaryRecordState = {
  waiting: 10000,
  pendding: 10001,
  success: 10002,
  failure: 10003,
  description(rawValue) {
    switch (rawValue) {
      case this.waiting: return '待提交';
      case this.pendding: return '待审核';
      case this.success: return '审核通过';
      case this.failure: return '未通过';
      default: return '未定义';
    }
  },
};

// 薪资汇总审核状态
const SalarySummaryState = {
  waiting: 15000,
  pendding: 15001,
  success: 15002,
  failure: 15003,
  description(rawValue) {
    switch (rawValue) {
      case this.waiting: return '待提交';
      case this.pendding: return '待审核';
      case this.success: return '审核通过';
      case this.failure: return '未通过';
      default: return '未定义';
    }
  },
};
// 骑士扣款审核状态
const SalaryKnightState = {
  finished: 130001,
  unfinished: 130002,
  description(state) {
    switch (state) {
      case this.finished: return '已完成';
      case this.unfinished: return '未完成';
      default: return '未定义';
    }
  },
};
// 薪资计算完成状态
const SalarySummaryFlag = {
  finish: true,
  process: false,
  description(rawValue) {
    switch (rawValue) {
      case this.finish: return '计算完成';
      case this.process: return '计算中';
      default: return '未定义';
    }
  },
};

// 薪资生成状态
const SalaryProduceState = {
  testing: 17001,
  actual: 17002,
  description(rawValue) {
    switch (rawValue) {
      case this.testing: return '试算';
      case this.actual: return '实际';
      default: return '未定义';
    }
  },
};

// 财务申请状态
const FinanceApplyState = {
  waiting: 20013,   // 待提交
  pendding: 20010,  // 待审核
  reject: 20011,    // 审核未通过
  success: 20012,   // 审核通过
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.waiting: return '待提交';
      case this.pendding: return '待审核';
      case this.reject: return '审核未通过';
      case this.success: return '审核通过';
      default: return '未定义';
    }
  },
};

// 工资单汇总类型
const SalaryCollectType = {
  monthTesting: 16000,  // 月算试算汇总
  month: 16001,         // 月算汇总
  partTimeMonth: 16002, // 兼职月算汇总
  halfMonth: 16003,     // 半月算汇总
  week: 16004,          // 周算汇总
  daily: 16005,         // 日算汇总
  description(rawValue) {
    switch (rawValue) {
      case this.monthTesting: return '月算试算汇总';
      case this.month: return '月算汇总';
      case this.partTimeMonth: return '兼职月算汇总';
      case this.halfMonth: return '半月算汇总';
      case this.week: return '周算汇总';
      case this.daily: return '日算汇总';
      default: return '未定义';
    }
  },
};

// 骑士扣补款类型
const KnightSalaryType = {
  deduction: 11001,  // 扣款
  fillingMoney: 11002,  // 补款
  personnalDeduct: 11003,  // 人事扣款
  description(rawValue) {
    switch (rawValue) {
      case this.deduction: return '骑士扣款';
      case this.fillingMoney: return '骑士补款';
      case this.personnalDeduct: return '人事扣款';
      default: return '未定义';
    }
  },
};

// 扣补款审核状态
const KnightSalaryApproveState = {
  disagree: 12001,    // 待提交
  pendding: 12002,  // 待审核
  reject: 12004,    // 审核未通过
  success: 12003,   // 审核通过
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.pendding: return '待审核';
      case this.disagree: return '待提交';
      case this.reject: return '未通过';
      case this.success: return '审核通过';
      default: return '未定义';
    }
  },
};

// 扣款汇总页面完成类型
const KnightDeductComplateState = {
  uncommitted: 12001,
  unfinished: 12002,
  finished: 12003,
  description(rawValue) {
    switch (rawValue) {
      case this.uncommitted: return '待提交';
      case this.unfinished: return '未完成';
      case this.finished: return '已完成';
      default: return '未定义';
    }
  },
};

// 扣款汇总页面完成类型
const FillingType = {
  pageInput: 21001,
  excelUpload: 21002,
  description(rawValue) {
    switch (rawValue) {
      case this.pageInput: return '页面输入';
      case this.excelUpload: return '模板上传';
      default: return '未定义';
    }
  },
};
// 扣款项目类型
const CutEventType = {
  cut_platform_offline: 22001,
  cut_accommodation: 22002,
  cut_energy_charge: 22003,
  cut_stipulate: 22004,
  cut_casualty: 22005,
  cut_social_security: 22006,
  cut_electrombile: 22007,
  cut_equip: 22008,
  cut_equip_cash_pledge: 22009,
  cut_other: 22010,
  description(rawValue) {
    switch (rawValue) {
      case this.cut_platform_offline: return '平台线下罚款';
      case this.cut_accommodation: return '住宿／房租扣款';
      case this.cut_energy_charge: return '水电网费扣款';
      case this.cut_stipulate: return '违反站内管理扣款';
      case this.cut_casualty: return '意外险扣款';
      case this.cut_social_security: return '社保代缴扣款（单位承担）';
      case this.cut_electrombile: return '电动车扣款';
      case this.cut_equip: return '装备扣款';
      case this.cut_equip_cash_pledge: return '装备押金扣款';
      case this.cut_other: return '其他扣款';
      default: return '未定义';
    }
  },
};

// 扣款项目类型
const FillingEventType = {
  subsidy_special_time: 22001,
  subsidy_special_season: 22002,
  subsidy_weather: 22003,
  subsidy_recommend_entry: 22004,
  subsidy_checking: 22005,
  subsidy_order_num: 22006,
  subsidy_kf_remission: 22007,
  subsidy_seniority: 22008,
  subsidy_charge: 22009,
  subsidy_car: 22010,
  subsidy_phone: 22011,
  subsidy_equip_return: 22012,
  subsidy_other: 22013,
  description(rawValue) {
    switch (rawValue) {
      case this.subsidy_special_time: return '特殊时段补贴';
      case this.subsidy_special_season: return '特殊季节补贴';
      case this.subsidy_weather: return '恶劣天气补贴';
      case this.subsidy_recommend_entry: return '优秀员工奖励';
      case this.subsidy_checking: return '调整考勤差异';
      case this.subsidy_order_num: return '调整单量差异';
      case this.subsidy_kf_remission: return '扣罚减免';
      case this.subsidy_seniority: return '工龄补助';
      case this.subsidy_charge: return '充电补助';
      case this.subsidy_car: return '车补';
      case this.subsidy_phone: return '话补';
      case this.subsidy_equip_return: return '装备押金返还';
      case this.subsidy_other: return '其他补款';
      default: return '未定义';
    }
  },
};

// 扣款项目类型
const PersonalCutEventType = {
  inter_bank_cost: 22001,
  cut_equip: 22002,
  cut_equip_cash_deposit: 22003,
  cut_third_part: 22004,
  description(rawValue) {
    switch (rawValue) {
      case this.inter_bank_cost: return '跨行费用';
      case this.cut_equip: return '装备扣款';
      case this.cut_equip_cash_deposit: return '装备保证金';
      case this.cut_third_part: return '三方扣款';
      default: return '未定义';
    }
  },
};

// 提交状态类别
const DeductSubmitType = {
  finished: 130001, // 已完成
  unfinished: 130002, // 未完成
  waitForSubmit: 130003, // 待提交
  description(rawValue) {
    switch (rawValue) {
      case this.waitForSubmit: return '待提交';
      case this.unfinished: return '未完成';
      case this.finished: return '已完成';
      default: return '未定义';
    }
  },
};

// 费用类型
const ExpenseType = {
  rent: 2,
  refund: 1,
  salary: 3,
  records: 4,
  description(rawValue) {
    switch (rawValue) {
      case this.rent: return '租房';
      case this.refund: return '报销';
      case this.salary: return '薪资';
      case this.records: return '明细';
      default: return '未定义';
    }
  },
  // 内部定义模版类型
  templateName(rawValue) {
    switch (rawValue) {
      case this.rent: return '模版一';   // 租房
      case this.refund: return '模版二'; // 报销
      default: return '未定义';
    }
  },
};

// 费用的成本中心
const ExpenseCostCenter = {
  project: 1,
  headquarter: 2,
  city: 3,
  district: 4,
  knight: 5,
  description(rawValue) {
    switch (rawValue) {
      case this.project: return '项目总部';
      case this.headquarter: return '项目主体总部';
      case this.city: return '城市';
      case this.district: return '商圈';
      case this.knight: return '骑士';
      default: return '未定义';
    }
  },
};

// 费用的成本归属
const ExpenseCostBelong = {
  average: 6,
  percent: 7,
  custom: 8,
  description(rawValue) {
    switch (rawValue) {
      case this.average: return '平均分摊';
      case this.percent: return '单量比例分摊';
      case this.custom: return '自定义分摊';
      default: return '未定义';
    }
  },
};

// 费用的房屋状态
const ExpenseHouseState = {
  new: 1,
  continue: 2,
  sign: 3,
  break: -1,
  cancel: 0,
  description(rawValue) {
    switch (rawValue) {
      case this.new: return '新租';
      case this.continue: return '续租';
      case this.sign: return '续签';
      case this.break: return '断租';
      case this.cancel: return '退租';
      default: return '--';
    }
  },
};

// 费用审核状态
const ExpenseVerifyState = {
  pendding: 0,  // 待提交
  waiting: 1,   // 待审核
  reject: -1,   // 不通过
  success: 2,   // 通过
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.pendding: return '待提交';
      case this.waiting: return '待审核';
      case this.reject: return '不通过';
      case this.success: return '通过';
      default: return '未定义';
    }
  },
};

// 审批单审批进度状态
const ExpenseProcessState = {
  waiting: 0,   // 审核中
  reject: -1,   // 不通过
  success: 1,   // 通过
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.waiting: return '待审核';
      case this.reject: return '不通过';
      case this.success: return '通过';
      default: return '未定义';
    }
  },
};

// 费用管理申请单接口参数
const ExpenseRequestCType = {
  create: 1,
  continue: 2,
  salary: 3,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.create: return '初创新增';
      case this.continue: return '续租、批量续租';
      case this.salary: return '批量缓发薪资';
      default: return '未定义';
    }
  },
};

// 将数字转为金额格式
const renderReplaceAmount = (amount) => {
  // 不等于空，undefined和--时转为金额格式
  if (amount !== '--' && amount !== '' && amount !== undefined) {
    return Number(amount).toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
  }
  return amount;
};

module.exports = {
  Unit,
  PhoneRegExp,                // 手机正则表达式

  AccountState,               // 账户状态
  AccountRecruitmentChannel,  // 账户招聘渠道
  Gender,               // 性别
  JobCategory,          // 骑士工作性质
  Roles,                // 角色
  RoleState,            // 角色状态
  ModuleState,          // 模块状态
  Position,             // 员工职位
  SalaryVerifyState,    // 薪资模板设置审核状态
  SalaryFormula,        // 薪资模板中的逻辑公式
  SalaryIndex,          // 薪资模版中的指标数据
  SalaryCondition,      // 薪资模版中满足的条件
  SalaryPaymentCricle,  // 薪资计算周期
  SalaryPaymentState,   // 薪资发放状态
  SalaryRecordState,    // 薪资单审核状态
  SalarySummaryState,   // 薪资汇总审核状态
  SalarySummaryFlag,    // 薪资计算完成状态
  SalaryKnightState,    // 骑士扣款汇总审核状态
  SalaryProduceState,   // 薪资生成状态
  SalaryTaskState,      // 薪资任务状态
  SalaryTaskTime,       // 薪资任务更新时间段
  SalaryCollectType,    // 工资单汇总类型
  FinanceApplyState,    // 财务申请状态
  DutyState,            // 员工是否在职
  RecruitmentChannel,   // 应聘渠道
  ContractBelong,       // 合同归属
  ExpenseType,          // 费用类型
  ExpenseCostCenter,    // 成本中心
  ExpenseCostBelong,    // 成本归属
  ExpenseHouseState,    // 房屋状态
  ExpenseVerifyState,   // 费用审核状态
  ExpenseProcessState,  // 审批单进度审核状态
  ExpenseRequestCType,  // 费用管理申请单接口参数

  KnightTypeWorkProperty, // 骑士工作性质
  KnightTypeState,        // 骑士类型状态定义
  Platform,               // 平台定义

  // 骑士扣补款
  KnightSalaryApproveState,  // 审核状态
  KnightSalaryType,     // 骑士扣补款类型
  Modules,              // 系统的全部模块列表
  // 新版扣款页面完成类型
  KnightDeductComplateState,
  FillingType,  // 数据来源类别
  CutEventType, // 扣款项目类别
  DeductSubmitType, // 扣款提交类别
  FillingEventType, // 补款类型
  PersonalCutEventType,
  renderReplaceAmount, // 将数字转为金额格式
};
