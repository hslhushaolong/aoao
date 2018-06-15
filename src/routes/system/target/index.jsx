/**
 * 用户管理
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';

class User extends Component {
  constructor() {
    super();
    this.state = {
      columns: [{
        title: '指标',
        dataIndex: 'date',
        render: (record) => {
          return (
            <div>{`${record.start_date} ~ ${record.end_date}`}</div>
          );
        },
      }, {
        title: '所属类型',
        dataIndex: 'filename',
        key: 'filename',
      }, {
        title: '备注',
        dataIndex: 'city_name',
        key: 'city_name',
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
      }, {
        title: '操作',
        dataIndex: 'delivery_income',
        key: 'delivery_income',
        render: () => {
          return (
            <div>
              <span className="systemColor" style={{ opacity: 0.3, cursor: 'help' }} >编辑</span>
            </div>
          );
        },
      }],
      dataSource: [],
    };
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div>
        <Table pagination={false} columns={this.state.columns} dataSource={this.state.dataSource} bordered />
        <div className="textCenter">
          <Button type="primary" className="mgt8" style={{ opacity: 0.6, color: '#ffffff' }} disabled>添加指标</Button>
        </div>
      </div>
    );
  }
}
export default connect()(User);
