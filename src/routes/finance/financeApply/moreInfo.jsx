/**
 * Created by Jay
 * 续租页面，点击添加更多信息弹窗
 *
 * */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

class MoreInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,  // 弹框可见属性
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    });
  }

  // 点击取消
  handleCancel() {
    this.props.form.resetFields();
    // 调用父级方法
    this.props.handleCancel();
  }

  // 点击确认
  handleOk() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      } else {
        // 获取表单数据
        const values = this.props.form.getFieldsValue();
        if (this.props.handleOk) {
          // 父级传入的方法为handleOk
          this.props.handleOk(values);
        }
        if (this.props.handleEditOk) {
          // 父级传入的方法为handleEditOk
          this.props.handleEditOk(values, this.props.itemIndex);
        }
      }
    });
    // 重置表单
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 17,
      },
    };
    return (
      <div style={{ position: 'relative' }}>
        <Form>
          <Modal
            title="其他费用"
            visible={this.state.visible}
            onCancel={this.handleCancel.bind(this)}
            width="450px"
            onOk={this.handleOk.bind(this)}
            okText="确认"
            cancelText="取消"
          >
            <FormItem label={'费用金额'} {...formItemLayout}>
              {getFieldDecorator('amount', {
                rules: [{ required: true, message: '请输入金额!', trigger: 'onBlur', type: 'string' }],
                initialValue: dot.get(this, 'props.itemVal.amount', ''),
              })(
                <Input placeholder="请输入金额" />,
              )}
            </FormItem>
            <FormItem label={'收款人'} {...formItemLayout}>
              {getFieldDecorator('payee_name', {
                rules: [{ required: true, message: '请输入收款人!', trigger: 'onBlur', type: 'string' }],
                initialValue: dot.get(this, 'props.itemVal.payee_name', ''),
              })(
                <Input placeholder="请输入姓名" />,
              )}
            </FormItem>
            <FormItem label="收款账户" {...formItemLayout}>
              {getFieldDecorator('payee_credit_card_numbers', {
                rules: [{
                  type: 'string',
                  required: true,
                  trigger: 'onBlur',
                  validateTrigger: 'onFous',
                  validator: (rule, value, callback) => {
                    if (value == '') {
                      callback('请输入卡号');
                      return;
                    }
                    if (!(/^(\d{16}|\d{19})$/.test(value))) {
                      callback('请输入正确的卡号');
                      return;
                    }
                    callback();
                  },
                }],
                initialValue: dot.get(this, 'props.itemVal.payee_credit_card_numbers', ''),
              })(
                <Input placeholder="请输入收款人账户" />,
              )}
            </FormItem>
            <FormItem label="开户支行" {...formItemLayout}>
              {getFieldDecorator('payee_bank_address', {
                rules: [{ required: true, message: '请输入开户支行!', trigger: 'onBlur', type: 'string' }],
                initialValue: dot.get(this, 'props.itemVal.payee_bank_address', ''),
              })(
                <Input placeholder="请输入全称" />,
              )}
            </FormItem>
          </Modal>
        </Form>
      </div>
    );
  }
}

const OtherInfo = Form.create()(MoreInfo);

export default OtherInfo;
