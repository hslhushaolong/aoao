/**
 * 布局的header
 **/

import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Icon, Row, Col, Popover } from 'antd';
import styles from './layout.less';
import headerLogo from './static/navLogo@2x.png';
import user from './static/userIcon.png';
import { authorize } from '../../application';
import DownloadRecordsWidget from './widgets/download';
import { Roles } from '../../application/define';

class Header extends Component {
  // 下载框是否显示的属性变更回调
  onVisibleChange = (e) => {
    // 如果显示弹窗，则获取下载数据
    if (e) {
      this.props.dispatch({ type: 'SystemDownloadModal/fetchDownloadRecords' });
    }
  }

  // 切换账号
  onClickMenu = (e) => {
    const { key } = e;
    // 切换账户
    this.props.dispatch({ type: 'login/exchangeAccountE', payload: { accountId: key } });
  }

  // 注销用户
  onClickLogout = () => {
    this.props.dispatch({ type: 'login/loginClear', payload: '' });
  };

  render() {
    const userName = `${authorize.account.name}-${authorize.account.role.name}` || '用户名获取失败';
    const vendors = authorize.vendors;
    const menuVendors = [];
    vendors.forEach((item, index, record) => {
      const supplierName = (item.supplier_name && (item.supplier_name)) || '';
      const accountsInfo = item.name.concat('-', Roles.description(item.gid), supplierName);

      // 账号信息
      if (authorize.account.id === item.account_id) {
        menuVendors.push(<Menu.Item key={item.account_id} style={{ color: '#FF7700' }}><Icon type="check-circle-o" /> {accountsInfo}</Menu.Item>);
      } else {
        menuVendors.push(<Menu.Item style={{ backgroundColor: '#fff' }} key={item.account_id} ><Icon type="user" />{accountsInfo}</Menu.Item>);
      }
    });
    // 下拉内容
    let title = '切换账号';
    let content = (
      <div>
        <Menu style={{ maxHeight: '200px', overflow: 'auto' }} onClick={this.onClickMenu} className={`${styles.userMenu} ant_menu_item_selected`}>
          {menuVendors}
          <Menu.Divider />
        </Menu>
        <p onClick={this.onClickLogout} ><a href="#" style={{ color: '#000', size: '14px', marginTop: '10px' }}>退出系统</a></p>
      </div>
    );
    if (vendors.length === 0) {
      title = '暂无可切换账号';
      content = <p onClick={this.onClickLogout} ><a href="#" style={{ color: '#000', size: '14px', marginTop: '10px' }}>退出系统</a></p>;
    }

    return (
      <header className={styles.header}>
        <Row gutter={16}>
          <Col span={4}><img src={headerLogo} alt="趣活科技" className={styles.img} /></Col>
          <Col span={20}>
            <Row>
              <Col span={4} className={styles.title}>嗷嗷BOSS系统</Col>
              <Col span={20}>
                <Row type="flex" justify="end">
                  <Col span={2} style={{ color: 'white', paddingTop: '9px', fontSize: '20px' }} >
                    <Popover title="下载任务列表" trigger="click" onVisibleChange={this.onVisibleChange} content={<DownloadRecordsWidget />}>
                      <Icon type="download" />
                    </Popover>
                  </Col>
                  <Col span={6} className={styles.user}>
                    <Popover content={content} title={title} trigger="click" >
                      <Row className="ant-dropdown-link" type="flex" justify="end">
                        <Col span={6}><img src={user} alt="" /></Col>
                        <Col span={18} style={{ paddingTop: '5px' }}>{userName} &nbsp;<Icon type="down" /></Col>
                      </Row>
                    </Popover>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </header>
    );
  }
}
function mapStateToProps({ login }) {
  return { login };
}

export default connect(mapStateToProps)(Header);
