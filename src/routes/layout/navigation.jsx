/**
 *  侧栏导航
 * */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import styles from './layout.less';
import { authorize } from '../../application';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 选中的菜单
      selectedMenu: props.selectedMenu,
      // 选中的模块
      selectedModule: props.selectedModule,
      // 缓存计算好的侧边栏数据
      navigation: authorize.navigation(),
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      // 选中的菜单
      selectedMenu: nextProps.selectedMenu,
      // 选中的模块
      selectedModule: nextProps.selectedModule,
    });
  };

  // 选中菜单的回调函数
  onMenuClick = ({ item, key, keyPath }) => {
    // console.log('Debug: 选中菜单', item, key, keyPath);
  }

  // 渲染菜单
  renderMenu = (data) => {
    return data.map((item) => {
      // 判断模块是否有权限可以访问, 并且可以显示在菜单栏上
      if (item.module.canAccess === false) {
        return undefined;
      }

      // 子菜单
      if (item.routes) {
        return (
          <Menu.SubMenu key={item.module.key} title={<span><Icon type={item.module.icon} /><span>{item.module.title}</span></span>}>
            {this.renderMenu(item.routes)}
          </Menu.SubMenu>
        );
      }

      return <Menu.Item key={item.module.key}><a href={`/#/${item.module.path}`}>{item.module.title}</a></Menu.Item>;
    });
  }

  render() {
    const { selectedMenu, selectedModule } = this.state;
    // 默认展开的菜单和选中的菜单
    const defaultOpenKeys = dot.get(selectedMenu, 'key');
    const defaultSelected = dot.get(selectedModule, 'key');
    // TODO: 暂时处理，隐藏高级设置
    const tempArr = this.state.navigation;
    const navigation = tempArr.slice(0, tempArr.length - 1);

    return (
      <Menu theme="dark" mode="inline" defaultOpenKeys={[defaultOpenKeys]} selectedKeys={[defaultSelected]} className={styles.menu} onClick={this.onMenuClick}>
        {this.renderMenu(navigation)}
      </Menu>
    );
  }
}
export default Navigation;
