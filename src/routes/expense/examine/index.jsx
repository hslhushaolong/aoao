// 审批流列表页面
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Select, Button, Table, Modal, Row, Col, Input, message, Popconfirm, Form, Popover } from 'antd';
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
      newVisible: true,     // 弹窗
    };
  }
  // 去新建
  goToBuild = () => {
    window.location.href = '/#/Expense/Examine/Create';  // 去新建页面
  }
  // 去编辑
  goToEdit = (id) => {
    window.location.href = `/#/Expense/Examine/Edit?id=${id}`; // 带上ID去编辑页面
  }
  // 状态编辑
  changeState = (id, state) => {
    // 停用启用编辑接口
    this.props.dispatch({
      type: 'expense/editExamineE',
      payload: {
        _id: id,
        state,  // 0-停用， 1-启用， -1-删除
      },
    });
  }
  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.props.dispatch({ type: 'expense/getEXamineListE', payload: { page, limit } });
  }
  // 分页
  tableChange = (page, size) => {
    this.props.dispatch({ type: 'expense/getEXamineListE', payload: { page, limit: size } });
  }
  // 渲染表单
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
        title: '审批流名称',
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
        title: '描述',
        dataIndex: 'desc',
        key: 'desc',
        render: (text) => {
          if (text === '') {
            return '--';
          }
          return (
            // 秒速长度大于8个字要气泡显示
            <div>{text.length <= 8 ? text :
            <Popover content={text} title="科目描述" trigger="hover">
              <div>{text.length <= 8 ? text : text.substr(0, 8)}</div>
            </Popover>}
            </div>
          );
        },
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
            <div>{
              // 创建人的id不是当前账号就不显示操作
              record.creator_id !== authorize.account.id ? null :
              // 这是能不能操作的权限判断能才显示
              Operate.canOperateExpenseExamineEditButton() ?
              // 审批流状态是启用才能选停用 // 0-停用，1-启用，-1删除
              record.state === 1 ? <div><a onClick={() => { this.goToEdit(record._id); }} style={{ marginRight: '10px' }}>编辑</a>
                <Popconfirm title="您是否确定停用该审批流" onConfirm={() => { this.changeState(record._id, 0); }} okText="确定" cancelText="取消">
                  <a>停用</a>
                </Popconfirm>
              </div> : <div>
                <Popconfirm title="您是否确定启用该审批流" onConfirm={() => { this.changeState(record._id, 1); }} okText="确定" cancelText="取消">
                  <a style={{ marginRight: '10px' }}>启用</a>
                </Popconfirm>
                <Popconfirm title="您是否确定删除该审批流" onConfirm={() => { this.changeState(record._id, -1); }} okText="确定" cancelText="取消">
                  <a>删除</a>
                </Popconfirm></div> : ''
            }
            </div>
          );
        },
      },
    ];

    return (
      <Table
        columns={columns} dataSource={this.props.expense.examineList.data} rowKey={record => record._id}
        pagination={{
          defaultPageSize: 30,
          onChange: this.tableChange,
          total: dot.get(this.props, 'expense.examineList._meta.result_count', 0),
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
            // 新增审批流权限
            Operate.canOperateExpenseExamineEditButton() ?
              <Button type="primary" onClick={this.goToBuild}>新增审批流</Button> : ''
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
