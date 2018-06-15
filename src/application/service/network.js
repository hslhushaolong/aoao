// 网络状况
class Network {

  // 有网络的钩子
  static observerOnline(func = () => {}) {
    Network.addHandler(window, 'online', func);
  }

  // 断网的钩子
  static observerOffline(func = () => {}) {
    Network.addHandler(window, 'offline', func);
  }

  static addHandler(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent(`on${type}`, handler);
    } else {
      element[`on${type}`] = handler;
    }
  }
}

export default Network;
