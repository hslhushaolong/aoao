
// 工具类
class Utils {

  // 下载文件
  static downloadFile = (url = '', name) => {
    if (url === '') {
      alert('下载地址为空，无法下载文件');
      console.log('DEBUG:下载地址为空，无法下载文件');
      return false;
    }

    let link = document.createElement('a');
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link = null;
  }
  // 返回一个元对象的拷贝，删除那些空字段和空数组字段
  static copyNotEmptyProperty = (obj = {}, ...excpetPropName) => {
    return Object.keys(obj).reduce((accumlater, item) => {
      if ((Object.hasOwnProperty.call(obj, item)
      && (obj[item] || obj[item] === 0)
      && ((Array.isArray(obj[item]) && obj[item].length > 0) ||
      (!Array.isArray(obj[item]) && obj[item] !== '')))
      // 白名单判断
      || (excpetPropName && excpetPropName.indexOf(item) > -1)) {
        accumlater[item] = obj[item];
      }
      return accumlater;
    }, {});
  }
  // 判断是否是符合格式的身份证号
  static isProperIdCardNumber(number) {
    return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/.test(number);
  }
  // 判断是否正确的金额
  static isProperMoneyNumber(number) {
    return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(number);
  }
}

export default Utils;
