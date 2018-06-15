// 角色，职位，权限 对照显示模块
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Modal, Popconfirm, message, Button, Form, Input, Select, Radio } from 'antd';

import { CoreContent, CoreForm } from '../../../../components/core';
import { RoleState } from '../../../../application/define';

const { Option } = Select;

class ManagementRoles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: dot.get(props, 'authorize.roles', []), // 角色信息
      updateRecord: {},           // 需要更新的数据，默认为空数据
      isShowUpsertModal: false,   // 是否显示操作弹窗
    };

    this.private = {
      dispatch: props.dispatch,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      roles: dot.get(props, 'authorize.roles', []),                   // 角色信息
    });
  }

  // 更新状态
  onUpdateState = (role, state) => {
    const { dispatch } = this.private;
    const payload = {
      gid: role.gid,
      name: role.name,
      pid: role.pid,
      state,
    };
    dispatch({ type: 'authorize/updateSystemRole', payload });
  }

  // 创建,更新操作
  onSubmitUpsert = () => {
    const { onHideUpsertModal } = this;
    const { dispatch } = this.private;
    this.props.form.validateFields((err, values) => {
      // 错误判断
      if (err) {
        return;
      }
      const { isUpdate, gid, name, pid, state } = values;

      if (name === '') {
        message.error('角色名称不能为空');
        return;
      }

      if (pid === '') {
        message.error('所属上级不能为空');
        return;
      }

      // 判断是否是更新操作，更新数据
      if (isUpdate) {
        const payload = {
          gid,
          name,
          pid,
          state,
        };
        dispatch({ type: 'authorize/updateSystemRole', payload });
      } else {
        // 添加新数据
        const payload = {
          name,
          pid,
        };
        dispatch({ type: 'authorize/createSystemRole', payload });
      }
      // 隐藏弹窗
      onHideUpsertModal();
    });
  }

  // 显示创建,更新弹窗，如果有要编辑的数据，则设置编辑数据。
  onShowUpsertModal = (record = {}) => {
    this.setState({ updateRecord: record, isShowUpsertModal: true });
  }

  // 隐藏创建,更新弹窗，同时重置数据
  onHideUpsertModal = () => {
    this.setState({ updateRecord: {}, isShowUpsertModal: false });
    this.props.form.resetFields();
  }

  // 根据父级id获取子集数据
  getRolesByPid = (roles, pid) => {
    const { getRolesByPid } = this;
    // 获取子类别数据
    const result = [];
    roles.forEach((item) => {
      // 如果是被删除的数据则不显示
      if (item.available === RoleState.deleted) {
        return;
      }

      // 匹配获取的分类数据
      if (`${item.current_pid}` === `${pid}`) {
        const role = item;
        role.key = `${item.gid}-${item.current_pid}`;
        role.children = getRolesByPid(roles, item.gid);
        result.push(role);
      }
    });
    if (is.empty(result)) {
      return;
    }
    return result;
  }

  // 渲染角色管理列表
  renderManagementRoles = () => {
    const { onShowUpsertModal, onUpdateState } = this;
    const { roles } = this.state;

    // 获取角色树
    const dataSource = this.getRolesByPid(roles, 0);

    const columns = [{
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '状态',
      dataIndex: 'available',
      key: 'available',
      render: text => (
        <span>{RoleState.description(text)}</span>
      ),
    }, {
      title: '角色id',
      dataIndex: 'gid',
      key: 'id',
    }, {
      title: '操作',
      dataIndex: 'gid',
      key: 'gid',
      render: (gid, role) => {
        // 系统创建的数据，不可以进行操作
        if (role.pid === 0) {
          return '';
        }

        // 渲染的内容
        const content = [];
        // 判断是否启用
        if (role.available === RoleState.available) {
          content.push(
            <span key={`off-${gid}`}style={{ marginLeft: '10px' }}>
              <Popconfirm title="确定执行此操作?" onConfirm={() => { onUpdateState(role, RoleState.disable); }} okText="确定" cancelText="取消">
                <a>禁用</a>
              </Popconfirm>
            </span>,
          );
        }

        // 判断是否停用
        if (role.available === RoleState.disable) {
          content.push(
            <span key={`on-${gid}`} style={{ marginLeft: '10px' }}>
              <Popconfirm title="确定执行此操作?" onConfirm={() => { onUpdateState(role, RoleState.available); }} okText="确定" cancelText="取消">
                <a>启用</a>
              </Popconfirm>
            </span>,
          );
        }

        // 判断是否有子级数据，如果有，不能停用
        if (is.empty(role.children) || is.not.existy(role.children)) {
          content.push(
            <span key={`delete-${gid}`}style={{ marginLeft: '10px' }}>
              <Popconfirm title="确定执行此操作?" onConfirm={() => { onUpdateState(role, RoleState.deleted); }} okText="确定" cancelText="取消">
                <a>停用</a>
              </Popconfirm>
            </span>,
          );
        }

        return (
          <span>
            <a onClick={() => { onShowUpsertModal(role); }}>编辑</a>
            {content}
          </span>
        );
      },
    }];

    const ext = (
      <div>
        <Button type="primary" style={{ marginRight: '5px' }} onClick={() => { onShowUpsertModal(); }}>添加角色</Button>
      </div>
    );

    return (
      <CoreContent title={'角色管理'} titleExt={ext}>
        <Table dataSource={dataSource} columns={columns} bordered defaultExpandAllRows />
      </CoreContent>
    );
  }

  // 渲染更新数据弹窗
  renderUpsertModal = () => {
    const { updateRecord, isShowUpsertModal, roles } = this.state;
    const { onSubmitUpsert, onHideUpsertModal } = this;
    const { getFieldDecorator } = this.props.form;

    // 是否是更新数据
    const isUpdate = !!(is.existy(updateRecord) && is.not.empty(updateRecord));
    const title = isUpdate ? '更新数据' : '添加数据';

    // 获取表单的初始化数据，如果数据不存在，则显示默认的数据
    const initialValue = {
      name: dot.get(updateRecord, 'name', ''),
      pid: dot.get(updateRecord, 'current_pid', ''),
    };

    const formItems = [
      {
        label: '角色名称',
        form: getFieldDecorator('name', { initialValue: initialValue.name })(<Input />),
      }, {
        label: '所属上级',
        form: (
          getFieldDecorator('pid', { initialValue: `${initialValue.pid}` })(
            <Select placeholder="请选择所属上级">
              {roles.filter(item => item.gid !== updateRecord.gid).map((role) => {
                return <Option key={`role-select-${role.gid}`} value={`${role.gid}`}>{role.name}</Option>;
              })}
            </Select>,
          )
        ),
      },
    ];

    // 隐藏的表单数据
    getFieldDecorator('isUpdate', { initialValue: isUpdate })(<Input />);
    getFieldDecorator('gid', { initialValue: dot.get(updateRecord, 'gid', '') })(<Input />);
    getFieldDecorator('state', { initialValue: dot.get(updateRecord, 'state', '') })(<Input />);

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 9 } };
    return (
      <Modal title={title} visible={isShowUpsertModal} onOk={onSubmitUpsert} onCancel={onHideUpsertModal} okText="提交" cancelText="取消">
        <Form layout="horizontal">
          <CoreForm items={formItems} cols={1} layout={layout} />
        </Form>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染权限管理列表 */}
        {this.renderManagementRoles()}

        {/* 渲染创建,更新弹窗 */}
        {this.renderUpsertModal()}
      </div>
    );
  }
}

function mapStateToProps({ authorize }) {
  return { authorize };
}

export default connect(mapStateToProps)(Form.create()(ManagementRoles));
