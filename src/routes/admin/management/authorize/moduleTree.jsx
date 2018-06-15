// 角色，职位，权限 对照显示模块
import is from 'is_js';
import React, { Component } from 'react';
import { Tree, Card, Col, message, Collapse } from 'antd';

const Panel = Collapse.Panel;

import { ModuleState } from '../../../../application/define';
import Navigation from '../../../../application/define/navigation';

class ModuleTree extends Component {
  constructor(props) {
    super(props);

    // 有权限的模块id (过滤状态是可用状态，并且返回格式只返回id)
    const checkedKeys = props.permission.filter(item => item.state === ModuleState.access).map(item => item.id) || [];

    this.state = {
      id: props.id,                         // 角色id
      name: props.name,                     // 角色姓名
      permission: props.permission || [],   // 角色权限
      isActive: props.isActive,             // 是否是展开状态

      checkedKeys,  // 已经拥有的权限
      onChangePannelActive: props.onChangePannelActive, // 更改pannel的展开状态
    };

    this.private = {
      dispatch: props.dispatch,
    };
  }

  componentWillReceiveProps(props) {
    // 有权限的模块id (过滤状态是可用状态，并且返回格式只返回id)
    const checkedKeys = props.permission.filter(item => item.state === ModuleState.access).map(item => item.id) || [];

    this.state = {
      id: props.id,                         // 角色id
      name: props.name,                     // 角色姓名
      permission: props.permission || [],   // 角色权限

      checkedKeys,  // 已经拥有的权限
    };
  }

  // 点击选择框，进行权限操作
  onClickNode = (checkedKeys, e) => {
    const { dispatch } = this.private;
    const { id, permission } = this.state;

    // 遍历所有模块，生成权限的提交参数
    const data = {};
    // 遍历原权限列表
    permission.forEach((item) => {
      data[item.id] = checkedKeys.checked.includes(item.id) ? 1 : 0;
    });
    // 遍历新的模块，生成权限的提交参数
    checkedKeys.checked.forEach((item) => {
      data[item] = 1;
    });

    // 更新权限信息
    const payload = {
      roleId: id,
      permission: data,
    };
    dispatch({ type: 'authorize/updateSystemPermission', payload });

    // 更新选择的key
    this.setState({
      checkedKeys: checkedKeys.checked,
    });
  }

  // 渲染模块树信息
  renderTreeNodes = (data, isRelative = false, isOperate = false) => {
    const { checkedKeys } = this.state;

    return data.map((item) => {
      let title = '';

      // 判断是否是关联模块
      if (isRelative) {
        title = `${item.module.title} (子页)`;
      } else if (isOperate) {
        title = `${item.module.title} (操作)`;
      } else {
        title = `${item.module.title}`;
      }

      // 判断模块是否有权限访问，没有权限则为灰色，并且不选中
      if (checkedKeys.includes(item.module.id) !== true) {
        title = <span style={{ color: '#CCCCCC' }}>{title}</span>;
      } else {
        title = <span style={{ color: '#14D6A6' }}>{title}</span>;
      }

      // 子模块（显示在导航栏中）
      let routes = [];
      if (item.routes) {
        routes = this.renderTreeNodes(item.routes);
      }

      // 关联子页面（默认不显示在导航栏中）
      let relative = [];
      if (item.relative) {
        relative = this.renderTreeNodes(item.relative, true);
      }

      // 关联的页面内权限规则
      let operations = [];
      if (item.operations) {
        operations = this.renderTreeNodes(item.operations, false, true);
      }

      // 判断节点数据是否为空
      if (is.not.empty(routes) || is.not.empty(relative) || is.not.empty(operations)) {
        const content = [].concat(routes).concat(relative).concat(operations);
        return (
          <Tree.TreeNode title={title} key={item.module.id} dataRef={item.module} path={item.module.path} >
            {content}
          </Tree.TreeNode>
        );
      }

      return <Tree.TreeNode title={title} key={item.module.id} path={item.module.path} />;
    });
  }

  // 更改展开收起的状态
  onChangeCollapse = (e) => {
    const isActive = is.not.empty(e);
    const { id, onChangePannelActive } = this.state;
    if (onChangePannelActive) {
      onChangePannelActive(id, isActive);
    }
  }

  render() {
    const { onChangeCollapse } = this;
    const { name, checkedKeys, isActive } = this.state;
    const defaultActiveKey = isActive ? name : null;

    // 渲染授权模块信息
    return (
      <Collapse defaultActiveKey={defaultActiveKey} style={{ marginBottom: '10px' }} onChange={onChangeCollapse}>
        <Panel header={name} key={name}>
          <Tree defaultExpandAll onCheck={this.onClickNode} checkable checkStrictly checkedKeys={checkedKeys}>
            {this.renderTreeNodes(Navigation)}
          </Tree>
        </Panel>
      </Collapse>
    );
  }
}
export default ModuleTree;
