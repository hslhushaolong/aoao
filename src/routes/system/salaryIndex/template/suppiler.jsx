// 百度模版
import React, { Component } from 'react';
import { Table } from 'antd';

class supplierTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: nextProps.dataSource,
    });
  }

  render() {
    // 写死没有接口
    const { dataSource } = this.state;

    const columns = [{
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    }, {
      title: '指标单位',
      dataIndex: 'unit',
      key: 'unit',
      width: '10%',
    }, {
      title: '指标定义',
      dataIndex: 'definition',
      key: 'definition',
    }];
    return (
      <Table
        style={{ marginTop: '10px' }}
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={false}
      />
    );
  }
}
export default supplierTemplate;
