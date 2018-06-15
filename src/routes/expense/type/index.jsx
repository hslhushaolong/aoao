// 费用类型列表页
import { connect } from 'dva';
import React, { Component } from 'react';
import { Select, Button, Table, Popconfirm, Form, Popover } from 'antd';
import dot from 'dot-prop';
import { authorize } from '../../../application';
import Search from './search';
import { State } from '../transInt';
import Operate from '../../../application/define/operate';

const { Option } = Select;
const FormItem = Form.Item;

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newVisible: true,   // 弹窗
    };
  }
  // 去新建
  goToBuild = () => {
    window.location.href = '/#/Expense/Type/Create';  // 新建费用类型页
  }
  // 去编辑
  goToEdit = (id) => {
    window.location.href = `/#/Expense/Type/Edit?id=${id}`;  // 带上id编辑费用类型页
  }
  // 状态编辑
  changeState = (id, state) => {
    this.props.dispatch({
      type: 'expense/editTypeE',
      payload: {
        _id: id,
        state,  // 0-停用 1-启用 -1-删除
      },
    });
  }
  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.props.dispatch({ type: 'expense/getTypeListE', payload: { page, limit } });
  }
  // 分页
  tableChange = (page, size) => {
    this.props.dispatch({ type: 'expense/getTypeListE', payload: { page, limit: size } });
  }
  renderTable = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: '_id',
        key: '_id',
        render: (text, record, index) => {
          return <div>{index + 1}</div>;
        },
      },
      {
        title: '类型名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建日期',
        dataIndex: 'created_date',
        key: 'created_date',
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
      },

      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return <div>{State[`${text}`]}</div>;
        },
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record) => {
          return (
            <div>
              {
                // 改模版类型创建人是否是当前账号
              record.creator_id !== authorize.account.id ? null :
                // 如果有权限--编辑费用类型
                Operate.canOperateExpenseExpenseTypeButton() ?
                // 如果费用类型是启用
                record.state === 1 ?
                  <div><a onClick={() => { this.goToEdit(record._id); }} style={{ marginRight: '10px' }}>编辑</a>
                    <Popconfirm title="您是否确定停用该费用类型" onConfirm={() => { this.changeState(record._id, 0); }} okText="确定" cancelText="取消">
                      <a>停用</a>
                    </Popconfirm>
                  </div>
                  :
                  <div>
                    <Popconfirm title="您是否确定启用费用类型" onConfirm={() => { this.changeState(record._id, 1); }} okText="确定" cancelText="取消">
                      <a style={{ marginRight: '10px' }}>启用</a>
                    </Popconfirm>
                    <Popconfirm title="您是否确定删除费用类型" onConfirm={() => { this.changeState(record._id, -1); }} okText="确定" cancelText="取消">
                      <a>删除</a>
                    </Popconfirm>
                  </div> : ''
            }
            </div>
          );
        },
      },
    ];

    return (
      <Table
        columns={columns} dataSource={this.props.expense.typeList.data} rowKey={record => record._id}
        pagination={{
          defaultPageSize: 30,
          onChange: this.tableChange,
          total: dot.get(this.props, 'expense.typeList._meta.result_count', 0),
          showTotal: total => `总共${total}条`,
          showQuickJumper: true,
          showSizeChanger: true,
          onShowSizeChange: this.onShowSizeChange,
        }}
      />
    );
  }

  render = () => {
    return (
      <div>
        <Search />
        <div style={{ textAlign: 'right', margin: '10px 0' }}>
          {
            // 权限判断----能否新增费用类型
            Operate.canOperateExpenseExpenseTypeButton() ?
              <Button type="primary" onClick={this.goToBuild}>新增类型</Button> : ''
          }
        </div>
        {this.renderTable()}
      </div>
    );
  }
}

function mapStateToProps({ expense }) {
  return { expense };
}
export default connect(mapStateToProps)(Index);
