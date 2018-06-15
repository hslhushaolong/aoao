/**
 * 多账号登录
 */
import is from 'is_js';
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Button, Form, Icon, message } from 'antd';
import { authorize } from '../../../application';
import { Roles } from '../../../application/define';


const FormItem = Form.Item;

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendors: authorize.vendors,
      selectedAccount: null,  // 当前选中账号
    };
    this.private = {
      dispatch: props.dispatch,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      verifyCode: dot.get(nextProps, 'login.verifyCode', ''),
    });
  }
  // 组件卸载时清除计时器
  componentWillUnmount = () => {
    // 清除计时器
    clearInterval(this.private.timer);
  }
  // 清除input数据&隐藏清除按钮
  onClear = () => {
    const { resetFields } = this.props.form;
    // 清除手机号和验证码
    resetFields();
  }
  // 聚焦 显示清除按钮
  onCloseFocus = () => {
    this.setState({
      closeState: true,
    });
  }
  // 选择账号
  onSelectAccount = (vendor) => {
    this.setState({ selectedAccount: vendor });
  }

  // 重置授权，返回登陆界面
  onAuthClear = () => {
    authorize.clear();

    // 跳转到登陆页
    setTimeout(() => { window.location.href = '/#/authorize/login'; }, 500);
  }

  // 选择服务商，使用账号进行登陆
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.private;
    const { vendors, selectedAccount } = this.state;
    // 判断账户是否选择
    const vendorId = selectedAccount.account_id;
    if (is.not.truthy(vendorId) || is.not.string(selectedAccount.account_id)) {
      message.info('请选择要登陆的账户');
      return;
    }

    // 获取账户授权
    dispatch({
      type: 'login/exchangeAccountE',
      payload: { accountId: selectedAccount.account_id },
    });
  }

  // 渲染多账号
  renderAccountsComponent = () => {
    const { selectedAccount, vendors } = this.state;
    const accountsList = [];
    // 获取该账号下的相关账号
    vendors.forEach((item, index) => {
      const key = item.account_id + index;
      const formattedName =
        (<div style={{ display: 'flex', justifyContent: 'center' }}>
          <span>{item.supplier_name}</span>
          <span>{`(${Roles.description(item.gid)})`}</span>
          {/* <span>{`${authorize.roleNameById(item.gid)}-(${item.supplier_name || '超管暂无供应商'})-${item.name}`}</span> */}
        </div>);

      if (selectedAccount === item.account_id) {
        accountsList.push(<div key={key}><Button style={{ lineHeight: '20px', width: '80%' }} onClick={() => { this.onSelectAccount(item); }} icon="check-circle-o">{formattedName}</Button></div>);
      } else {
        accountsList.push(<div key={key}><Button style={{ lineHeight: '20px', width: '80%' }} onClick={() => { this.onSelectAccount(item); }}>{formattedName}</Button></div>);
      }
    });

    return (
      <div style={{ maxHeight: '200px', overflow: 'scroll', overflowY: 'scroll', margin: '10px 0px' }}>
        {accountsList}
      </div>
    );
  }
  render() {
    return (
      <Form style={{ width: '100%', textAlign: 'center', backgroundColor: '#fff', padding: '10px 10px' }} onSubmit={this.handleSubmit}>
        <FormItem >
          <h2> 选择账户 </h2>
          <div style={{ lineHeight: '20px', color: 'rgba(102, 102, 102, 0.6)' }}>当前手机号对应多个账号，请选择此次登录账号</div>
          {/* 渲染账户列表 */}
          {this.renderAccountsComponent()}
        </FormItem>
        <FormItem>
          <Button style={{ lineHeight: '20px', width: '70%' }} type="primary" htmlType="submit">进入账户</Button>
          <div>
            <Button style={{ border: 'none' }} onClick={() => { this.onAuthClear(); }}>重新登陆</Button>
          </div>
        </FormItem>
      </Form >
    );
  }
}

const mapStateToProps = ({ login }) => {
  return { login };
};

export default connect(mapStateToProps)(Form.create()(Auth));
