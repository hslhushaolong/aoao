/**
 * 薪资模板模态框
 */
import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const [FormItem] = [Form.Item];

class ModalCom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible || false,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      visible: nextProps.visible || false,
    });
  }
  // 提交
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // 确保父级有onHandleSubmit方法
      if (this.props.onHandleSubmit) {
        this.props.onHandleSubmit(values);
      }
      // 初始化
      this.props.form.resetFields();
    });
  }
  // 取消
  onCancel = () => {
    // 初始化
    this.props.onCancel(); // 调用父级，取消modal
    this.props.form.resetFields();
  }

  // 搜索功能
  render = () => {
    const { onCancel, onSubmit } = this;
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        visible={visible}
        title="确认信息"
        okText="确定"
        onCancel={onCancel}
        onOk={onSubmit}
      >
        <Form layout="vertical">
          <FormItem label="原因">
            {getFieldDecorator('description', {
              rules: [{ required: true, message: '请输入驳回原因' }],
            })(<Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  };
}

export default Form.create()(ModalCom);
