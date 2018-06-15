// 续租, 续签, 断租, 退租 详情页面入口
import dot from 'dot-prop';
import React, { Component } from 'react';
import { ExpenseHouseState } from '../../../../application/define';

// 续租
import RecordsDetailContinue from '../template/records/detail/continue';
// 续签
import RecordsDetailSign from '../template/records/detail/sign';
// 断租
import RecordsDetailBreak from '../template/records/detail/break';
// 退租
import RecordsDetailCancel from '../template/records/detail/cancel';

class Index extends Component {
  constructor(props) {
    super(props);
    const houseState = dot.get(props, 'location.query.houseState', ''); // 通过hosestate判断房屋类型具体见ExpenseHouseState枚举值
    const query = dot.get(props, 'location.query', {}); // 获得地址栏的query参数想后台请求数据
    this.state = {
      houseState,   // 房屋状态
      query,        // 请求参数
    };
  }

  render = () => {
    const { houseState } = this.state;
    switch (Number(houseState)) {
      // 续租
      case ExpenseHouseState.continue: return <RecordsDetailContinue query={this.state.query} />;
      // 续签
      case ExpenseHouseState.sign: return <RecordsDetailSign query={this.state.query} />;
      // 断租
      case ExpenseHouseState.break: return <RecordsDetailBreak query={this.state.query} />;
      // 退租
      case ExpenseHouseState.cancel: return <RecordsDetailCancel query={this.state.query} />;
      default: return <div />;
    }
  }
}

export default Index;
