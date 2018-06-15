// 枚举值
// 处理方式及错误信息
export const ExceptionHandleMethod = {
  40010: '骑士实际已入职，立即补充入职流程',
  40020: '骑士实际已离职，稍后关闭所属平台账号',
  40030: '骑士实际已离职，平台账号标记运力工号',
  40040: '骑士实际已离职，关闭系统账号',
  40050: '骑士实际离职，BOSS系统状态转为离职，稍后关闭所属平台账号',
  40060: '骑士实际离职，BOSS系统状态转为离职，账号划分为运力工号',
  40070: '骑士请假中，BOSS系统状态不变，账号暂时划分为运力工号',
  40080: '骑士请假中，BOSS系统状态和账号无操作',
  40090: '其他原因暂时无法处理',
  description(rawValue) {
    if (Object.prototype.hasOwnProperty.call(this, rawValue)) {
      return this[rawValue];
    }
    return '未定义';
  },

  // 渲染不同的处理方式，张莹
  getHandleMethods(exceptionMessage, platformState, bossState) {
    if (exceptionMessage == null || platformState == null || bossState == null) {
      return [];
    }

    // 1:平台职工状态在职 -50:Boss系统职工状态离职
    if (platformState === 1 && bossState === -50) {
      return [
        { value: '40010', name: '骑士实际已入职，立即补充入职流程' },
        { value: '40020', name: '骑士实际已离职，稍后关闭所属平台账号' },
        { value: '40030', name: '骑士实际已离职，平台账号标记运力工号' },
        { value: '40090', name: '其他原因暂时无法处理' },
      ];
    }

    // 2:平台职工状态离职 50:Boss系统职工状态在职
    if (platformState === 2 && bossState === 50) {
      return [
        { value: '40040', name: '骑士实际已离职，关闭系统账号' },
        { value: '40090', name: '其他原因暂时无法处理' },
      ];
    }

    // 408002:不活跃账号
    if (exceptionMessage === 408002) {
      return [
        { value: '40050', name: '骑士实际离职，BOSS系统状态转为离职，稍后关闭所属平台账号' },
        { value: '40060', name: '骑士实际离职，BOSS系统状态转为离职，账号划分为运力工号' },
        { value: '40070', name: '骑士请假中，BOSS系统状态不变，账号暂时划分为运力工号' },
        { value: '40080', name: '骑士请假中，BOSS系统状态和账号无操作' },
        { value: '40090', name: '其他原因暂时无法处理' },
      ];
    }

    // 1:平台职工状态在职 100:Boss系统职工状态不存在
    if (platformState === 1 && bossState === 100) {
      return [
        { value: '40010', name: '骑士实际已入职，立即补充入职流程' },
        { value: '40090', name: '其他原因暂时无法处理' },
      ];
    }

    // 默认的处理
    return [];
  },

  // 是否显示自定义的信息 (其他原因暂时无法处理时，显示自定义信息字段)
  isDisplayCustomMessage(rawValue) {
    return `${rawValue}` === `${40090}`;
  },
};

// 异常信息
export const ExceptionMessage = {
  408001: '所属平台骑士状态不符',
  408002: '不活跃账号',
  408003: '不存在账号',
  description(rawValue) {
    if (Object.prototype.hasOwnProperty.call(this, rawValue)) {
      return this[rawValue];
    }
    return '未定义';
  },
};

// 平台职工状态
export const ExceptionPlatformState = {
  1: '在职',
  2: '离职',
  description(rawValue) {
    if (Object.prototype.hasOwnProperty.call(this, rawValue)) {
      return this[rawValue];
    }
    return '未定义';
  },
};

// Boss系统职工状态
export const ExceptionBossState = {
  50: '在职',
  '-50': '离职',
  100: '不存在',
  description(rawValue) {
    if (Object.prototype.hasOwnProperty.call(this, rawValue)) {
      return this[rawValue];
    }
    return '未定义';
  },
};

// 处理状态
export const ExceptionHandleState = {
  1: '未处理',
  2: '已标记待处理',
  3: '已标记未处理',
  4: '已处理',
  description(rawValue) {
    if (Object.prototype.hasOwnProperty.call(this, rawValue)) {
      return this[rawValue];
    }
    return '未定义';
  },
};
