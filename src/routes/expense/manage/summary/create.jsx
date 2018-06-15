// 总流水单提交页面
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { CoreContent } from '../../../../components/core';
import { ExpenseType } from '../../../../application/define';

// 薪资提交页面相关
import SummaryFormSalary from './form/salary';
// 租房提交页面相关
import SummaryFormRent from './form/rent';
// 报销提交页面相关
import SummaryFormRefund from './form/refund';

class Index extends Component {
  constructor(props) {
    super(props);
    const expenseType = dot.get(props, 'location.query.type');
    const summaryId = dot.get(props, 'location.query.summaryId');

    this.state = {
      summaryId,    // 汇总记录id
      expenseType: Number(expenseType),  // 费用类型
    };

    this.private = {
      dispatch: this.props.dispatch,
    };
  }

  // 渲染详情模版
  renderContent = () => {
    const { dispatch } = this.private;
    const { expenseType, summaryId } = this.state;

    // 租房相关页面
    if (expenseType === ExpenseType.rent) {
      return <SummaryFormRent summaryId={summaryId} />;
    }

    // 报销相关页面
    if (expenseType === ExpenseType.refund) {
      return <SummaryFormRefund summaryId={summaryId} />;
    }

    // 薪资相关页面
    if (expenseType === ExpenseType.salary) {
      return <SummaryFormSalary summaryId={summaryId} />;
    }

    return <div />;
  }

  render = () => {
    const { expenseType, summaryId } = this.state;

    // 判断数据id
    if (is.empty(summaryId) || is.not.existy(summaryId)) {
      return (
        <CoreContent title="数据Id错误">
          <p>无法获取页面详情数据</p>
        </CoreContent>
      );
    }

    // 判断类型，如果类型错误，则返回错误信息
    if (expenseType !== ExpenseType.rent && expenseType !== ExpenseType.refund && expenseType !== ExpenseType.salary) {
      return (
        <CoreContent title="费用类型错误">
          <p>请选择正确的费用类型</p>
        </CoreContent>
      );
    }

    // 渲染内容
    return this.renderContent();
  }
}

export default Index;
