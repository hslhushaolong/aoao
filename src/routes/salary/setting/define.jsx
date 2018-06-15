// 薪资指标-废弃
const SalarySpecifications = {
  baidu: [
    {
      name: '员工',
      items: [
        { value: 'knight_state', title: '骑士状态' },
        { value: 'incumbency_days', title: '在职天数' },
        { value: 'entry_month', title: '入职月份' },
      ],
    },
    {
      name: '质量',
      items: [
        { value: 'ugc_sworst_ten_percent_delivery_timecore', title: '最差10%配送时长' },
        { value: 'month_promptness_rate', title: '准时率' },
        { value: 'operation_get_out_of_line_rate', title: '操作违规率' },
        { value: 'ugc_score', title: 'UGC评分' },
      ],
    },
    {
      name: '商圈业务量',
      items: [
        { value: 'biz_district_efficiency', title: '商圈人效' },
        { value: 'biz_district_efficiency_no_breakfast', title: '商圈人效 (剔除早餐)' },
      ],
    },
    {
      name: '骑士业务量',
      items: [
        { value: 'month_order_count_no_breakfast', title: '完成单量（剔除早餐）' },
        { value: 'month_order_count', title: '完成单量' },
        { value: 'month_time_limit_complete_order_count_no_breakfast', title: '限时达单量 (剔除早餐)' },
        { value: 'month_time_limit_complete_order_count', title: '限时达单量' },
        { value: 'month_avg_delivery_time', title: '平均配送时长（分钟）' },
        { value: 'valid_necessary_duty_time', title: '有效岗时长 (小时)' },
        { value: 'month_issue_days', title: '出单天数' },
        { value: 'month_valid_attendance_days', title: '有效出勤天数' },
        { value: 'valid_valid_attendance_days', title: '有效出勤天数（特殊夜班用)（天）' },
        { value: 'month_valid_attendance_days_no_breakfast', title: '有效出勤天数(剔除早餐)' },
        { value: 'knight_valid_efficiency_no_breakfast', title: '骑士有效人效 (剔除早餐)' },
        { value: 'knight_valid_efficiency', title: '骑士有效人效' },
        { value: 'knight_efficiency', title: '骑士人效' },
        { value: 'necessary_duty_time', title: '应在岗时长 (小时)' },
      ],
    },
  ],
  meituan: [
    {
      name: '员工',
      items: [
        { value: 'knight_state', title: '骑士状态' },
        { value: 'platform_induction_date', title: '平台入职时间' },
        { value: 'incumbency_days', title: '在职天数' },
        { value: 'entry_month', title: '入职月份' },
      ],
    },
    {
      name: '质量',
      items: [
        { value: 'month_five_stars_order_count', title: '五星单量' },
      ],
    },
    {
      name: '骑士业务量',
      items: [
        { value: 'month_order_count', title: '完成单量' },
        { value: 'month_issue_days', title: '出单天数' },
        { value: 'month_attendance_days', title: '有效出勤天数' },
        { value: 'month_sick_leave_days', title: '病假天数' },
        { value: 'month_funeral_leave_days', title: '丧假天数' },
        { value: 'month_distance_subsidy', title: '距离补贴' },
        { value: 'month_midnight_snack_order_count', title: '夜宵单量' },
        { value: 'month_distributed_reason_cancel_order_count', title: '配送原因取消单量' },
        { value: 'month_large_order_subsidy', title: '大额单补贴' },
        { value: 'month_external_order_count', title: '外单单量' },
      ],
    },
  ],
  elem: [
    {
      name: '员工',
      items: [
        { value: 'knight_state', title: '骑士状态' },
        { value: 'the_same_month_state', title: '当月骑士状态' },
        { value: 'incumbency_days', title: '在职天数' },
        { value: 'entry_month', title: '入职月份' },
        { value: 'the_same_month_days', title: '当月天数' },
        { value: 'first_entry_date', title: '首次入职时间' },
      ],
    },
    {
      name: '商圈业务量',
      items: [
        { value: 'biz_average_daily_order', title: '商圈日均完成单量' },
        { value: 'biz_district_efficiency', title: '商圈人效' },
      ],
    },
    {
      name: '骑士业务量',
      items: [
        { value: 'month_order_take_count', title: '接单量' },
        { value: 'month_order_count', title: '完成单量' },
        { value: 'month_time_limit_complete_order_count', title: '准时单量' },
        { value: 'month_timeout_order_count', title: '超时单量' },
        { value: 'month_praise_order_count', title: '好评单量' },
        { value: 'month_bad_order_count', title: '差评单量' },
        { value: 'average_daily_order', title: '日均完成单量' },
        { value: 'month_efficiency', title: '人效' },
        { value: 'month_issue_days', title: '出单天数' },
        { value: 'month_valid_attendance_days', title: '有效出勤天数' },
      ],
    },
    {
      name: '质量',
      items: [
        { value: 'month_knight_biz_district_order_count_rank', title: '骑士商圈内单量排名' },
        { value: 'month_knight_biz_district_order_count_rate', title: '骑士商圈内单量排名比率' },
        { value: 'month_distributed_anomaly_deductions', title: '配送异常扣款' },
        { value: 'month_dispatch_timeout_deductions', title: '调度超时扣款' },
        { value: 'month_prescription_deductions', title: '时效扣款' },
        { value: 'month_complain', title: '投诉总金额' },
        { value: 'month_complain_bad_service_attitude', title: '投诉_服务态度恶劣金额' },
        { value: 'month_complain_click_service_ahead_of_time', title: '投诉_提前点击送达金额' },
        { value: 'month_complain_other', title: '投诉_其他投诉' },
        { value: 'month_claim_bad_service_attitude', title: '索赔_服务态度恶劣' },
        { value: 'month_claim_click_service_ahead_of_time', title: '索赔_提前点击送达' },
        { value: 'month_claim_other', title: '索赔_其他原因' },
        { value: 'complaint_service_bad_amount', title: '投诉申诉_服务态度恶劣金额' },
        { value: 'complaint_advance_click_amount', title: '投诉申诉_提前点击送达金额' },
        { value: 'complaint_other_amount', title: '投诉申诉_其他原因' },
        { value: 'claim_indemnity_service_bad_amount', title: '索赔申诉_服务态度恶劣金额' },
        { value: 'claim_indemnity_advance_click_amount', title: '索赔申诉_提前点击送达金额' },
        { value: 'claim_indemnity_other_amount', title: '索赔申诉_其他原因' },
        { value: '"praise_order_rate"', title: '好评率' },
        { value: 'month_bad_rate_down', title: '差评率' },
        { value: 'month_timeout_rate_up', title: '超时率' },
        { value: 'month_get_out_of_line', title: '违规扣款金额' },
        { value: 'no_bee_card_deduct', title: '非蜂卡扣款' },
        { value: 'claim_amount', title: '索赔总金额' },
        { value: 'complain_amount', title: '投诉申诉总金额' },
        { value: 'claim_indemnity_amount', title: '索赔申诉总金额' },
      ],
    },
  ],

  // 根据类型获取数据
  getSpecifications(type) {
    switch (type) {
      case 'baidu': return this.baidu;
      case 'meituan': return this.meituan;
      case 'elem': return this.elem;
      default: return [];
    }
  },

  // 中文描述内容
  description(type, key) {
    const specifications = this.getSpecifications(type);
    let description = '';
    Object.values(specifications).forEach((items) => {
      items.items.forEach((item, index) => {
        if (item.value === key) {
          description = item.title;
        }
      });
    });
    return description;
  },
};

module.exports = {
  SalarySpecifications, // 薪资指标
};
