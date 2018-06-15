// 权限管理模块
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Row, Col } from 'antd';

import ModuleTree from './moduleTree';
import { CoreContent } from '../../../../components/core';
import { RoleState } from '../../../../application/define';

class System extends Component {
  constructor(props) {
    super(props);

    // 初始化state
    this.initStateWithPermission(dot.get(props, 'authorize.permissions', []));

    this.private = {
      dispatch: props.dispatch,
    };
  }

  componentWillReceiveProps(props) {
    // 初始化state
    this.setState({
      permissions: dot.get(props, 'authorize.permissions', []).filter(item => item.available === RoleState.available),
    });
  }

  // 设置内容框的展开状态
  onChangePannelActive = (id, isActive) => {
    const { activePanel } = this.state;
    if (is.not.existy(activePanel[id])) {
      return;
    }
    activePanel[id] = isActive;
    this.setState({
      activePanel,
    });
  }

  // 初始化state
  initStateWithPermission = (permissions = []) => {
    // 展开显示的面板
    const activePanel = [];
    // 显示的角色数据
    const permissionsData = [];
    // 遍历当前数据
    permissions.forEach((item) => {
      // 只有启用状态下的数据才能显示
      if (item.available === RoleState.available) {
        activePanel[item.gid] = false;
        permissionsData.push(item);
      }
    });

    this.state = {
      permissions: permissionsData, // 权限信息
      activePanel,  // 默认展开的panel
    };
  }

  // 渲染授权模块信息
  renderAuthorizeModules = () => {
    const { onChangePannelActive } = this;
    const { permissions, activePanel } = this.state;
    const { dispatch } = this.private;
    return (
      <CoreContent title="模块权限信息" style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={8}>
          {/* 遍历角色的权限信息 */}
          {permissions.map((item) => {
            const name = item.name;
            const id = item.gid;
            const permission = item.permission_class;
            const key = Math.random();
            const isActive = is.truthy(activePanel[id]);
            return <Col span={8} key={key}><ModuleTree id={id} name={name} permission={permission} dispatch={dispatch} isActive={isActive} onChangePannelActive={onChangePannelActive} /></Col>;
          })}
        </Row>
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染授权模块信息 */}
        {this.renderAuthorizeModules()}
      </div>
    );
  }
}
function mapStateToProps({ authorize }) {
  return { authorize };
}
export default connect(mapStateToProps)(System);
