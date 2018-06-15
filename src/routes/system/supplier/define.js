export const supplierState = {
  normal: 60,      // 正常
  stop: -60,       // 禁用
  disabled: -61,   // 停用
  description: (state) => {
    switch (state) {
      case 60:
        return '启用';
      case -60:
        return '禁用';
      case -61:
        return '停用';
      default:
        return '未定义';
    }
  },
};

// 商圈状态
export const bizDistrictState = {
  on: 1,      // 启用
  off: 0,       // 禁用
  description(state) {
    switch (Number(state)) {
      case this.on: // 启用
        return '启用';
      case this.off:
        return '禁用'; // 禁用
      default:
        return '未定义';
    }
  },
};
