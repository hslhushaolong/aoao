// *** 采购没有大查询权限
// 枚举值-账单类型
export const BILL_TYPE = {
  estimate: '50001',
  accuracy: '50002',
};
/* ——————————————————————————默认选中全部指标项—————————————————— */
// elem 商圈级 预估
export const CHECKED_TARGET_ELEM_DISTRICT_ESTIMATE = ['other_rewards_punishment', 'knight_work_days', 'order_amount', 'finish_order_amount', 'other_order_amount', 'incumbency_knight_numbers', 'work_numbers', 'incumbency_numbers', 'dimission_numbers', 'woker_efficiency',
  'general_income', 'postage_income', 'base_delivery_cost', 'td_delivery_cost', 'sys_subsidy', 'sys_cut', 'kf_cut', 'complaint', 'deregulation', 'kpi_rewards_punishment', 'other_bill', 'xx_cut', 'dz_rewards_punishment'];
// elem 商圈级 准确
export const CHECKED_TARGET_ELEM_DISTRICT_ACCURACY = ['knight_work_days', 'other_rewards_punishment', 'kpi_hungry_order', 'kpi_not_hungry_order', 'kpi_demotion_order', 'order_amount', 'finish_order_amount', 'other_order_amount', 'incumbency_knight_numbers', 'work_numbers', 'incumbency_numbers',
  'dimission_numbers', 'woker_efficiency', 'general_income', 'postage_income', 'base_delivery_cost', 'td_delivery_cost', 'sys_subsidy', 'sys_cut', 'kf_cut', 'complaint', 'deregulation', 'kpi_rewards_punishment', 'other_bill', 'xx_cut', 'dz_rewards_punishment'];
// elem 骑士级 预估
export const CHECKED_TARGET_ELEM_KNIGHT_ESTIMATE = ['work_numbers', 'other_rewards_punishment', 'order_amount', 'finish_order_amount', 'other_order_amount', 'knight_work_days', 'woker_efficiency', 'general_income', 'postage_income',
  'base_delivery_cost', 'td_delivery_cost', 'sys_subsidy', 'sys_cut', 'kf_cut', 'complaint', 'deregulation', 'other_bill', 'xx_cut', 'dz_rewards_punishment'];
// elem 骑士级 准确
export const CHECKED_TARGET_ELEM_KNIGHT_ACCURACY = ['work_numbers', 'other_rewards_punishment', 'order_amount', 'finish_order_amount', 'other_order_amount', 'knight_work_days', 'woker_efficiency', 'general_income', 'postage_income',
  'base_delivery_cost', 'td_delivery_cost', 'sys_subsidy', 'sys_cut', 'kf_cut', 'complaint', 'deregulation', 'other_bill', 'xx_cut', 'dz_rewards_punishment'];

// meituan 商圈级 预估
export const CHECKED_TARGET_MEITUAN_DISTRICT_ESTIMATE = ['order_amount', 'finish_order_amount', 'cancel_order_amount', 'incumbency_knight_numbers', 'work_numbers', 'incumbency_numbers', 'dimission_numbers', 'woker_efficiency',
  'general_income', 'postage_income', 'base_delivery_cost', 'kf_cut', 'complaint', 'deregulation', 'kpi_rewards_punishment', 'other_bill', 'xx_cut'];
// meituan 商圈级 准确
export const CHECKED_TARGET_MEITUAN_DISTRICT_ACCURACY = ['premium', 'dz_rewards_punishment', 'knight_meal_damage', 'biz_district_subsidy', 'order_amount', 'finish_order_amount', 'cancel_order_amount', 'incumbency_knight_numbers',
  'work_numbers', 'incumbency_numbers', 'dimission_numbers', 'woker_efficiency', 'general_income', 'postage_income', 'base_delivery_cost', 'kf_cut', 'complaint', 'deregulation', 'kpi_rewards_punishment', 'other_bill', 'xx_cut'];
// meituan 骑士级 预估
export const CHECKED_TARGET_MEITUAN_KNIGHT_ESTIMATE = ['valid_work_days', 'work_days', 'order_amount', 'finish_order_amount', 'cancel_order_amount', 'woker_efficiency', 'kf_cut', 'complaint', 'deregulation'];
// meituan 骑士级 准确
export const CHECKED_TARGET_MEITUAN_KNIGHT_ACCURACY = ['valid_work_days', 'work_days', 'knight_meal_damage', 'order_amount', 'finish_order_amount', 'cancel_order_amount', 'woker_efficiency', 'kf_cut', 'complaint', 'deregulation'];

// baidu 商圈级 预估
export const CHECKED_TARGET_BAIDU_DISTRICT_ESTIMATE = ['kpi_x1', 'kpi_x2', 'kpi_x3', 'kpi_qc', 'kpi_ugc', 'kpi_illegal_operation', 'valid_work_days', 'order_amount', 'finish_order_amount', 'cancel_order_amount',
  'incumbency_knight_numbers', 'work_numbers', 'incumbency_numbers', 'dimission_numbers', 'woker_efficiency', 'general_income', 'postage_income', 'base_delivery_cost', 'sys_subsidy', 'kpi_rewards_punishment', 'other_bill', 'xx_cut'];
// baidu 商圈级 准确
// baidu 骑士级 预估/准确
export const CHECKED_TARGET_BAIDU_KNIGHT = ['valid_work_days', 'work_days', 'order_amount', 'finish_order_amount', 'cancel_order_amount', 'woker_efficiency', 'other_bill', 'xx_cut'];

// 饿了么 商圈级指标选项-预估
export const ELEM_DISTRICT_TARGET_ESTIMATE = [
  {
    title: '单量情况',
    items: [
      { label: '总单量', value: 'order_amount' },
      { label: '平台单量', value: 'finish_order_amount' },
      { label: '异常/欺诈单', value: 'other_order_amount' },
    ],
  },
  {
    title: '运力情况',
    items: [
      { label: '在职骑士数', value: 'incumbency_knight_numbers' },
      { label: '出单天数', value: 'knight_work_days' },
      { label: '出单人数', value: 'work_numbers' },
      { label: '入职人数', value: 'incumbency_numbers' },
      { label: '离职人数', value: 'dimission_numbers' },
      { label: '人效', value: 'woker_efficiency' },
    ],
  },
  // 数据结构
  {
    title: '收入情况',
    items: [
      [{
        title: '结算金额', item: [{ label: '结算金额', value: 'general_income' }],
      }],
      [{
        title: '邮资收入',
        item: [
          { label: '邮资收入', value: 'postage_income' },
          { label: '基础配送费', value: 'base_delivery_cost' },
          { label: '提点配送费', value: 'td_delivery_cost' },
          { label: '系统补贴', value: 'sys_subsidy' },
          { label: '系统扣罚', value: 'sys_cut' },
        ],
      }],
      [{
        title: '扣罚',
        item: [
          { label: '扣罚', value: 'kf_cut' },
          { label: '投诉', value: 'complaint' },
          { label: '违规', value: 'deregulation' },
        ],
      }], [{
        title: 'KPI奖惩',
        item: [
          { label: 'KPI奖惩', value: 'kpi_rewards_punishment' },
        ],
      }],
      [{
        title: '其他奖惩',
        item: [
          { label: '其它奖惩', value: ' other_rewards_punishment' },
          { label: '线下罚单扣款', value: 'xx_cut' },
          { label: '调账', value: 'dz_rewards_punishment' },
          { label: '其它', value: 'other_bill' },
        ],
      }],
    ],
  },
];
// 饿了么 商圈级指标选项-准确
export const ELEM_DISTRICT_TARGET = [
  {
    title: '单量情况',
    items: [
      { label: '总单量', value: 'order_amount' },
      { label: '平台单量', value: 'finish_order_amount' },
      { label: '异常/欺诈单', value: 'other_order_amount' },
    ],
  },
  {
    title: '运力情况',
    items: [
      { label: '在职骑士数', value: 'incumbency_knight_numbers' },
      { label: '出单天数', value: 'knight_work_days' },
      { label: '出单人数', value: 'work_numbers' },
      { label: '入职人数', value: 'incumbency_numbers' },
      { label: '离职人数', value: 'dimission_numbers' },
      { label: '人效', value: 'woker_efficiency' },
    ],
  },
  // 数据结构
  {
    title: '收入情况',
    items: [
      [{
        title: '结算金额', item: [{ label: '结算金额', value: 'general_income' }],
      }],
      [{
        title: '邮资收入',
        item: [
          { label: '邮资收入', value: 'postage_income' },
          { label: '基础配送费', value: 'base_delivery_cost' },
          { label: '提点配送费', value: 'td_delivery_cost' },
          { label: '系统补贴', value: 'sys_subsidy' },
          { label: '系统扣罚', value: 'sys_cut' },
        ],
      }],
      [{
        title: 'KPI奖惩',
        item: [
          { label: 'KPI奖惩', value: 'kpi_rewards_punishment' },
          { label: 'KPI饿单', value: 'kpi_hungry_order' },
          { label: 'KPI非饿单', value: 'kpi_not_hungry_order' },
          { label: 'KPI降级单', value: 'kpi_demotion_order' },
        ],
      }],
      [{
        title: '扣罚',
        item: [
          { label: '扣罚', value: 'kf_cut' },
          { label: '投诉', value: 'complaint' },
          { label: '违规', value: 'deregulation' },
        ],
      }],
      [{
        title: '其他奖惩',
        item: [
          { label: '其它奖惩', value: ' other_rewards_punishment' },
          { label: '线下罚单扣款', value: 'xx_cut' },
          // { label: '投保扣款', value: 'insure_cut' },
          // { label: '反欺诈', value: 'anti_fraud' },
          { label: '调账', value: 'dz_rewards_punishment' },
          { label: '其它', value: 'other_bill' },
        ],
      }],
    ],
  },
];

// 美团 商圈级指标选项-预估
export const MEITUAN_DISTRICT_TARGET_ESTIMATE = [
  {
    title: '单量情况',
    items: [
      { label: '总单量', value: 'order_amount' },
      { label: '平台单量', value: 'finish_order_amount' },
      { label: '取消单', value: 'cancel_order_amount' },
    ],
  },
  {
    title: '运力情况',
    items: [
      { label: '在职骑士数', value: 'incumbency_knight_numbers' },
      { label: '出单人数', value: 'work_numbers' },
      { label: '入职人数', value: 'incumbency_numbers' },
      { label: '离职人数', value: 'dimission_numbers' },
      { label: '人效', value: 'woker_efficiency' },
    ],
  },
  // 数据结构
  {
    title: '收入情况',
    items: [
      [{
        title: '总收入', item: [{ label: '总收入', value: 'general_income' }],
      }],
      [{
        title: '邮资收入',
        item: [
          { label: '邮资收入', value: 'postage_income' },
          { label: '基础配送费', value: 'base_delivery_cost' },
        ],
      }],
      [{
        title: 'KPI奖惩',
        item: [
          { label: 'KPI奖惩', value: 'kpi_rewards_punishment' },
        ],
      }],
      [{
        title: '扣罚',
        item: [
          { label: '扣罚', value: 'kf_cut' },
          { label: '投诉', value: 'complaint' },
          { label: '违规', value: 'deregulation' },
        ],
      }],
      [{
        title: '其他账单',
        item: [
          { label: '其他账单', value: 'other_bill' },
          { label: '线下罚单扣款', value: 'xx_cut' },
        ],
      }],
    ],
  },
];
// 美团 商圈级指标选项-准确
export const MEITUAN_DISTRICT_TARGET = [
  {
    title: '单量情况',
    items: [
      { label: '总单量', value: 'order_amount' },
      { label: '平台单量', value: 'finish_order_amount' },
      { label: '取消单', value: 'cancel_order_amount' },
    ],
  },
  {
    title: '运力情况',
    items: [
      { label: '在职骑士数', value: 'incumbency_knight_numbers' },
      { label: '出单人数', value: 'work_numbers' },
      { label: '入职人数', value: 'incumbency_numbers' },
      { label: '离职人数', value: 'dimission_numbers' },
      { label: '人效', value: 'woker_efficiency' },
    ],
  },
  // 数据结构
  {
    title: '收入情况',
    items: [
      [{
        title: '总收入', item: [{ label: '总收入', value: 'general_income' }],
      }],
      [{
        title: '邮资收入',
        item: [
          { label: '邮资收入', value: 'postage_income' },
          { label: '基础配送费', value: 'base_delivery_cost' },
          { label: '商圈补贴', value: 'biz_district_subsidy' },
        ],
      }],
      [{
        title: 'KPI奖惩',
        item: [
          { label: 'KPI奖惩', value: 'kpi_rewards_punishment' },
        ],
      }],
      [{
        title: '扣罚',
        item: [
          { label: '扣罚', value: 'kf_cut' },
          { label: '投诉', value: 'complaint' },
          { label: '违规', value: 'deregulation' },
          { label: '餐损', value: 'knight_meal_damage' },
        ],
      }],
      [{
        title: '其他账单',
        item: [
          { label: '其他账单', value: 'other_bill' },
          { label: '线下罚单扣款', value: 'xx_cut' },
          { label: '调账', value: 'dz_rewards_punishment' },
          { label: '保险费', value: 'premium' },
        ],
      }],
    ],
  },
];

// 百度 商圈级指标选项-预估
export const BAIDU_DISTRICT_TARGET_ESTIMATE = [
  {
    title: '单量情况',
    items: [
      { label: '总单量', value: 'order_amount' },
      { label: '平台单量', value: 'finish_order_amount' },
      { label: '取消单', value: 'cancel_order_amount' },
    ],
  },
  {
    title: '运力情况',
    items: [
      { label: '在职骑士数', value: 'incumbency_knight_numbers' },
      { label: '出单人数', value: 'work_numbers' },
      { label: '有效出勤天数', value: 'valid_work_days' },
      { label: '入职人数', value: 'incumbency_numbers' },
      { label: '离职人数', value: 'dimission_numbers' },
      { label: '人效', value: 'woker_efficiency' },
    ],
  },
  // 数据结构
  {
    title: '收入情况',
    items: [
      [{
        title: '总收入', item: [{ label: '总收入', value: 'general_income' }],
      }],
      [{
        title: '邮资收入',
        item: [
          { label: '邮资收入', value: 'postage_income' },
          { label: '基础配送费', value: 'base_delivery_cost' },
          { label: '系统补贴', value: 'sys_subsidy' },
        ],
      }],
      [{
        title: 'KPI奖惩',
        item: [
          { label: 'KPI奖惩', value: 'kpi_rewards_punishment' },
          { label: 'KPI-x1', value: 'kpi_x1' },
          { label: 'KPI-x2', value: 'kpi_x2' },
          { label: 'KPI-x3', value: 'kpi_x3' },
          { label: 'KPI-QC', value: 'kpi_qc' },
          { label: 'KPI-UGC', value: 'kpi_ugc' },
          { label: 'KPI-操作违规', value: 'kpi_illegal_operation' },
        ],
      }],
      [{
        title: '其他账单',
        item: [
          { label: '其他账单', value: 'other_bill' },
          { label: '线下罚单扣款', value: 'xx_cut' },
          { label: '异常单物流费', value: 'abnormal_logistics' },
        ],
      }],
    ],
  },
];
// 百度 商圈级指标选项-准确
export const BAIDU_DISTRICT_TARGET = [
  {
    title: '单量情况',
    items: [
      { label: '总单量', value: 'order_amount' },
      { label: '平台单量', value: 'finish_order_amount' },
      { label: '取消单', value: 'cancel_order_amount' },
    ],
  },
  {
    title: '运力情况',
    items: [
      { label: '在职骑士数', value: 'incumbency_knight_numbers' },
      { label: '出单人数', value: 'work_numbers' },
      { label: '有效出勤天数', value: 'valid_work_days' },
      { label: '入职人数', value: 'incumbency_numbers' },
      { label: '离职人数', value: 'dimission_numbers' },
      { label: '人效', value: 'woker_efficiency' },
    ],
  },
  // 数据结构
  {
    title: '收入情况',
    items: [
      [{
        title: '总收入', item: [{ label: '总收入', value: 'general_income' }],
      }],
      [{
        title: '邮资收入',
        item: [
          { label: '邮资收入', value: 'postage_income' },
          { label: '基础配送费', value: 'base_delivery_cost' },
          { label: '系统补贴', value: 'sys_subsidy' },
        ],
      }],
      [{
        title: 'KPI奖惩',
        item: [
          { label: 'KPI奖惩', value: 'kpi_rewards_punishment' },
          { label: 'KPI-x1', value: 'kpi_x1' },
          { label: 'KPI-x2', value: 'kpi-x2' },
          { label: 'KPI-x3', value: 'kpi_x3' },
          { label: 'KPI-QC', value: 'kpi_qc' },
          { label: 'KPI-UGC', value: ' kpi_ugc' },
          { label: 'KPI-操作违规', value: 'kpi_illegal_operation' },
        ],
      }],
      [{
        title: '其他账单',
        item: [
          { label: '其他账单', value: 'other_bill' },
          { label: '线下罚单扣款', value: 'xx_cut' },
          { label: '装备款', value: 'material' },
          { label: '调账', value: 'dz_rewards_punishment' },
          { label: '其它补扣款', value: 'other_rewards_punishment' },
        ],
      }],
    ],
  },
];

// 饿了么 骑士级指标选项-预估
export const ELEM_KNIGHT_TARGET_ESTIMATE = [
  {
    title: '单量情况',
    items: [
      { label: '总单量', value: 'order_amount' },
      { label: '平台单量', value: 'finish_order_amount' },
      { label: '异常/欺诈单', value: 'other_order_amount' },
    ],
  },
  {
    title: '运力情况',
    items: [
      { label: '出单人数', value: 'work_numbers' },
      { label: '出单天数', value: 'knight_work_days' },
      { label: '人效', value: 'woker_efficiency' },
    ],
  },
  {
    title: '收入情况',
    items: [
      [{
        title: '结算金额', item: [{ label: '结算金额', value: 'general_income' }],
      }],
      [{
        title: '邮资收入',
        item: [
          { label: '邮资收入', value: 'postage_income' },
          { label: '基础配送费', value: 'base_delivery_cost' },
          { label: '提点配送费', value: 'td_delivery_cost' },
          { label: '系统补贴', value: 'sys_subsidy' },
          { label: '系统扣罚', value: 'sys_cut' },
        ],
      }],
      [{
        title: '扣罚',
        item: [
          { label: '扣罚', value: 'kf_cut' },
          { label: '投诉', value: 'complaint' },
          { label: '违规', value: 'deregulation' },
        ],
      }],
      [{
        title: '其他账单',
        item: [
          { label: '其它奖惩', value: ' other_rewards_punishment' },
          { label: '线下罚单扣款', value: 'xx_cut' },
          // { label: '反欺诈', value: 'anti_fraud' },
          { label: '调账', value: 'dz_rewards_punishment' },
          { label: '其他', value: 'other_bill' },
        ],
      }],
    ],
  },
];
// 饿了么 骑士级指标选项-准确
export const ELEM_KNIGHT_TARGET = [
  {
    title: '单量情况',
    items: [
      { label: '总单量', value: 'order_amount' },
      { label: '平台单量', value: 'finish_order_amount' },
      { label: '异常/欺诈单', value: 'other_order_amount' },
    ],
  },
  {
    title: '运力情况',
    items: [
      { label: '出单人数', value: 'work_numbers' },
      { label: '出单天数', value: 'knight_work_days' },
      { label: '人效', value: 'woker_efficiency' },
    ],
  },
  {
    title: '收入情况',
    items: [
      [{
        title: '结算金额', item: [{ label: '结算金额', value: 'general_income' }],
      }],
      [{
        title: '邮资收入',
        item: [
          { label: '邮资收入', value: 'postage_income' },
          { label: '基础配送费', value: 'base_delivery_cost' },
          { label: '提点配送费', value: 'td_delivery_cost' },
          { label: '系统补贴', value: 'sys_subsidy' },
          { label: '系统扣罚', value: 'sys_cut' },
        ],
      }],
      [{
        title: '扣罚',
        item: [
          { label: '扣罚', value: 'kf_cut' },
          { label: '投诉', value: 'complaint' },
          { label: '违规', value: 'deregulation' },
        ],
      }],
      [{
        title: '其他奖惩',
        item: [
          { label: '其它奖惩', value: ' other_rewards_punishment' },
          { label: '线下罚单扣款', value: 'xx_cut' },
          // { label: '投保扣款', value: 'insure_cut' },
          // { label: '反欺诈', value: 'anti_fraud' },
          { label: '调账', value: 'dz_rewards_punishment' },
          { label: '其他', value: 'other_bill' },
        ],
      }],
    ],
  },
];

// 美团 骑士级指标选项-预估
export const MEITUAN_KNIGHT_TARGET_ESTIMATE = [
  {
    title: '单量情况',
    items: [
      { label: '总单量', value: 'order_amount' },
      { label: '完成单量', value: 'finish_order_amount' },
      { label: '取消单', value: 'cancel_order_amount' },
    ],
  },
  {
    title: '运力情况',
    items: [
      { label: '出单天数', value: 'knight_work_days' },
      { label: '有效出勤天数', value: 'valid_work_days' },
      { label: '人效', value: 'woker_efficiency' },
    ],
  },
  {
    title: '收入情况',
    items: [
      [{
        title: '扣罚',
        item: [
          { label: '扣罚', value: 'kf_cut' },
          { label: '投诉', value: 'complaint' },
          { label: '违规', value: 'deregulation' },
        ],
      }],
    ],
  },
];
// 美团 骑士级指标选项-准确
export const MEITUAN_KNIGHT_TARGET = [
  {
    title: '单量情况',
    items: [
      { label: '总单量', value: 'order_amount' },
      { label: '完成单量', value: 'finish_order_amount' },
      { label: '取消单', value: 'cancel_order_amount' },
    ],
  },
  {
    title: '运力情况',
    items: [
      { label: '出单天数', value: 'knight_work_days' },
      { label: '有效出勤天数', value: 'valid_work_days' },
      { label: '人效', value: 'woker_efficiency' },
    ],
  },
  {
    title: '收入情况',
    items: [
      [{
        title: '扣罚',
        item: [
          { label: '扣罚', value: 'kf_cut' },
          { label: '投诉', value: 'complaint' },
          { label: '违规', value: 'deregulation' },
          { label: '餐损', value: 'knight_meal_damage' },
        ],
      }],
    ],
  },
];

// 百度 骑士级指标选项-准确/预估
export const BAIDU_KNIGHT_TARGET = [
  {
    title: '单量情况',
    items: [
      { label: '总单量', value: 'order_amount' },
      { label: '完成单量', value: 'finish_order_amount' },
      { label: '取消单', value: 'cancel_order_amount' },
    ],
  },
  {
    title: '运力情况',
    items: [
      { label: '出单天数', value: 'knight_work_days' },
      { label: '有效出勤天数', value: 'valid_work_days' },
      { label: '人效', value: 'woker_efficiency' },
    ],
  },
  {
    title: '其他账单',
    item: [
      { label: '其他账单', value: 'other_bill' },
      { label: '线下罚单扣款', value: 'xx_cut' },
    ],
  },
];
