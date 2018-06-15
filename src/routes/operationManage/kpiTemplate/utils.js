// 将页面数据转换为后端要求格式方法，郑集文要求的数据格式
// 详情请看说明.md
// nx3-设置部分转换后台写死字段部分
/**
 *
 * @param  {[num]} symbol           [logic_symbol枚举]
 * @param  {[string]} specific         [specifications扣罚项名称字符串]
 * @param  {[string]} one              [第一个值]
 * @param  {[string]} [last=undefined] [第二个值]
 * @return {[obj]}                  [返回后台格式对象]
 */
function renderConditions(symbol, specific, one, last = undefined) {
  const obj = {};
  obj.logic_symbol = symbol;      // 后端要求的格式详情查看说明.md # 条件描述类型
  obj.specifications = specific;  // 后端要求的格式详情查看说明.md # 指标!
  obj.first = parseFloat(one);    // 后端要求的格式详情查看说明.md # 第一个值
  if (last !== undefined) {
    obj.end = last;
  }
  return obj;
}
// 将扣罚项转换成后端写死部分字段
/**
 * @param  {[num]} type [condition_type条件关系]
 * @param  {[string]} mula [每单的值]
 * @param  {[obj]} con  [输入后台需要格式对象]
 * @return {[obj]}      [返回后台格式对象]
 */
function renderFormula(type, mula, con) {
  const result = {};
  result.condition_type = type; // 后端要求的格式详情查看说明.md # 条件关系!
  result.formula = mula;        // 后端要求的格式详情查看说明.md '每单value'
  result.conditions = con;      // 后端要求的格式详情查看说明.md 条件对象
  return result;
}
// 将运力达成x1转换为传给后台的数据
export function transformX1(arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    // 将运力达成x1转换为传给后台的数据 后端要求的格式详情查看说明.md
    obj[i] = renderFormula(2, arr[i].per, [renderConditions(7, 'single_capacity_plan', parseFloat(arr[i].day))]);
  }
  return obj;
}

// 将运力达成x1转换为页面应用的数据
export function transformX1Cont(obj) {
  const arr = [];
  for (const term in obj) {
    arr.push(obj[term]);
  }
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr[i] = {};
    newArr[i].day = arr[i].conditions[0].first.toString();
    newArr[i].per = arr[i].formula;
  }
  return newArr;
}

// 将实效达成x2转换为传给后台的数据
export function transformX2(arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    // 将实效达成x2转换为传给后台的数据 后端要求的格式详情查看说明.md
    obj[i] = renderFormula(2, arr[i].per, [
      // 后端要求的格式详情查看说明.md                       时间
      renderConditions(7, 'punctual_rate_of_order', arr[i].ontime),
      // 后端要求的格式详情查看说明.md                     平均值
      renderConditions(6, 'average_delivery_time', arr[i].average),
      // 后端要求的格式详情查看说明.md                                                  天
      renderConditions(7, 'number_of_days_required_for_reaching_prescription', arr[i].day),
    ]);
  }
  return obj;
}

// 将实效达成x2转换为页面应用的数据
export function transformX2Cont(obj) {
  const arr = [];
  for (const term in obj) {
    arr.push(obj[term]);
  }
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr[i] = {};
    // 后端要求的格式详情查看说明.md
    newArr[i].ontime = arr[i].conditions[0].first;
    // 后端要求的格式详情查看说明.md
    newArr[i].average = arr[i].conditions[1].first;
    // 后端要求的格式详情查看说明.md
    newArr[i].day = arr[i].conditions[2].first;
    // 后端要求的格式详情查看说明.md
    newArr[i].per = arr[i].formula;
  }
  return newArr;
}
// 将10%最差转换率x3转换为传给后台的数据
export function transformX3(obje) {
  const obj = {};
  // 将10%最差转换率x3转换为传给后台的数据 后端要求的格式详情查看说明.md                                             小时         天
  obj[0] = renderFormula(2, obje.per, [renderConditions(6, 'worst_ten_percent_x3_average_delivery_time', obje.hour, obje.day)]);
  return obj;
}
// 将10%最差转换率x3转换为页面应用的数据
export function transformX3Cont(arr) {
  const newArr = {};
  // 后端要求的格式详情查看说明.md
  newArr.hour = arr[0].conditions[0].first;
  // 后端要求的格式详情查看说明.md
  newArr.day = arr[0].conditions[0].end;
  // 后端要求的格式详情查看说明.md
  newArr.per = arr[0].formula;
  return newArr;
}
// 将整体QC转换为传给后台的数据
export function transformQC(arr) {
  const obj = {};
  // 后端要求的格式详情查看说明.md
  obj[0] = renderFormula(2, arr.perOne, [renderConditions(3, 'qc_order_avg_points', arr.pointsOne)]);
  // 后端要求的格式详情查看说明.md
  obj[1] = renderFormula(2, arr.perTwo, [renderConditions(8, 'qc_order_avg_points', arr.pointsOne, arr.pointsThree)]);
  // 后端要求的格式详情查看说明.md
  obj[2] = renderFormula(2, arr.perThree, [renderConditions(2, 'qc_order_avg_points', arr.pointsThree)]);
  return obj;
}
// 将整体QC转换为页面应用的数据
export function transformQCCont(obj) {
  const newArr = {};
  // 后端要求的格式详情查看说明.md
  newArr.pointsOne = obj[0].conditions[0].first;
  // 后端要求的格式详情查看说明.md
  newArr.perOne = obj[0].formula;
  // 后端要求的格式详情查看说明.md
  newArr.perTwo = obj[1].formula;
  // 后端要求的格式详情查看说明.md
  newArr.pointsThree = obj[2].conditions[0].first;
  // 后端要求的格式详情查看说明.md
  newArr.perThree = obj[2].formula;
  return newArr;
}

// 将单项QC转换为传给后台的数据
export function transformOneQC(obj) {
  const newObj = {};
  // 后端要求的格式详情查看说明.md
  newObj.qc_fine_type = parseFloat(obj.type);
  // 后端要求的格式详情查看说明.md
  newObj.deduction = obj.per;
  return newObj;
}

// 将单项QC转换为页面应用的数据
export function transformOneQCCont(obj) {
  // 后端要求的格式详情查看说明.md
  if (!obj.qc_fine_type) {
    return;
  }
  const newObj = {};
  // 后端要求的格式详情查看说明.md
  newObj.type = obj.qc_fine_type.toString();
  // 后端要求的格式详情查看说明.md
  newObj.per = obj.deduction;
  return newObj;
}

// 将UGC转换为传给后台的数据
export function transformUGC(obje) {
  const obj = {};
  // 后端要求的格式详情查看说明.md
  obj[0] = renderFormula(2, obje.per, [renderConditions(2, 'biz_single_ugc', obje.site)]);
  return obj;
}

// 将UGC转换为页面应用的数据
export function transformUGCCont(arr) {
  const newArr = {};
  // 后端要求的格式详情查看说明.md
  newArr.site = arr[0].conditions[0].first;
  // 后端要求的格式详情查看说明.md
  newArr.per = arr[0].formula;
  return newArr;
}

// 将违规操作转换为传给后台的数据
export function transformBreakRule(obje) {
  const obj = {};
  // 后端要求的格式详情查看说明.md
  obj[0] = renderFormula(2, obje.per, [renderConditions(3, 'biz_single_operation_violation', obje.site)]);
  return obj;
}

// 将违规操作转换为页面应用的数据
export function transformBreakRuleCont(arr) {
  const newArr = {};
  // 后端要求的格式详情查看说明.md
  newArr.site = arr[0].conditions[0].first;
  // 后端要求的格式详情查看说明.md
  newArr.per = arr[0].formula;
  return newArr;
}

// 将用户差评率转换为传给后台的数据
export function transformBadCommet(obje) {
  const obj = {};
  // 后端要求的格式详情查看说明.md
  obj[0] = renderFormula(2, obje.per, [renderConditions(3, 'biz_single_operation_violation', obje.site)]);
  return obj;
}
// 将用户差评率转换为页面应用的数据
export function transformBadCommetCont(arr) {
  const newArr = {};
  // 后端要求的格式详情查看说明.md
  newArr.site = arr[0].conditions[0].first;
  // 后端要求的格式详情查看说明.md
  newArr.per = arr[0].formula;
  return newArr;
}

// 将出勤人数奖励转换为传给后台的数据
export function transformAttendanceNum(arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    // 后端要求的格式详情查看说明.md
    obj[i] = renderFormula(2, arr[i].per, [renderConditions(7, 'average_daily_order_knight_count', arr[i].day)]);
  }
  return obj;
}

// 将出勤人数奖励转换为页面应用的数据
export function transformAttendanceNumCont(obj) {
  const arr = [];

  for (const term in obj) {
    arr.push(obj[term]);
  }

  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr[i] = {};
    newArr[i].day = arr[i].conditions[0].first.toString();
    newArr[i].per = arr[i].formula;
  }
  return newArr;
}
