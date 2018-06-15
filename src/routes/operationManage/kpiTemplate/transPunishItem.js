// 传给后台的扣罚项有哪些需要渲染标识
const PunishNumber = {
  qc: '1',                 // QC
  whole_qc: '2',              // 整体QC
  single_qc: '3',              // 单项QC
  ugc_score: '4',                // UGC评分
  operation_violation: '5',          // 操作违规
  user_differential_rate: '6',          // 用户差评率
  red_letter_capacity_plan: '7',                // 红字运力计划
  attendance_award: '8',                // 出勤人数奖励
};
// 扣罚项的枚举值
const rePunishNumber = {
  1: 'qc',                 // QC
  2: 'whole_qc',              // 整体QC
  3: 'single_qc',              // 单项QC
  4: 'ugc_score',                // UGC评分
  5: 'operation_violation',          // 操作违规
  6: 'user_differential_rate',          // 用户差评率
  7: 'red_letter_capacity_plan',                // 红字运力计划
  8: 'attendance_award',                // 出勤人数奖励
};
// 将N-X3设置枚举值数组转换为值数组
export function transPunishNumber(obj) {
  const arr = [];
  for (let i = 0; i < obj.length; i++) {
    arr.push(PunishNumber[obj[i]]);
  }
  return arr;
}
// 将扣发项枚举值数组转换为值数组
export function transRePunishNumber(obj) {
  const arr = [];
  for (let i = 0; i < obj.length; i++) {
    // 将扣发项枚举值数组转换为值数组
    arr.push(rePunishNumber[obj[i]]);
  }

  return arr;
}
