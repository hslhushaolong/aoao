/**
 * 公用table
 * */
 // TODO: 重构，废弃该模块。@常敏杰
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
// 基础组件 table 分页用组件pagination
class TableModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: props.columns,
      dataSource: props.dataSource,
    };
  }

  componentWillReceiveProps(nextProps) {
    // TODO 将类型判断转至 React 16版本的写法
    if (Array.isArray(nextProps.columns) && Array.isArray(nextProps.dataSource)) {
      this.setState({
        columns: nextProps.columns,
        dataSource: nextProps.dataSource,
      });
    }
  }

  render() {
    return (
      <div style={{ paddingTop: 16 }}>
        <Table
          columns={this.state.columns} dataSource={this.state.dataSource} pagination={false}
          rowKey={(record, index) => {
            return index;
          }}
        />
      </div>
    );
  }
}
export default connect()(TableModel);
