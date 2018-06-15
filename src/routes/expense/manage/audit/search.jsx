/**
 * 费用审核记录的搜索
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Select, Input } from 'antd';
import { connect } from 'dva';
import { CoreSearch, CoreContent } from '../../../../components/core';
import { ExpenseVerifyState } from '../../../../application/define';

const { Option } = Select;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenseType: dot.get(props, 'approval.typeNameList.result') || [], // 费用类型列表
      search: {
        number: undefined,      // 流水号
        applyName: undefined,   // 申请人
        type: undefined,        // 费用类型
        state: undefined,       // 状态
      },
      onSearch: props.onSearch,       // 搜索回调
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      expenseType: dot.get(props, 'approval.typeNameList.result') || [], // 费用类型列表
    });
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;
    const params = {
      number: undefined,      // 流水号
      applyName: undefined,   // 申请人
      type: undefined,        // 费用类型
      state: undefined,       // 状态
      page: 1,
      limit: 30,
    };
    // 重置数据
    this.setState({ search: params });
    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.state;
    const { number, applyName, type, state } = values;
    const params = {
      examine_id: number,   // 流水号id
      apply_account: applyName,    // 申请人
      costclass_id: type,    // 费用类型
      state,   // 状态
      page: 1,
      limit: 30,
    };
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索功能
  render = () => {
    const { expenseType } = this.state;
    const { number, applyName, type, state } = this.state.search;
    const items = [
      {
        label: '流水号',
        form: form => (form.getFieldDecorator('number', { initialValue: number })(
          <Input placeholder="请填写流水号" />,
        )),
      },
      {
        label: '申请人',
        form: form => (form.getFieldDecorator('applyName', { initialValue: applyName })(
          <Input placeholder="请填写申请人" />,
        )),
      },
      {
        label: '费用类型',
        form: form => (form.getFieldDecorator('type', { initialValue: type })(
          <Select allowClear placeholder="请选择费用类型">
            {
              // 判断expenseType是不是数组
            expenseType.map && expenseType.map((item, index) => {
              return <Option key={index} value={item.costclass_id}>{item.costclass_name}</Option>;
            })
            }
          </Select>,
        )),
      },
      {
        label: '状态',
        form: form => (form.getFieldDecorator('state', { initialValue: state })(
          <Select allowClear placeholder="请选择状态">
            <Option value={`${ExpenseVerifyState.success}`}>{ExpenseVerifyState.description(ExpenseVerifyState.success)}</Option>
            <Option value={`${ExpenseVerifyState.reject}`}>{ExpenseVerifyState.description(ExpenseVerifyState.reject)}</Option>
            <Option value={`${ExpenseVerifyState.pendding}`}>{ExpenseVerifyState.description(ExpenseVerifyState.pendding)}</Option>
            <Option value={`${ExpenseVerifyState.waiting}`}>{ExpenseVerifyState.description(ExpenseVerifyState.waiting)}</Option>
          </Select>,
        )),
      },
    ];

    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      expand: true,
    };
    return (
      <CoreContent style={{ backgroundColor: '#FAFAFA' }}>
        <CoreSearch {...props} />
      </CoreContent>
    );
  };
}
function mapStateToProps({ approval }) {
  return { approval };
}

export default connect(mapStateToProps)(Search);
