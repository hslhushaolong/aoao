/**
 * 用户管理
 * 应该没什么用 // 这个应该是亚军留下的没用的那个用户管理，真正的用户管理在user文件夹
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';

class User extends Component {
  constructor() {
    super();
    this.state = {
      columns: [{
        title: '所属时间',
        dataIndex: 'date',
        render: (record) => {
          return (
            <div>{`${record.start_date} ~ ${record.end_date}`}</div>
          );
        },
      }, {
        title: '文件名称',
        dataIndex: 'filename',
        key: 'filename',
      }, {
        title: '状态',
        dataIndex: 'city_name',
        key: 'city_name',
      }, {
        title: '上传时间',
        dataIndex: 'created_at',
        key: 'created_at',
      }, {
        title: '操作',
        dataIndex: 'delivery_income',
        key: 'delivery_income',
        render: () => {
          return (
            <div>
              <span className="systemColor" style={{ cursor: 'help' }}>查看</span>
            </div>
          );
        },
      }],
      dataSource: [],   // 组件没用
    };
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <div>
        <Table pagination={false} columns={this.state.columns} dataSource={this.state.dataSource} bordered />
        <div className="textCenter">
          <Button type="primary" className="mgt8" style={{ opacity: 0.6, color: '#ffffff' }} disabled>添加字段</Button>
        </div>
      </div>
    );
  }
}
export default connect()(User);
