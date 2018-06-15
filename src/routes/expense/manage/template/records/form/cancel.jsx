// 退租表单模块
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form, Button, Input, message } from 'antd';
import React, { Component } from 'react';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { ExpenseHouseState } from '../../../../../../application/define';
import { authorize } from '../../../../../../application';

// 详情页面，加载历史记录使用
import DetailRent from '../../detail/rent';

const { TextArea } = Input;

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordId: props.query.recordId, // 单条数据id
      detail: dot.get(props, 'approval.typeApplyDetail', {}), // 详情数据
    };
    this.private = {
      dispatch: this.props.dispatch,
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      recordId: props.query.recordId, // 单条数据id
      detail: dot.get(props, 'approval.typeApplyDetail', {}), // 详情数据
    });
  }

  // 提交模版
  onSubmitTemplate = (e) => {
    const { dispatch } = this.private;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('错误', err);
      }
      const params = {
        order_id: this.state.recordId,
        desc: values.note,
        deposit: parseFloat(values.leftMoney),
      };
      this.props.dispatch({
        type: 'approval/typeApplyEditRentE',
        payload: params,
      });
    });
  }

  // 基础信息
  renderBaseInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '房屋状态',
        form: ExpenseHouseState.description(ExpenseHouseState.cancel),
      }, {
        label: '申请人',
        form: dot.get(detail, 'applyName', authorize.account.name),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="基础信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 费用信息
  renderRentInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.state;

    const formItems = [
      {
        label: '退换押金(注：退还押金有变动请说明原因)',
        form: getFieldDecorator('leftMoney', {
          initialValue: dot.get(detail, 'deposit', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="" addonAfter="元" />,
          ),
      }, {
        label: '备注',
        form: getFieldDecorator('note', { initialValue: undefined })(
          <TextArea rows={2} />,
        ),
      },

    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="费用信息">
        <CoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 历史信息
  renderHistoryInfo = () => {
    const { detail } = this.state;
    const list = dot.get(detail, 'history_id_list', []);
    return (
      <CoreContent title="历史信息">
        {list.map((item, index) => {
          return <DetailRent key={index} detail={item} />;
        })}
      </CoreContent>
    );
  }

  render = () => {
    return (
      <Form layout="horizontal" onSubmit={this.onSubmitTemplate}>
        {/* 基础信息 */}
        {this.renderBaseInfo()}

        {/* 费用信息 */}
        {this.renderRentInfo()}

        {/* 历史信息 */}
        {this.renderHistoryInfo()}

        {/* 表单提交按钮 */}
        <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
          <Button type="primary" htmlType="submit">提交</Button>
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ approval }) {
  return { approval };
}
export default connect(mapStateToProps)(Form.create()(Index));
