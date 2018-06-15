/**
 * 确然弹窗
 * @author Jay
 */
import { Form, Icon, Modal } from 'antd';
import React, { Component } from 'react';

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,  // 显示属性
      amount: props.amount || 0,  // 申请总额
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      amount: nextProps.amount || 0,
    });
  }

  // 点击取消
  handleCancel() {
    // 重置表单
    this.props.form.resetFields();
    // 调用父级方法
    this.props.handleCancel();
  }

  // 点击确定，提交申请
  handleOk() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      } else {
        const values = this.props.form.getFieldsValue();
        // 传递参数给父级
        this.props.handleOk(values);
      }
    });
    this.props.form.resetFields();
  }

  // 监听输入
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
              <p style={{ marginBottom: '8px' }}>申请金额为：{this.state.amount}</p>
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
