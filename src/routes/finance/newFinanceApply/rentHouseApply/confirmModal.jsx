/**
 * 新租申请弹窗确认页面
 * @author Jay
 *
 */
import dot from 'dot-prop';
import { Form, Icon, Modal } from 'antd';
import React, { Component } from 'react';

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,  // 对话框是否可见
      amount: props.amount,  // 申请总额
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      amount: nextProps.amount,
    });
  }

  // 点击取消
  handleCancel() {
    this.props.form.resetFields();
    this.props.handleCancel();
  }

  // 点击确定
  handleOk() {
    this.props.form.validateFields((err) => {
      if (err) {
        return false;
      } else {
        const values = this.props.form.getFieldsValue();
        this.props.handleOk(values);
      }
    });
    // 重置表单
    this.props.form.resetFields();
  }

  // 监听输入框输入
  textInput() {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <Form>
          <Modal
            title="信息确认"
            visible={this.state.visible}
            onCancel={this.handleCancel.bind(this)}
            width="450px"
            onOk={this.handleOk.bind(this)}
            okText="确认"
            cancelText="取消"
          >
            <div style={{ paddingLeft: '60px', fontSize: '14px', position: 'relative' }}>
              <span style={{ color: 'red', position: 'absolute', left: '40px', top: '1px' }}><Icon type="exclamation-circle-o" /></span>
              <p style={{ marginBottom: '8px' }}>申请金额为：{dot.get(this, 'state.amount.allTotal')}</p>
              <p style={{ marginBottom: '8px' }}>支付月份为：{dot.get(this, 'state.amount.startDate')} ~ {dot.get(this, 'state.amount.endDate')}</p>
              <p style={{ fontSize: '10px' }}>您要继续发送申请吗？</p>
            </div>
          </Modal>
        </Form>
      </div>
    );
  }
}

const ConfirmModal = Form.create()(Info);

export default ConfirmModal;
