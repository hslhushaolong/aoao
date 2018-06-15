// 定义枚举值
export const numberType = {
  capacityNumber: 50010,       // 运力工号
  runNumber: 50020,            // 替跑工号
  normalNumber: 50030,         // 正常工号
  capaciting: 50100,           // 正在运力
  waitCapacity: 50200,         // 等待运力
  noState: 50300,              // --
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.capacityNumber: return '运力工号';
      case this.runNumber: return '替跑工号';
      case this.normalNumber: return '正常工号';
      case this.capaciting: return '正在运力';
      case this.waitCapacity: return '等待运力';
      case this.noState: return '--';
      default: return '未定义';
    }
  },
};
