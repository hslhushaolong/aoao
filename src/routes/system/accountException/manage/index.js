// 异常账户处理
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Button, Form, Select, Alert, Input, message } from 'antd';
import dot from 'dot-prop';

import { CoreContent } from '../../../../components/core';
import { authorize } from '../../../../../src/application';
import { ExceptionHandleMethod, ExceptionPlatformState, ExceptionBossState, ExceptionMessage } from '../define';

const { Option } = Select;

class IndexDeals extends Component {
  constructor(props) {
    super();
    this.state = {
      list: dot.get(props, 'AccountException.accountExceptionData.result', []),  // 获取的异常账号数据
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: dot.get(nextProps, 'AccountException.accountExceptionData.result', []),  // 异常账号数据
    });
  }

  // 退出登陆
  onLogout = () => {
    this.props.dispatch({ type: 'login/loginClear' });
  }

  // 确认提交
  onSubmit = (e) => {
    const { list } = this.state;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // 便利数据，处理错误
      for (let i = 0; i < list.length; i += 1) {
        const { desc, isDisplayCustomMessage } = list[i];
        // 获取提交的处理方式
        const handling = dot.get(values, `${list[i]._id}`);

        // 判断数据的处理方式
        if (handling === undefined) {
          return message.error(`请选择 第${i + 1}条 数据的处理方式`);
        }
        // 判断补充信息是否填写
        if (isDisplayCustomMessage && desc.length <= 0) {
          return message.error(`请填写 第${i + 1}条 数据的补充信息`);
        }

        // 设置处理方式
        list[i].handling = handling;
      }

      // 更新数据
      this.props.dispatch({ type: 'AccountException/updateAccountExceptionData', payload: { list } });
    });
  }

  // 处理信息
  onChangeHandleMethod = (recordId, value) => {
    const { list } = this.state;

    const newList = [];
    list.forEach((item) => {
      const newItem = item;
      // 判断数据是否是当前数据
      if (recordId === item._id) {
        // 设置是否显示自定义信息填写
        newItem.isDisplayCustomMessage = ExceptionHandleMethod.isDisplayCustomMessage(value);
        // 自定义内容设置为空
        newItem.desc = '';
      }
      newList.push(newItem);
    });

    // 设置数据
    this.setState({
      list: newList,
    });
  }

  // 修改自定义的信息
  onChangeCustomMessage = (recordId, value) => {
    const { list } = this.state;

    const newList = [];
    list.forEach((item) => {
      const newItem = item;
      // 判断数据是否是当前数据
      if (recordId === item._id) {
        // 设置自定义的数据
        newItem.desc = value;
      }
      newList.push(newItem);
    });

    // 设置数据
    this.setState({
      list: newList,
    });
  }

  // 渲染列表
  renderContent = () => {
    const { list } = this.state;
    const dataSource = list;
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '职位',
      dataIndex: 'position_id',
      key: 'position_id',
      render: text => (
        <span>{authorize.poistionNameById(text)}</span>
      ),
    }, {
      title: '平台系统状态',
      dataIndex: 'platform_state',
      key: 'platform_state',
      render: text => (
        <span>{ExceptionPlatformState.description(text)}</span>
      ),
    }, {
      title: 'Boss系统状态',
      dataIndex: 'boss_state',
      key: 'boss_state',
      render: text => (
        <span>{ExceptionBossState.description(text)}</span>
      ),
    }, {
      title: '异常原因',
      dataIndex: 'error_reason',
      key: 'account_error',
      render: text => (
        <span>{ExceptionMessage.description(text)}</span>
      ),
    }, {
      title: '处理方式',
      dataIndex: '_id',
      key: '_id',
      width: '20%',
      render: (text, record) => {
        const recordId = record._id;
        // 是否显示自定义信息
        const { isDisplayCustomMessage } = record;

        // 所有的下拉选择
        const options = ExceptionHandleMethod.getHandleMethods(record.error_reason, record.platform_state, record.boss_state);

        // 对应操作
        const selector = (
          this.props.form.getFieldDecorator(recordId, {
            rules: [{ required: true, message: '请选择对应操作!' }],
            initialValue: dot.get(options, '0.value'),
          })(
            <Select placeholder="请选择" onChange={e => this.onChangeHandleMethod(recordId, e)}>
              {/* 根据当前数据的状态，判断给出处理方式 */}
              {
                options.map(item => (
                  <Option value={`${item.value}`} key={`${item.value}`}>{item.name}</Option>
                ))
              }
            </Select>,
          )
        );

        // 填写自定义信息
        const customMessage = (
          <Input onChange={(e) => { this.onChangeCustomMessage(recordId, e.target.value); }} value={record.desc} style={{ marginTop: '5px' }} />
        );

        // 显示自定义信息的选项
        if (isDisplayCustomMessage) {
          return <div>{selector} {customMessage}</div>;
        }
        // 不显示自定义信息选项
        return <div>{selector}</div>;
      },
    }];

    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }} title="异常账号处理">
        <Table rowKey={record => record._id} dataSource={dataSource} columns={columns} pagination={false} bordered />
      </CoreContent>
    );
  }

  // 渲染提示信息
  renderAlertMessage = () => {
    const alertMessage = (
      <div style={{ margin: '0 auto' }}>
        <p>
          <b>发现异常账号需要您处理</b><br />
          注：选择处理方式后以下两种情况处理后需要进行额外操作，否则次日将继续提醒 <br />
          1】不存在账号，标记后需要手动创建对应员工入职；<br />
          2】所属平台骑士状态不符（boss离职，平台在职），需要所属平台将对应员工进行离职操作
        </p>
      </div>
    );
    return (
      <Alert message={alertMessage} type="error" showIcon />
    );
  }

  render() {
    // fix永远相对body定位
    return (
      <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '999', backgroundColor: 'white', overflow: 'auto' }}>
        <Form>
          <CoreContent>
            {/* 渲染提示信息 */}
            { this.renderAlertMessage() }

            {/* 渲染表单内容 */}
            { this.renderContent() }

            {/* 渲染操作按钮 */}
            <CoreContent style={{ textAlign: 'center' }}>
              <Button type="primary" onClick={this.onSubmit}>提交</Button>
              <Button type="default" onClick={this.onLogout} style={{ marginLeft: '20px' }}>退出系统</Button>
            </CoreContent>
          </CoreContent>
        </Form>
      </div>);
  }
}
const IndexDeal = Form.create()(IndexDeals);
const mapStateToProps = ({ AccountException }) => {
  return { AccountException };
};

export default connect(mapStateToProps)(IndexDeal);
