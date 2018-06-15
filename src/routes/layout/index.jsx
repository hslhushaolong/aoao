/**
 * 布局layout,容器组件
 * */

import React, { Component } from 'react';
import styles from './layout.less';
import Header from './header';
import Navigation from './navigation';
import BreadCrumb from './breadcrumb';
import Router from '../../application/service/router';

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathname: props.location.pathname,
    };
  }
  componentWillReceiveProps = (nextProps) => {
    this.setState({ pathname: nextProps.location.pathname });
  };

  render() {
    const { pathname } = this.state;
    // 面包屑
    const breadcrumb = Router.breadcrumbByPath(pathname);
    // 选中的菜单
    const selectedMenu = breadcrumb[0];
    // 选中的模块
    const selectedModule = breadcrumb.slice(-1)[0];
    // NOTE 删除了自定义组件上的不起作用的类名
    return (
      <div className={styles.layout}>
        <Header />
        <div className={'navbox'}>
          <Navigation selectedMenu={selectedMenu} selectedModule={selectedModule} />
        </div>
        <div className={`content ${styles.contents}`}>
          <BreadCrumb breadcrumb={breadcrumb} />
          <div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
export default IndexPage;
