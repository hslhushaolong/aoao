/**
 * Created by Jay
 * 断租弹窗
 *
 * */
import { Form, Input, Modal, DatePicker } from 'antd';
import React, { Component } from 'react';
import aoaoBossTools from './../../../utils/util';
import { authorize } from '../../../application';

const FormItem = Form.Item;

class Break extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,  // 控制modal显示属性
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    });
  }

  handleCancel() {
    // 重置表单
    this.props.form.resetFields();
    // 调用父级方法
    this.props.handleCancel();
  }

  handleOk() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      } else {
        const values = this.props.form.getFieldsValue();
        // house_remaining_sum 房屋保有量
        values.house_remaining_sum = (values.house_remaining_sum);
        // relet_break_date 续租中断日期
        values.relet_break_date = aoaoBossTools.prctoMinute(values.relet_break_date, 2);
        this.props.handleOk(values);
      }
    });
  }

  textInput() {
    this.setState({
      visible: false,
    });
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
      <Form>
        <Modal
          title="断租申请"
          visible={this.state.visible}
          onCancel={this.handleCancel.bind(this)}
          width="450px"
          onOk={this.handleOk.bind(this)}
          okText="确认"
          cancelText="取消"
        >
          <FormItem label={'断租日期'} {...formItemLayout}>
            {getFieldDecorator('relet_break_date', {
              rules: [{ required: true, message: '请输入日期!' }],
            })(
              <DatePicker format={'YYYY-MM-DD'} />,
          )}
          </FormItem>
          <FormItem label={'断租原因'} {...formItemLayout}>
            {getFieldDecorator('note', {
              rules: [{ required: true, message: '请输入收款人!' }],
            })(
              <Input placeholder="请输入原因" onChange={this.textInput.bind(this)} />,
          )}
          </FormItem>
          <FormItem label="结余" {...formItemLayout}>
            {getFieldDecorator('house_remaining_sum', {
              rules: [{ required: true, message: '请输入结余!' }],
            })(
              <Input placeholder="" />,
          )}
          </FormItem>
          <FormItem>
            <p style={{ marginLeft: 80, marginTop: -15 }}>结余 = 返还的租金 - 扣除的押金</p>
          </FormItem>
        </Modal>
      </Form>
    );
  }
}

const BreakModal = Form.create()(Break);

export default BreakModal;
