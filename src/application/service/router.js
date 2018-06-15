import _ from 'lodash';
import dot from 'dot-prop';
import Navigation from '../define/navigation';

class RouterClass {

  /**
   * 根据授权模块，获导航栏菜单
   * @param canAccessHook  是否能够访问的钩子函数
   * @return 授权的导航栏列表 格式 [ {module}, {module, routes:[ {module}, {module} ]}]
   */
  static navigationByAccessHook = (canAccessHook) => {
    // clone数据，防止下层引用的修改导致数据错误
    const cloneData = _.cloneDeep(Navigation);
    return RouterClass.RecursionByAccessHook(canAccessHook, cloneData);
  }

  /**
   * 根据授权模块，获取路由列表 (递归处理多级菜单)
   * @param canAccessHook  是否能够访问的钩子函数
   * @param routes   路由列表格式 [ {module}, {module, routes:[ {module}, {module} ]}]
   * @return 授权路由列表 格式 [ {module}, {module, routes:[ {module}, {module} ]}]
   */
  static RecursionByAccessHook = (canAccessHook, routes) => {
    // 已经授权的路由列表
    const authRoutes = [];
    // 遍历路由列表中的数据
    routes.forEach((route) => {
      // 当前模块的路径
      const { module } = route;
      const { path } = module;

      // 判断模块是否可以访问
      if (canAccessHook && canAccessHook(path) !== false) {
        // 如果可以访问，则设置canAccess为可见
        module.canAccess = true;
      }

      // 获取关联模块
      let relative = [];
      if (route.relative !== undefined && route.relative.length > 0) {
        relative = RouterClass.RecursionByAccessHook(canAccessHook, route.relative);
      }

      // 获取关联操作
      let operations = [];
      if (route.operations !== undefined && route.operations.length > 0) {
        operations = RouterClass.RecursionByAccessHook(canAccessHook, route.operations);
      }

      // 如果没有子路由，直接添加module
      if (route.routes === undefined) {
        authRoutes.push({ module, relative, operations });
        return;
      }

      // 递归处理子路由数据
      const subRoutes = RouterClass.RecursionByAccessHook(canAccessHook, route.routes);
      authRoutes.push({ module, routes: subRoutes, relative, operations });
    });
    return authRoutes;
  }

  // 根据路径获导航栏菜单
  static breadcrumbByPath = (pathname) => {
    // 过滤路径中的字符串
    const path = pathname.replace(/\/*([\W\w]+)/, '$1');
    // 根据路径获取面包屑数据
    const breadcrumb = RouterClass.RecursionByPath(path, Navigation);
    // 数据反转（因为获取面包屑的算法输出数据是反的）
    return breadcrumb.reverse();
  }

  /**
  * 根据模块的path，获取面包屑 (递归获取父级)
  * @param path    路径
  * @param routes  路由列表格式 [ {module}, {module, routes:[ {module}, {module} ]}]
  * @return 授权路由列表 格式 [ {module}, {module, routes:[ {module}, {module} ]}]
  */
  static RecursionByPath = (path, routes) => {
    let breadcrumb = [];
    routes.forEach((route) => {
      // 当前模块的路径
      const { module } = route;

      // 判断模块是否可以访问
      if (module.path === path) {
        breadcrumb.push(module);
        return;
      }

      // 获取路由模块
      const routesData = dot.get(route, 'routes', []);
      // 获取关联模块
      const relativeData = dot.get(route, 'relative', []);
      // 合并两个模块的数据为一级
      const subRoutes = [].concat(relativeData).concat(routesData);
      if (subRoutes.length < 0) {
        return;
      }

      // 递归处理子路由数据
      const subcrumb = RouterClass.RecursionByPath(path, subRoutes);
      if (subcrumb.length > 0) {
        // 如果有子节点，则将父节点添加到数据中
        subcrumb.push(module);
        // 合并迭代的面包屑数据
        breadcrumb = breadcrumb.concat(subcrumb);
      }
    });
    return breadcrumb;
  }
}

module.exports = RouterClass;
