// 详情 模版的入口判断页面
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { CoreContent } from '../../../../components/core';
import { ExpenseType } from '../../../../application/define';

// 租房详情
import DetailRent from './detail/rent';
// 报销详情
import DetailRefund from './detail/refund';

class Index extends Component {
  constructor(props) {
    super(props);
    const expenseType = dot.get(props, 'location.query.type', '');
    const recordId = dot.get(props, 'location.query.id');
    const query = dot.get(props, 'location.query', {});
    this.state = {
      recordId,     // 记录id
      expenseType,  // 费用类型
      query,        // 请求参数
    };
  }

  // 渲染详情模版
  renderContent = () => {
    const { expenseType } = this.state;

    // 返回租房模版
    if (expenseType === `${ExpenseType.rent}`) {
      return <DetailRent />;
    }

    // 返回报销模版
    if (expenseType === `${ExpenseType.refund}`) {
      return <DetailRefund />;
    }
    return <div />;
  }

  render = () => {
    const { expenseType } = this.state;
    // 判断类型，如果类型错误，则返回错误信息
    if (expenseType !== `${ExpenseType.rent}` && expenseType !== `${ExpenseType.refund}`) {
      return (
        <CoreContent title="费用类型错误">
          <p>请选择正确的费用类型 <a href="/#/Expense/Manage/Create">重新选择</a></p>
        </CoreContent>
      );
    }

    return this.renderContent();
  }
}

function mapStateToProps({ }) {
  return { };
}
export default connect(mapStateToProps)(Index);
