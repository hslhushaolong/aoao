// 薪资查询模块, 数据汇总页面-modal
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, message, Modal, Input } from 'antd';
import { SalarySummaryState } from '../../../../application/define';

const [FormItem] = [Form.Item];
class ModalPage extends Component {

  constructor(props) {
    super();
    this.state = {
      isVisibleReject: props.isVisibleReject || false,    // 初始化驳回模态框
    };
  }

  componentWillReceiveProps(props) {
    // 更新状态
    this.setState({
      isVisibleReject: props.isVisibleReject,
    });
  }

  // 驳回薪资单
  onClickReject = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 驳回时添加驳回原因
        if (values.reject_reason === '') {
          return;
        }
        // 关闭模态框
        this.props.updateModalState(false);
        this.props.onUpdateState(SalarySummaryState.failure, values.reject_reason);
      }
    });
    // 重置选择数据
    this.props.form.resetFields();
  }

  // 隐藏驳回模态框
  handleCancel = () => {
    // 关闭模态框
    this.props.updateModalState(false);
  }

  // 渲染模态框
  renderModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { isVisibleReject } = this.state;
    return (
      <Modal
        title="是否驳回"
        visible={isVisibleReject}
        onOk={this.onClickReject}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem label="驳回原因">
            {getFieldDecorator('reject_reason', {
              rules: [{ required: true, message: '请输入驳回原因' }, { max: 20, message: '最多可输入20个字' }],
            })(
              <Input placeholder="请输入驳回原因" />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染模态框 */}
        {this.renderModal()}
      </div>
    );
  }
}

export default connect()(Form.create()(ModalPage));
