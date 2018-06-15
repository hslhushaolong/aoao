// 续租, 续签, 断租, 退租 创建表单的入口
import dot from 'dot-prop';
import React, { Component } from 'react';
import { ExpenseHouseState } from '../../../../../application/define';

// 续租
import RecordsFormContinue from '../../template/records/form/continue';
// 续签
import RecordsFormSign from '../../template/records/form/sign';
// 断租
import RecordsFormBreak from '../../template/records/form/break';
// 退租
import RecordsFormCancel from '../../template/records/form/cancel';

class Index extends Component {
  constructor(props) {
    super(props);
    const houseState = dot.get(props, 'location.query.houseState', '');
    const query = dot.get(props, 'location.query', {});
    this.state = {
      houseState,   // 房屋状态
      query,        // 请求参数
    };
  }

  render = () => {
    const { houseState } = this.state;
    switch (Number(houseState)) {
      // 续租
      case ExpenseHouseState.continue: return <RecordsFormContinue query={this.state.query} />;
      // 续签
      case ExpenseHouseState.sign: return <RecordsFormSign query={this.state.query} />;
      // 断租
      case ExpenseHouseState.break: return <RecordsFormBreak query={this.state.query} />;
      // 退租
      case ExpenseHouseState.cancel: return <RecordsFormCancel query={this.state.query} />;
      default: return <div />;
    }
  }
}

export default Index;
