// 退租表单模块
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form } from 'antd';
import React, { Component } from 'react';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { ExpenseHouseState, renderReplaceAmount } from '../../../../../../application/define';
import { authorize } from '../../../../../../application';

// 详情页面，加载历史记录使用
import DetailRent from '../../detail/rent';

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

  // 基础信息
  renderBaseInfo = () => {
    const { detail } = this.state;
    const formItems = [
      {
        label: '房屋状态',
        form: ExpenseHouseState.description(ExpenseHouseState.cancel),
      }, {
        label: '申请人',
        form: dot.get(detail, 'apply_account', authorize.account.name),
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
    const { detail } = this.state;

    const formItems = [
      {
        label: '退换押金(注：退还押金有变动请说明原因)',
        form: renderReplaceAmount(dot.get(detail, 'deposit', '--')),
      }, {
        label: '备注',
        form: dot.get(detail, 'desc', '--'),
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
    const list = dot.get(detail, 'history_id_list', []) || [];
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
      </Form>
    );
  }
}

function mapStateToProps({ approval }) {
  return { approval };
}
export default connect(mapStateToProps)(Index);
