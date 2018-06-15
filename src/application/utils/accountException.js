// 账户异常的工具类
import { storage } from '../index';

// 判断是否是大于第二天
function isNextDay(lastTime, nowTime) {
  // 将时间挫转换为时间
  const nowTimeDate = new Date(parseFloat(nowTime));
  const lastTimeDate = new Date(parseFloat(lastTime));
  // 年份大于
  if (nowTimeDate.getFullYear() > lastTimeDate.getFullYear()) {
    return true;
  }
 // 月份大于
  if (nowTimeDate.getMonth() > lastTimeDate.getMonth()) {
    return true;
  }
 // 日期大于
  if (nowTimeDate.getDate() > lastTimeDate.getDate()) {
    return true;
  }
  return false;
}

class AccountException {

  // 是否显示异常弹窗
  static isDisplayException() {
    // 当前时间
    const nowTime = new Date().getTime();
    // 是否有异常
    const hasExpection = storage.get('hasExpection');
    // 上次显示异常页面的时间
    const lastShowExpectionTime = storage.get('lastShowExpectionTime');
    // 如果有异常, 且24小时前显示未显示，跳转到异常处理页面
    if (hasExpection && (lastShowExpectionTime === undefined || isNextDay(lastShowExpectionTime, nowTime))) {
    // if (hasExpection && (lastShowExpectionTime === undefined || (nowTime - lastShowExpectionTime) >= 86400000)) {
      return true;
    }
    return false;
  }

  // 是否检查账号异常的数据
  static isCheckException() {
    // 当前时间
    const nowTime = new Date().getTime();
    // 上次请求的时间
    const lastRequestTime = storage.get('lastRequestTime');

    // 无记录，判断是第一次登录查询是否有异常账号，或上次请求时间为一小时前，则请求服务器
    if (lastRequestTime === undefined || (nowTime - lastRequestTime) >= 3600000) {
    // if (lastRequestTime === undefined || (nowTime - lastRequestTime) >= 1000) {
      return true;
    }
    return false;
  }

  // 隐藏异常显示弹窗
  static hideException() {
    storage.set('hasExpection', false);
    storage.set('lastShowExpectionTime', new Date().getTime());
  }

  // 已经检测过账号异常的数据
  static exceptionChecked(hasExpection) {
    // 设置异常的状态
    storage.set('hasExpection', hasExpection);
    // 记录当前请求的时间戳
    storage.set('lastRequestTime', new Date().getTime());
  }

}

export default AccountException;
