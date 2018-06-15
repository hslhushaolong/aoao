// 自定义工具函数和枚举址
// 判断值是否是Null或undefined
export function exists(value) {
  if (value == null) {
    return false;
  } else {
    return true;
  }
}

// 判断表单有没有值
export function formExists(value) {
  if (value == null || value == '') {
    return false;
  } else {
    if (typeof value === 'object' && value.length === 0) {
      return false;
    }
    return true;
  }
}

// 骑士状态
const transValue = {
  50010: '运力工号',
  50020: '替跑工号',
  50030: '正常工号',
  50100: '正在运力',
  50200: '等待运力',
  50300: '--',
};

// 枚举值转换
export function transformNum(value) {
  return transValue[value.toString()];
}
