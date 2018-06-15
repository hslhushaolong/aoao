/**
 * 薪资模板设置模块
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Modal, Form, Slider, AutoComplete } from 'antd';
import { CoreForm } from '../../../../components/core';

class SalaryModal extends Component {
  constructor(props) {
    super();
    this.state = {
      title: props.title ? props.title : undefined,           // 标题
      value: props.value ? props.value : undefined,           // 数据: title timees
      onSubmit: props.onSubmit ? props.onSubmit : undefined,  // 提交参数
      onCancle: props.onCancle ? props.onCancle : undefined,  // 可见状态变更回调
      visible: props.visible ? props.visible : false,         // 是否显示弹窗
    };
    this.private = {
      form: undefined,
      modal: undefined,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      title: nextProps.title ? nextProps.title : undefined,           // 标题
      value: nextProps.value ? nextProps.value : undefined,           // 数据
      onSubmit: nextProps.onSubmit ? nextProps.onSubmit : undefined,  // 提交参数
      onCancle: nextProps.onCancle ? nextProps.onCancle : undefined,  // 可见状态变更回调
      visible: nextProps.visible ? nextProps.visible : false,         // 是否显示弹窗
    });
  }

  // 添加项目
  onSubmit = () => {
    const { onSubmit } = this.state;
    this.props.form.validateFields((err, values) => {
      // 错误判断
      if (err) {
        return;
      }
      if (onSubmit) {
        onSubmit(values);
      }
    });

    // 隐藏弹窗
    this.setState({ visible: false, value: '' });
    this.props.form.setFields({ title: '', times: [1, 31] });
  }

  // 取消
  onCancle = () => {
    // 回调函数，提交
    const { onCancle } = this.state;
    if (onCancle) {
      onCancle();
    }

    // 隐藏弹窗
    this.setState({ visible: false, value: '' });
    this.props.form.setFields({ title: '' });
  }

  render() {
    const { onSubmit, onCancle } = this;
    const { title, value, visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    let formItems = [
      {
        label: '名称',
        form: getFieldDecorator('title', { initialValue: dot.get(value, 'title', '') })(<AutoComplete placeholder="请输入名称" />),
      },
      {
        label: '时间段',
        form: getFieldDecorator('times', { initialValue: dot.get(value, 'times', [1, 31]) })(<Slider range min={1} max={31} />),
      },
    ];
    if (title === '添加薪资项目') {
      formItems = [
        {
          label: '名称',
          form: getFieldDecorator('title', { initialValue: dot.get(value, 'title', '') })(<AutoComplete placeholder="请输入名称" />),
        },
      ];
    }
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={onSubmit}
        onCancel={onCancle}
      >
        <Form layout="horizontal">
          <CoreForm items={formItems} cols={1} />
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(SalaryModal);
